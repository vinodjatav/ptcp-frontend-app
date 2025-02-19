import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import {
    AppBar,
    Tabs,
    Tab,
    CssBaseline,
    Container,
    Toolbar,
    Typography,
} from "@mui/material";
import Dashboard from "./components/Dashboard";
import Chat from "./components/RealTimeMessaging/Chat";
import EventScheduler from "./components/EventScheduling/EventScheduler";
import { AuthProvider, useAuth } from "./store/AuthContext";
import Login from "./components/Login/Login";
import ProtectedRoute from "./store/ProtectedRoute";

const Navigation: React.FC = () => {
  const location = useLocation();
  const { role, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Parent-Teacher Collaboration Platform
        </Typography>
        {role ? (
          <>
            <Tabs
              value={
                ["/", "/chat", "/events"].includes(location.pathname)
                  ? location.pathname
                  : false
              }
              textColor="inherit"
            >
              <Tab label="Dashboard" component={Link} to="/" value="/" />
              <Tab label="Chat" component={Link} to="/chat" value="/chat" />
              <Tab
                label="Events"
                component={Link}
                to="/events"
                value="/events"
              />
            </Tabs>
            <Tab label="Logout" onClick={logout} />
          </>
        ) : (
          <Tab label="Login" component={Link} to="/login" value="/login" />
        )}
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Navigation />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/events" element={<EventScheduler />} />
            </Route>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
