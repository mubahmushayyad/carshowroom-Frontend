# Final submission checklist

## Redux User Module (Redux Implementation Guide assignment)
- [x] Redux Toolkit store configured (`src/app/store.js`), registered as `userReducer`.
- [x] `userSlice.js` — initial state, reducers, `extraReducers` for pending/fulfilled/rejected.
- [x] `userActions.js` — async `fetchUsers`, `createUser`, `updateUser`, `deleteUser` via `createAsyncThunk`.
- [x] `userApi.js` — Axios calls only, separated from components.
- [x] `UserForm` / `UserTable` / `UserModal` / `DeleteUserModal` components.
- [x] `Users.jsx` page dispatches actions and reads state via `useSelector`.
- [x] Redux `Provider` added in `main.jsx` without removing existing `AppProvider`/`AuthProvider`.
- [x] Loading, error and success states handled in the UI.
- [x] Validation: required fields, email format, duplicate-email check, delete confirmation.
- [x] Mock API (`json-server`) included and verified against the full CRUD contract so the module runs without a real backend.
- [ ] Point `VITE_API_URL` at the group's real backend once it's ready and re-test.
- [ ] Screenshot the Users page + Redux DevTools action log for the README.

## Core app
- [ ] `npm install` completes on a clean machine.
- [ ] `npm run dev` opens the login page.
- [ ] Admin, Sales Manager, Inventory Manager and Customer accounts work.
- [ ] Role-specific navigation is enforced.
- [ ] Car create/edit/delete works and survives refresh.
- [ ] Supplier CRUD and car supplier linking works.
- [ ] Profit and margin update from purchase/selling prices.
- [ ] Customer can browse only available cars and configured colors.
- [ ] Customer application validation and unique ID work.
- [ ] Staff can update application status.
- [ ] Customer only sees their own applications.
- [ ] Dashboard KPIs are dynamic.
- [ ] Reports and CSV export work.
- [ ] Notifications/activity are stored locally.
- [ ] Mobile layout has no horizontal overflow.
- [ ] No major console errors.
- [ ] Push this source to GitHub with meaningful commits.
- [ ] Add screenshots to the README before final submission if desired.
