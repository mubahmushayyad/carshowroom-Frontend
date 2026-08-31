import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE } from "../utils/constants";
import {
  getData,
  setData,
  seedInitialData,
  logActivity,
  notify,
  generateId,
} from "../services/localStorageService";
const C = createContext(null);
export function AppProvider({ children }) {
  const [cars, setCars] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [customers, setCustomers] = useState([]),
    [applications, setApplications] = useState([]),
    [users, setUsers] = useState([]),
    [notifications, setNotifications] = useState([]),
    [activity, setActivity] = useState([]),
    [settings, setSettings] = useState({ darkMode: true });
  const refresh = () => {
    setCars(getData(STORAGE.CARS));
    setSuppliers(getData(STORAGE.SUPPLIERS));
    setCustomers(getData(STORAGE.CUSTOMERS));
    setApplications(getData(STORAGE.APPLICATIONS));
    setUsers(getData(STORAGE.USERS));
    setNotifications(getData(STORAGE.NOTIFICATIONS));
    setActivity(getData(STORAGE.ACTIVITY));
    setSettings(getData(STORAGE.SETTINGS, { darkMode: true }));
  };
  useEffect(() => {
    seedInitialData();
    refresh();
  }, []);
  const persist = (key, data, setter, action, entity, details, user) => {
    setData(key, data);
    setter(data);
    if (action) logActivity(action, entity, details, user);
    setActivity(getData(STORAGE.ACTIVITY));
  };
  const saveCar = (car, user = "System") => {
    const exists = cars.some((x) => x.id === car.id);
    const next = exists
      ? cars.map((x) => (x.id === car.id ? car : x))
      : [...cars, { ...car, id: car.id || generateId("CAR") }];
    persist(
      STORAGE.CARS,
      next,
      setCars,
      exists ? "Updated" : "Created",
      "Car",
      `${car.make} ${car.model}`,
      user,
    );
  };
  const deleteCar = (id, user = "System") => {
    const c = cars.find((x) => x.id === id);
    persist(
      STORAGE.CARS,
      cars.filter((x) => x.id !== id),
      setCars,
      "Deleted",
      "Car",
      c?.id,
      user,
    );
  };
  const saveSupplier = (s, user = "System") => {
    const exists = suppliers.some((x) => x.id === s.id);
    const next = exists
      ? suppliers.map((x) => (x.id === s.id ? s : x))
      : [...suppliers, { ...s, id: s.id || generateId("SUP") }];
    persist(
      STORAGE.SUPPLIERS,
      next,
      setSuppliers,
      exists ? "Updated" : "Created",
      "Supplier",
      s.company,
      user,
    );
  };
  const deleteSupplier = (id, user = "System") => {
    const s = suppliers.find((x) => x.id === id);
    persist(
      STORAGE.SUPPLIERS,
      suppliers.filter((x) => x.id !== id),
      setSuppliers,
      "Deleted",
      "Supplier",
      s?.company,
      user,
    );
  };
  const saveCustomer = (c, user = "System") => {
    const exists = customers.some((x) => x.id === c.id);
    const next = exists
      ? customers.map((x) => (x.id === c.id ? c : x))
      : [...customers, { ...c, id: c.id || generateId("CUS") }];
    persist(
      STORAGE.CUSTOMERS,
      next,
      setCustomers,
      exists ? "Updated" : "Created",
      "Customer",
      c.name,
      user,
    );
  };
  const deleteCustomer = (id, user = "System") => {
    const c = customers.find((x) => x.id === id);
    persist(
      STORAGE.CUSTOMERS,
      customers.filter((x) => x.id !== id),
      setCustomers,
      "Deleted",
      "Customer",
      c?.name,
      user,
    );
  };
  const saveApplication = (a, user = "System") => {
    const next = [
      ...applications,
      {
        ...a,
        id: a.id || generateId("APP"),
        createdAt: a.createdAt || new Date().toISOString(),
      },
    ];
    persist(
      STORAGE.APPLICATIONS,
      next,
      setApplications,
      "Created",
      "Application",
      next.at(-1).id,
      user,
    );
    notify(
      a.userId || a.customerUserId,
      "Application received",
      `Your ${next.at(-1).id} application is now Pending.`,
    );
    setNotifications(getData(STORAGE.NOTIFICATIONS));
    return next.at(-1);
  };
  const updateApplication = (id, patch, user = "Staff") => {
    const current = applications.find((a) => a.id === id);
    const next = applications.map((a) =>
      a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a,
    );
    persist(
      STORAGE.APPLICATIONS,
      next,
      setApplications,
      "Status updated",
      "Application",
      `${id}: ${patch.status || ""}`,
      user,
    );
    if (current && patch.status && patch.status !== current.status)
      notify(
        current.userId,
        "Application status updated",
        `${id} is now ${patch.status}.`,
      );
    setNotifications(getData(STORAGE.NOTIFICATIONS));
  };
  const saveSettings = (s) => {
    setData(STORAGE.SETTINGS, s);
    setSettings(s);
  };
  const markRead = (id) => {
    const n = notifications.map((x) =>
      x.id === id ? { ...x, read: true } : x,
    );
    setData(STORAGE.NOTIFICATIONS, n);
    setNotifications(n);
  };
  const resetDemo = () => {
    Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
    seedInitialData();
    refresh();
  };
  const value = useMemo(
    () => ({
      cars,
      suppliers,
      customers,
      applications,
      users,
      notifications,
      activity,
      settings,
      saveCar,
      deleteCar,
      saveSupplier,
      deleteSupplier,
      saveCustomer,
      deleteCustomer,
      saveApplication,
      updateApplication,
      saveSettings,
      markRead,
      resetDemo,
      refresh,
    }),
    [
      cars,
      suppliers,
      customers,
      applications,
      users,
      notifications,
      activity,
      settings,
    ],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useApp = () => useContext(C);
