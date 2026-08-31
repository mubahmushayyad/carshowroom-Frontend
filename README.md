# U Devs Car Showroom Management System

A frontend React.js business application for the U Devs internship assignment. It uses Material UI, Bootstrap, React Router and LocalStorage for the core app, plus a **Redux Toolkit + Axios User Management module** (see below) built for the Redux Implementation Guide assignment.

## Run
```bash
npm install
npm run dev
```

This starts the app against LocalStorage as before. **To use the Users module** (Admin → Users), also start the mock API in a second terminal — see [Redux User Module](#redux-user-management-module-new) below.

## Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@udevs.com | Admin@123 |
| Sales Manager | sales@udevs.com | Sales@123 |
| Inventory Manager | inventory@udevs.com | Inventory@123 |
| Customer | customer@udevs.com | Customer@123 |

## Features
- Role-based login and protected routes
- Admin, Sales Manager, Inventory Manager and Customer portals
- Car CRUD with validation, search, filters and sorting
- Automatic gross profit and margin calculations
- Supplier CRUD and supplier-to-car linking
- Customer management
- Customer showroom, car details and application workflow
- Application statuses: Pending, Approved, Rejected, Reserved, Completed
- Customer sees only their own applications
- Local notifications and audit activity log
- Dynamic dashboards and reports
- CSV profit report export
- Wishlist and three-car comparison
- Dark/light mode
- Responsive sidebar/mobile drawer
- LocalStorage persistence and first-run seed data

## Redux User Management Module (new)

Implements Admin → Users as a proper Redux Toolkit + Axios flow, per the U Devs Redux Implementation Guide:

```
Users.jsx (page)
  → UserForm / UserTable / UserModal / DeleteUserModal
  → dispatch(fetchUsers / createUser / updateUser / deleteUser)
  → userActions.js (createAsyncThunk)
  → userApi.js (Axios)
  → Backend API  (/api/users)
  → userSlice.js extraReducers
  → Redux store
  → useSelector() → UI
```

### Files added
| File | Responsibility |
|---|---|
| `src/app/store.js` | Redux Toolkit store, registers `userReducer` |
| `src/redux/users/userSlice.js` | Initial state, reducers, `extraReducers` for pending/fulfilled/rejected |
| `src/redux/users/userActions.js` | Async thunks: `fetchUsers`, `createUser`, `updateUser`, `deleteUser` |
| `src/redux/users/userSelectors.js` | `state.users.*` selectors |
| `src/services/userApi.js` | Axios instance + `/users` REST calls (no UI code) |
| `src/components/users/UserForm.jsx` | Name / email / role / status fields |
| `src/components/users/UserTable.jsx` | Table with edit/delete actions, loading/empty states |
| `src/components/users/UserModal.jsx` | Add/Edit dialog wrapping `UserForm` |
| `src/components/users/DeleteUserModal.jsx` | Delete confirmation |
| `src/pages/admin/Users.jsx` | Rewritten to use Redux instead of static data |
| `src/utils/validators.js` | Added `validateUser` (required fields, email format, duplicate-email check) |

The Redux `Provider` in `src/main.jsx` wraps the existing `AppProvider`/`AuthProvider`, so the original LocalStorage-based Cars/Suppliers/Applications/Customers modules are untouched — this is a second, independent state layer used only by the Users module.

### Backend
The app expects a REST API matching:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

Set the base URL in `.env`:
```
VITE_API_URL=http://localhost:4000/api
```

**No real backend yet?** A mock API is included using `json-server`, seeded with the same demo accounts, so the module is fully testable end-to-end right now:
```bash
npm run mock-api      # serves the /api/users contract on port 4000
npm run dev            # in a second terminal
```
Once your group's real backend is ready, just point `VITE_API_URL` at it — no frontend code changes needed, per the guide's separation of concerns (only `userApi.js` should ever need adjusting, e.g. if the backend wraps responses in `{ data: [...] }`).

### Testing the Redux flow
1. Open **Admin → Users** — `fetchUsers` dispatches and the table populates.
2. **Add User** — fills required fields, dispatches `createUser`, new row appears without a page refresh.
3. **Edit** — dispatches `updateUser`, row updates in place.
4. **Delete** — confirms via `DeleteUserModal`, dispatches `deleteUser`, row disappears.
5. Stop `npm run mock-api` and retry an action — the error alert appears and loading stops.
6. Open Redux DevTools — you'll see `users/fetchUsers/pending`, `.../fulfilled`, `users/createUser/pending`, etc.

## LocalStorage Keys
`udevs_users`, `udevs_session`, `udevs_cars`, `udevs_suppliers`, `udevs_customers`, `udevs_applications`, `udevs_notifications`, `udevs_activity_logs`, `udevs_settings`.

## Business Rules
- Profit = Selling Price - Purchase Rate
- Profit Margin = (Profit / Selling Price) * 100
- Low stock threshold = 2 or fewer available units
- Customer may only apply to Available cars and select configured colors
- Application status starts at Pending
- Delete actions use confirmation dialogs
- CNIC uses a basic Pakistani pattern and phone uses `03XXXXXXXXX`

## Structure
`components/` reusable UI, `context/` shared state/auth, `data/` seed data, `hooks/` reusable hooks, `pages/` screens, `routes/` guards/navigation, `services/` LocalStorage abstraction, `utils/` validation/calculations/formatting, `theme/` MUI theme.

## Testing Notes
1. Login with each demo role and verify the role-specific navigation.
2. Add/edit/delete a car and refresh to confirm persistence.
3. Add/edit a supplier and link a car to it.
4. Log in as Customer, browse the showroom, open a car and submit an application.
5. Log in as Admin/Sales, update the application status.
6. Return to Customer and verify the updated status.
7. Check Reports and CSV export.
8. Resize the browser to mobile width and verify navigation and tables remain usable.

## Known limitations
This is intentionally a frontend prototype. Authentication is simulated and data is stored in the browser's LocalStorage. Vehicle images are public demo image URLs.
