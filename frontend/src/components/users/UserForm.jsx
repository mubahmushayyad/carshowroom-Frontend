import { Stack, TextField, MenuItem } from '@mui/material';
import { ROLES } from '../../utils/constants';

const roleOptions = Object.values(ROLES);

export default function UserForm({ form, errors, onChange }) {
  const set = (key) => (e) => onChange({ ...form, [key]: e.target.value });

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="Full Name"
        value={form.name || ''}
        onChange={set('name')}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        autoFocus
      />
      <TextField
        label="Email"
        type="email"
        value={form.email || ''}
        onChange={set('email')}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />
      <TextField
        select
        label="Role"
        value={form.role || ''}
        onChange={set('role')}
        error={!!errors.role}
        helperText={errors.role}
        fullWidth
      >
        {roleOptions.map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Status"
        value={form.status || 'Active'}
        onChange={set('status')}
        error={!!errors.status}
        helperText={errors.status}
        fullWidth
      >
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </TextField>
    </Stack>
  );
}
