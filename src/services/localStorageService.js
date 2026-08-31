import { STORAGE, DEMO_USERS, COLORS } from "../utils/constants";
import { seedCars } from "../data/seedCars";
import { seedSuppliers } from "../data/seedSuppliers";
import { seedCustomers } from "../data/seedCustomers";
export const getData = (key, fallback = []) => {
  try {
    const x = localStorage.getItem(key);
    return x ? JSON.parse(x) : fallback;
  } catch {
    return fallback;
  }
};
export const setData = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));
export const removeData = (k) => localStorage.removeItem(k);
export const clearData = (k) => localStorage.removeItem(k);
export const generateId = (p) =>
  `${p}-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 999,
  )
    .toString()
    .padStart(3, "0")}`;
export function seedInitialData() {
  if (!localStorage.getItem(STORAGE.USERS)) setData(STORAGE.USERS, DEMO_USERS);
  if (!localStorage.getItem(STORAGE.SUPPLIERS))
    setData(STORAGE.SUPPLIERS, seedSuppliers);
  if (!localStorage.getItem(STORAGE.CARS)) setData(STORAGE.CARS, seedCars);
  if (!localStorage.getItem(STORAGE.CUSTOMERS))
    setData(STORAGE.CUSTOMERS, seedCustomers);
  if (!localStorage.getItem(STORAGE.APPLICATIONS))
    setData(STORAGE.APPLICATIONS, []);
  if (!localStorage.getItem(STORAGE.NOTIFICATIONS))
    setData(STORAGE.NOTIFICATIONS, []);
  if (!localStorage.getItem(STORAGE.ACTIVITY)) setData(STORAGE.ACTIVITY, []);
  if (!localStorage.getItem(STORAGE.SETTINGS))
    setData(STORAGE.SETTINGS, {
      darkMode: true,
      brand: "U Devs Car Showroom",
    });
}
export function logActivity(action, entity, details, user = "System") {
  const rows = getData(STORAGE.ACTIVITY, []);
  rows.unshift({
    id: generateId("ACT"),
    action,
    entity,
    details,
    user,
    createdAt: new Date().toISOString(),
  });
  setData(STORAGE.ACTIVITY, rows.slice(0, 100));
}
export function notify(userId, title, message) {
  const rows = getData(STORAGE.NOTIFICATIONS, []);
  rows.unshift({
    id: generateId("NTF"),
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  setData(STORAGE.NOTIFICATIONS, rows.slice(0, 100));
}
