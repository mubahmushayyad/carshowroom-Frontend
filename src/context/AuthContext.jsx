import { createContext, useContext, useState } from 'react';
import { STORAGE, DEMO_USERS } from '../utils/constants';
import { getData, setData } from '../services/localStorageService';

const C = createContext(null);

function ensureUsers() {
  const existing = getData(STORAGE.USERS, null);

  // Always make sure the required demo accounts exist. This also repairs
  // an old/empty LocalStorage entry from an earlier version of the app.
  if (!Array.isArray(existing)) {
    setData(STORAGE.USERS, DEMO_USERS);
    return DEMO_USERS;
  }

  const users = [...existing];
  let changed = false;

  DEMO_USERS.forEach((demo) => {
    const index = users.findIndex(
      (user) => String(user.email || '').trim().toLowerCase() === demo.email.toLowerCase()
    );

    if (index === -1) {
      users.push(demo);
      changed = true;
    } else if (!users[index].password || !users[index].role) {
      users[index] = { ...users[index], ...demo };
      changed = true;
    }
  });

  if (changed) setData(STORAGE.USERS, users);
  return users;
}

export function AuthProvider({ children }) {
  // Seed users synchronously before the first render. This is important
  // because AppProvider's useEffect runs too late for authentication data.
  ensureUsers();

  const [user, setUser] = useState(() => getData(STORAGE.SESSION, null));

  const login = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const enteredPassword = String(password || '').trim();
    const users = ensureUsers();

    const found = users.find(
      (candidate) =>
        String(candidate.email || '').trim().toLowerCase() === normalizedEmail &&
        String(candidate.password || '') === enteredPassword
    );

    if (!found) return false;

    const safeUser = { ...found };
    delete safeUser.password;
    setData(STORAGE.SESSION, safeUser);
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE.SESSION);
    setUser(null);
  };

  return <C.Provider value={{ user, login, logout }}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
