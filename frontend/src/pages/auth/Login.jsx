import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@udevs.com"),
    [password, setPassword] = useState("Admin@123"),
    [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) {
      setErr("Invalid email or password.");
      return;
    }
    nav(
      u.role === "Admin"
        ? "/admin"
        : u.role === "Sales Manager"
          ? "/sales"
          : u.role === "Inventory Manager"
            ? "/inventory"
            : "/customer",
    );
  };
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "linear-gradient(135deg,#071a2f,#0b5fa5)" }}
      p={2}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          maxWidth: 520,
          borderRadius: 4,
        }}
      >
        <Stack spacing={2}>
          <Box textAlign="center">
            <DirectionsCarIcon sx={{ fontSize: 55 }} />
            <Typography variant="h4" fontWeight={900}>
              U Devs Car Showroom
            </Typography>
            <Typography color="text.secondary">
              Professional React business application
            </Typography>
          </Box>
          {err && <Alert severity="error">{err}</Alert>}
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button type="submit" size="large" variant="contained">
                Sign in
              </Button>
            </Stack>
          </form>
          <Typography variant="subtitle2">Demo accounts</Typography>
          <Stack spacing={0.5}>
            {[
              ["Admin", "admin@udevs.com", "Admin@123"],
              ["Sales", "sales@udevs.com", "Sales@123"],
              ["Inventory", "inventory@udevs.com", "Inventory@123"],
              ["Customer", "customer@udevs.com", "Customer@123"],
            ].map(([r, e, p]) => (
              //   <Chip
              //     key={r}
              //     label={`${r}: ${e} / ${p}`}
              //     onClick={() => {
              //       setEmail(e);
              //       setPassword(p);
              //     }}
              //     variant="outlined"
              //   />
              <Chip
                key={r}
                label={`${r}: ${e} / ${p}`}
                onClick={() => {
                  setEmail(e);
                  setPassword(p);
                }}
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
