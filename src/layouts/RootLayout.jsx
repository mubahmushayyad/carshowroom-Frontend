import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ClientTopbar from '../components/layout/ClientTopbar';
import { useAuth } from '../context/AuthContext';
import { clientColors } from '../theme/theme';

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  if (user?.role === 'Customer') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: clientColors.bg }}>
        <ClientTopbar />
        <Box component="main">{children}</Box>
      </Box>
    );
  }

  const items =
    user?.role === 'Sales Manager'
      ? [
          { label: 'Dashboard', path: '/sales' },
          { label: 'Showroom', path: '/customer/showroom' },
          { label: 'Customers', path: '/sales/customers' },
          { label: 'Applications', path: '/sales/applications' },
          { label: 'Reports', path: '/sales/reports' },
        ]
      : user?.role === 'Inventory Manager'
      ? [
          { label: 'Dashboard', path: '/inventory' },
          { label: 'Cars', path: '/inventory/cars' },
          { label: 'Suppliers', path: '/inventory/suppliers' },
          { label: 'Reports', path: '/inventory/reports' },
        ]
      : [
          { label: 'Dashboard', path: '/admin' },
          { label: 'Cars', path: '/admin/cars' },
          { label: 'Suppliers', path: '/admin/suppliers' },
          { label: 'Customers', path: '/admin/customers' },
          { label: 'Applications', path: '/admin/applications' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Reports', path: '/admin/reports' },
          { label: 'Settings', path: '/admin/settings' },
        ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ width: 250, display: { xs: 'none', md: 'block' }, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Sidebar items={items} />
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }}>
          <Sidebar items={items} onNavigate={() => setOpen(false)} />
        </Box>
      </Drawer>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Topbar onMenu={() => setOpen(true)} />
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
