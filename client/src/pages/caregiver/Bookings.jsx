import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import CaregiverBookingDetails from "./BookingDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import { Typography } from "@mui/material";
import BookingDetailsSkeleton from "../client/BookingDetailsSkeleton";
import NoBookings from "../../components/NoBookings";
// import { openAlert } from "../../redux/features/messageSlice";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8070/api/v1/caregiver/getBookings",
        {
          params: { caregiverId: user?._id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const bookingStatus = useCallback(async () => {
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
      console.log(error);
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_CENTER,
      // });
      // dispatch(
      //   openAlert({
      //     severity: "error",
      //     content: "Something went wrong! Try again.",
      //   })
      // );

      return;
    }
  }, []);

  useEffect(() => {
    bookingStatus();
  }, [bookingStatus]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bookings page</h1>
      <div className="flex items-start flex-row flex-wrap justify-start w-full">
        {loading ? (
          <>
            <BookingDetailsSkeleton />
            <BookingDetailsSkeleton />
            <BookingDetailsSkeleton />
          </>
        ) : bookings?.length > 0 ? (
          bookings.map((booking) => (
            <CaregiverBookingDetails key={booking._id} booking={booking} />
          ))
        ) : (
          <figure className="w-1/3 m-auto">
            <NoBookings />
            <Typography variant="h6" className="my-2 text-[19px] text-center">
              You don&apos;t have any bookings as of now
            </Typography>
          </figure>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
