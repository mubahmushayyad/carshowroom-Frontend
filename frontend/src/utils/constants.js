export const ROLES={ADMIN:'Admin',SALES:'Sales Manager',INVENTORY:'Inventory Manager',CUSTOMER:'Customer'};
export const STATUS={AVAILABLE:'Available',RESERVED:'Reserved',SOLD:'Sold',INACTIVE:'Inactive'};
export const APP_STATUS=['Pending','Approved','Rejected','Reserved','Completed'];
export const COLORS=['White','Black','Silver','Blue','Red','Grey'];
export const FUEL=['Petrol','Hybrid','EV','Diesel'];
export const TRANSMISSION=['Automatic','Manual'];
export const LOW_STOCK=2;
export const STORAGE={USERS:'udevs_users',SESSION:'udevs_session',CARS:'udevs_cars',SUPPLIERS:'udevs_suppliers',CUSTOMERS:'udevs_customers',APPLICATIONS:'udevs_applications',NOTIFICATIONS:'udevs_notifications',ACTIVITY:'udevs_activity_logs',SETTINGS:'udevs_settings'};
export const DEMO_USERS=[
{id:'USR-001',name:'System Admin',email:'admin@udevs.com',password:'Admin@123',role:ROLES.ADMIN},
{id:'USR-002',name:'Sales Manager',email:'sales@udevs.com',password:'Sales@123',role:ROLES.SALES},
{id:'USR-003',name:'Inventory Manager',email:'inventory@udevs.com',password:'Inventory@123',role:ROLES.INVENTORY},
{id:'USR-004',name:'Demo Customer',email:'customer@udevs.com',password:'Customer@123',role:ROLES.CUSTOMER,phone:'03001234567',cnic:'35202-1234567-1',address:'Lahore, Pakistan',city:'Lahore'}
];
