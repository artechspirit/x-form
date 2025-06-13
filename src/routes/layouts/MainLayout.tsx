import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  Divider,
  Button,
} from "@mui/material";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout as logoutActions } from "../../features/auth/auth.slice";
import { clearAuthFromStorage } from "../../utils/tokenStorage";
import { useLogoutMutation } from "../../features/auth/auth.api";

import logo from "../../assets/logo.png";

const drawerWidth = 240;

const menuItems = [{ text: "My Forms", path: "/" }];
export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(logoutActions());
    clearAuthFromStorage();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            X-Form Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <img
            onClick={() => navigate("/")}
            draggable={false}
            src={logo}
            alt="X-Form Logo"
            style={{
              width: "100px",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              cursor: "pointer",
            }}
          />
        </Toolbar>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map(({ text, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box p={2}>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "calc(100vh - 64px)",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
