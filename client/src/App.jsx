import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import { Slide, ToastContainer } from "react-toastify";
import { StyledEngineProvider } from "@mui/material";
import { useEffect } from "react";
import ApplyNurse from "./pages/ApplyNurse";
import Users from "./pages/admin/Users";
import Caregivers from "./pages/admin/Caregivers";
import UserProfile from "./pages/client/Profile";
import CaregiverDetails from "./pages/client/CaregiverDetails";
import Bookings from "./pages/client/Bookings";
import CaregiverBookings from "./pages/caregiver/Bookings";
import axios from "axios";
import SearchPage from "./pages/client/SearchPage";
import Homepage from "./pages/Homepage";
import ScrollTop from "./components/ScrollTop";
import PageNotFound from "./components/PageNotFound";
import AlertComponent from "./components/AlertComponent";
import { closeAlert } from "./redux/features/messageSlice";
import { ThemeProvider } from "@emotion/react";
import Theme from "./components/Theme";
import FavouritedCaregiver from "./pages/client/FavouritedCaregiver";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const { user } = useSelector((state) => state.user);
  const { open, severity, content } = useSelector((state) => state.message);

  useEffect(() => {
    const bookingStatus = async () => {
      try {
        await axios.post(
          "http://localhost:8070/api/v1/caregiver/bookingStatus",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        return;
      }
    };
    bookingStatus();
  }, []);

  return (
    <>
      <ThemeProvider theme={Theme}>
        <StyledEngineProvider injectFirst>
          {open && (
            <AlertComponent
              severity={severity}
              onClose={() => dispatch(closeAlert())}
              content={content}
            />
          )}

          <BrowserRouter>
            <ToastContainer
              position="top-center"
              transition={Slide}
              autoClose={2000}
              // className="w-full"
            />
            {loading ? (
              <Spinner />
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoutes>
                      <Homepage />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoutes>
                      <Login />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/apply-nurse"
                  element={
                    <ProtectedRoutes>
                      {user?.role !== "client" && user?.role !== "admin" ? (
                        <ApplyNurse />
                      ) : (
                        <PageNotFound />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/apply-babysitter"
                  element={
                    <ProtectedRoutes>
                      {user?.role !== "client" && user?.role !== "admin" ? (
                        <ApplyNurse />
                      ) : (
                        <PageNotFound />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoutes>
                      <SearchPage />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoutes>
                      <Users />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/caregivers"
                  element={
                    <ProtectedRoutes>
                      <Caregivers />
                    </ProtectedRoutes>
                  }
                />

                <Route
                  path={`/client/:id`}
                  element={
                    <ProtectedRoutes>
                      <UserProfile />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path={`/client/favourites/:id`}
                  element={
                    <ProtectedRoutes>
                      <FavouritedCaregiver />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path={`/caregiver/:userId`}
                  element={
                    <ProtectedRoutes>
                      <CaregiverDetails />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path={`/client/bookings`}
                  element={
                    <ProtectedRoutes>
                      <Bookings />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path={`/caregiver/bookings`}
                  element={
                    <ProtectedRoutes>
                      <CaregiverBookings />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoutes>
                      <Register />
                    </PublicRoutes>
                  }
                />

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            )}
            <ScrollTop />
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
