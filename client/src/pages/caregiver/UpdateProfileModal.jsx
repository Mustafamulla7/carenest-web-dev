import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { PropTypes } from "prop-types";
import { openAlert } from "../../redux/features/messageSlice";

const UpdateProfileModal = ({ isOpen, onClose, caregiver }) => {
  const [CaregiverData, setCaregiverData] = useState(null);
  const [ageRange, setAgeRange] = useState({
    lowerLimit: null,
    upperLimit: null,
  });
  // eslint-disable-next-line no-unused-vars
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(null);
  const [deleteCertificates, setDeleteCertificates] = useState([]);
  const [validationError, setValidationError] = useState({});
  // const [deleteProfilePicture, setDeleteProfilePicture] = useState(null);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // const params = useParams();

  useEffect(() => {
    setCaregiverData(caregiver);
    setAgeRange(() => ({
      lowerLimit: caregiver?.ageRange?.lowerLimit,
      upperLimit: caregiver?.ageRange?.upperLimit,
    }));
  }, [caregiver]);

  // useEffect(() => {
  //   const getNurseInfo = async () => {
  //     try {
  //       const res = await axios.post(
  //         "http://localhost:8070/api/v1/CaregiverData/getCaregiverInfo",
  //         { userId: params.id },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       if (res.data.success) {
  //         setCaregiverData(res.data.data);
  //         setAgeRange(() => ({
  //           lowerLimit: CaregiverData?.ageRange?.lowerLimit,
  //           upperLimit: CaregiverData?.ageRange?.upperLimit,
  //         }));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getNurseInfo();
  // }, [params.id, CaregiverData]);

  const validateInput = (name, value) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const errors = {};

    if (value.length === 0) {
      errors[name] = "This field is required";
    } else if (name === "name" && !nameRegex.test(value)) {
      errors[name] = "Enter a valid input";
    } else {
      errors[name] = "";
    }

    return errors;
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const validationErrors = validateInput(name, value);

  //   if (validationErrors)
  //     setValidationError((prevError) => ({
  //       ...prevError,
  //       ...validationErrors,
  //     }));

  //   // Special handling for preferredCities to convert the string to an array
  //   if (name === "preferredCities") {
  //     // Split the string based on commas and trim each city
  //     const citiesArray = value.split(",").map((city) => city.trim());

  //     setCaregiverData((prevData) => ({
  //       ...prevData,
  //       preferredCities: citiesArray,
  //     }));
  //   } else if (name === "qualification") {
  //     const qualArray = value.split(",").map((qual) => qual.trim());
  //     setCaregiverData((prevData) => ({
  //       ...prevData,
  //       [name]: qualArray,
  //     }));
  //   } else if (name === "specialisation") {
  //     const specArray = value.split(",").map((spec) => spec.trim());
  //     setCaregiverData((prevData) => ({
  //       ...prevData,
  //       [name]: specArray,
  //     }));
  //   } else {
  //     // For other fields, directly update the state
  //     setCaregiverData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationErrors = validateInput(name, value);
    const regex = /^[a-zA-Z, ]+$/;

    if (validationErrors)
      setValidationError((prevError) => ({
        ...prevError,
        ...validationErrors,
      }));

    // Special handling for preferredCities to convert the string to an array
    if (name === "preferredCities") {
      // Split the string based on commas and trim each city
      if (!regex.test(value)) {
        return;
      }
      const citiesArray = value.split(",").map((city) => city.trim());

      if (hasDuplicates(citiesArray)) {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "Duplicate values are not allowed",
        }));
      } else {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "", // Clear any previous error for this field
        }));

        setCaregiverData((prevData) => ({
          ...prevData,
          preferredCities: citiesArray,
        }));
      }
    } else if (name === "qualification" || name === "specialisation") {
      if (!regex.test(value)) {
        return;
      }
      const dataArray = value.split(",").map((item) => item.trim());

      if (hasDuplicates(dataArray)) {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "Duplicate values are not allowed",
        }));
      } else {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "", // Clear any previous error for this field
        }));

        setCaregiverData((prevData) => ({
          ...prevData,
          [name]: dataArray,
        }));
      }
    } else if (name === "yearsExperience") {
      if (isNaN(value) || value > 90 || value < 0) {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "Enter a valid experience",
        }));
      } else {
        setCaregiverData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "address") {
      setCaregiverData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      const regex = /^[a-zA-Z0-9\s,.'-]+$/;
      if (!regex.test(value)) {
        setValidationError((prevError) => ({
          ...prevError,
          [name]: "Enter a valid address",
        }));
      } else
        setCaregiverData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    } else {
      // For other fields, directly update the state
      setCaregiverData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Function to check for duplicates in an array
  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can perform additional checks or image processing here if needed
      setProfilePictureDisplay(URL.createObjectURL(file));

      // Update state with the selected file
      setCaregiverData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
    }
  };

  const handleCertificateImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    setCaregiverData((prevData) => ({
      ...prevData,
      certifications: [...prevData.certifications, ...fileList],
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const removeCertificate = (certificate) => {
    setCaregiverData((prevData) => ({
      ...prevData,
      certifications: prevData.certifications.filter(
        (cert) => cert !== certificate
      ),
    }));
    setDeleteCertificates((prevData) => [...prevData, certificate]);
  };

  const handleLowerlimitChange = (e) => {
    const validationErrors = validateInput(e.target.name, e.target.value);

    if (validationErrors)
      setValidationError((prevError) => ({
        ...prevError,
        ...validationErrors,
      }));

    setAgeRange((prevAgeRange) => ({
      ...prevAgeRange,
      lowerLimit: e.target.value,
    }));
    if (
      isNaN(e.target.value) ||
      (user?.role === "babysitter" &&
        (e.target.value < 0 || e.target.value > 10)) ||
      (user?.role === "nurse" && (e.target.value < 60 || e.target.value > 100))
    ) {
      setValidationError((prevError) => ({
        ...prevError,
        ["lowerLimit"]: "Enter a valid lower limit",
      }));
    } else if (ageRange.lowerLimit > ageRange.upperLimit) {
      setValidationError((prevError) => ({
        ...prevError,
        ["lowerLimit"]: "Lower limit cannot be greater than upper limit",
      }));
    } else {
      setValidationError((prevError) => ({
        ...prevError,
        ["lowerLimit"]: "",
      }));
    }
  };
  const handleUpperLimitChange = (e) => {
    const validationErrors = validateInput(e.target.name, e.target.value);

    if (validationErrors)
      setValidationError((prevError) => ({
        ...prevError,
        ...validationErrors,
      }));

    setAgeRange((prevAgeRange) => ({
      ...prevAgeRange,
      upperLimit: e.target.value,
    }));
    if (
      isNaN(e.target.value) ||
      (user?.role === "babysitter" &&
        (e.target.value > 10 || e.target.value < 0)) ||
      (user?.role === "nurse" && (e.target.value > 100 || e.target.value < 60))
    ) {
      setValidationError((prevError) => ({
        ...prevError,
        ["upperLimit"]: "Enter a valid upper limit",
      }));
    } else if (e.target.value < ageRange.lowerLimit) {
      setValidationError((prevError) => ({
        ...prevError,
        ["upperLimit"]: "Upper limit cannot be lesser than lower limit",
      }));
    } else {
      setValidationError((prevError) => ({
        ...prevError,
        ["upperLimit"]: "",
      }));
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (Object.values(validationError).some((error) => error !== "")) {
      dispatch(
        openAlert({
          severity: "warning",
          content: "Please ensure the form is filled correctly",
        })
      );
      return;
    }
    const preferredCityArray = CaregiverData?.preferredCities.filter(
      (city) => city !== ""
    );
    const qualificationArray = CaregiverData?.qualification.filter(
      (qual) => qual !== ""
    );
    const specialisationArray = CaregiverData?.specialisation.filter(
      (spec) => spec !== ""
    );

    const formdata = new FormData();
    formdata.append("userId", user._id);
    formdata.append("name", CaregiverData.name);
    formdata.append("address", CaregiverData.address);
    formdata.append("yearsExperience", CaregiverData.yearsExperience);
    formdata.append("feesPerDay", CaregiverData.feesPerDay);
    formdata.append("description", CaregiverData.description);
    formdata.append("availability", CaregiverData.availability);
    formdata.append("ageRange", JSON.stringify(ageRange));
    preferredCityArray.forEach((city) => {
      formdata.append(`preferredCities[]`, city);
    });
    qualificationArray.forEach((qual) => {
      formdata.append("qualification[]", qual);
    });
    specialisationArray.forEach((spec) => {
      formdata.append("specialisation[]", spec);
    });
    deleteCertificates.forEach((cert) => {
      formdata.append("deleteCertificates[]", cert);
    });

    if (CaregiverData.profilePicture instanceof File) {
      formdata.append("profilePicture", CaregiverData.profilePicture);
    }
    // if (CaregiverData.certifications instanceof File) {
    //   CaregiverData?.certifications?.forEach((certification, index) => {
    //     formdata.append(`certifications[]`, certification);
    //   });
    //   console.log(CaregiverData.certifications);
    // }

    if (Array.isArray(CaregiverData.certifications)) {
      // Iterate and append files to FormData
      CaregiverData.certifications.forEach((certification) => {
        formdata.append(`certifications[]`, certification);
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      dispatch(showLoading());
      const res = await axios.patch(
        "http://localhost:8070/api/v1/caregiver/updateCaregiver",
        formdata,
        config
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
        onClose();
      } else {
        dispatch(
          openAlert({
            severity: "error",
            content: "Something went wrong",
          })
        );
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      // toast.error("Something went wrong");
      dispatch(
        openAlert({
          severity: "error",
          content: "Something went wrong",
        })
      );
    }
  };

  return (
    <>
      <div className="">
        <Modal
          open={isOpen}
          onClose={onClose}
          className="flex items-center justify-center pt-44  overflow-y-scroll"
        >
          <div className="">
            <form
              action=""
              method="patch"
              encType="multipart/form-data"
              className="max-w-4xl"
              onSubmit={handleSumbit}
            >
              <Box className="mt-14">
                <Paper elevation={3} className="p-6">
                  <div className="bg-white p-4">
                    {/* Profile Picture and Avatar */}
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded shadow-md w-full">
                        <div className="mt-1 bg-[#f3f4f6] flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:border-indigo-300"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <AiOutlineCloudUpload /> Upload a profile
                                picture
                              </span>
                              <input
                                id="file-upload"
                                name="profilePicture"
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="text-xs  text-gray-600">
                              PNG, JPG, JPEG up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                      <Box>
                        <Avatar
                          alt="Profile Picture"
                          name="profilePicture"
                          src={`http://localhost:8070/${CaregiverData?.profilePicture}`}
                          sx={{ width: 100, height: 100 }}
                        />
                      </Box>
                    </div>

                    <div className=" flex items-start justify-start gap-3 my-3">
                      {/* Name */}
                      <TextField
                        label="Name"
                        name="name"
                        value={CaregiverData?.name}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                        required
                        variant="filled"
                        helperText={validationError.name}
                        error={validationError.name && true}
                      />

                      {/* Address */}
                      <TextField
                        label="Address"
                        name="address"
                        value={CaregiverData?.address}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                        required
                        variant="filled"
                        helperText={validationError.address}
                        error={validationError.address && true}
                      />
                      <TextField
                        label="Years of experience"
                        name="yearsExperience"
                        value={CaregiverData?.yearsExperience}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                        required
                        variant="filled"
                        helperText={validationError.yearsExperience}
                        error={validationError.yearsExperience && true}
                      />
                    </div>

                    <div className=" flex items-start justify-start gap-3 my-3">
                      {/* Age Range */}
                      <TextField
                        label="Age Range Lower Limit"
                        // id="lowerLimit"
                        value={ageRange?.lowerLimit}
                        name="ageRange"
                        onChange={handleLowerlimitChange}
                        fullWidth
                        className="mb-2"
                        required
                        variant="filled"
                        helperText={validationError.lowerLimit}
                        error={validationError.lowerLimit && true}
                      />
                      <TextField
                        label="Age Range Upper Limit"
                        // id="upperLimit"
                        value={ageRange?.upperLimit}
                        name="ageRange"
                        onChange={handleUpperLimitChange}
                        fullWidth
                        className="mb-2"
                        required
                        variant="filled"
                        helperText={validationError.upperLimit}
                        error={validationError.upperLimit && true}
                      />
                      <FormControl
                        fullWidth
                        required
                        variant="filled"
                        className="mb-3"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Availability
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Availability"
                          name="availability"
                          className="w-full rounded-md bg-[#f3f4f6] border transition-[outline] duration-200 outline-blue-600"
                          value={CaregiverData?.availability}
                          onChange={handleInputChange}
                          variant="filled"
                        >
                          {/* <MenuItem value=""  className="">
                    {" "}
                    Select role
                  </MenuItem> */}
                          <MenuItem value="Available" className="px-3 py-2">
                            Available
                          </MenuItem>
                          <MenuItem value="Unavailable" className="px-3 py-2">
                            Unavailable
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      variant="filled"
                      multiline
                      value={CaregiverData?.description}
                      rows={6}
                      required
                      className="mb-2"
                      helperText={validationError.description}
                      error={validationError.description && true}
                    />

                    {/* Certifications */}
                    <div className="flex items-start justify-center flex-col space-y-2 ">
                      <div className="bg-white p-3 rounded shadow-md  w-full">
                        <div className="mt-1 bg-[#f3f4f6] flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center ">
                            <label
                              htmlFor="certifications"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:border-indigo-300"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <AiOutlineCloudUpload />
                                Upload a file (certificates if any)
                              </span>
                              <input
                                id="certifications"
                                name="certifications"
                                multiple
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                className="sr-only"
                                onChange={handleCertificateImageChange}
                              />
                            </label>
                            <p className="text-xs  text-gray-600">
                              PNG, JPG, JPEG up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-start gap-2 w-full flex-wrap">
                        {CaregiverData?.certifications &&
                          CaregiverData?.certifications?.map((img, index) => {
                            return (
                              <>
                                <div key={index}>
                                  <Chip
                                    label={img.name ? img.name : img}
                                    onDelete={() => removeCertificate(img)}
                                  />
                                  <a
                                    href={`http://localhost:8070/${
                                      img.name ? img.name : img
                                    }`}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    Veiw
                                  </a>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                    {/* <TextField
                  label="Certifications"
                  name="certifications"
                  value={CaregiverData.certifications.join(", ")}
                  onChange={handleInputChange}
                  fullWidth
                  className="mb-2"
                /> */}

                    {/* <div className=" flex items-start justify-start gap-3"> */}
                    {/* City */}

                    {/* Preferred Cities */}
                    <div className="mb-2  flex items-start justify-start gap-3 my-3">
                      <TextField
                        label="City"
                        name="city"
                        value={CaregiverData?.city}
                        onChange={handleInputChange}
                        fullWidth
                        className="mb-2"
                        variant="filled"
                        required
                        helperText={validationError.city}
                        error={validationError.city && true}
                      />
                      <TextField
                        label="Preferred cities"
                        name="preferredCities"
                        value={CaregiverData?.preferredCities?.join(", ")}
                        onChange={handleInputChange}
                        helperText={validationError.preferredCities}
                        error={validationError.preferredCities && true}
                        fullWidth
                        required
                        className="mb-2"
                        variant="filled"
                      />
                      <TextField
                        label="Qualification"
                        name="qualification"
                        value={CaregiverData?.qualification?.join(", ")}
                        onChange={handleInputChange}
                        helperText={validationError.qualification}
                        error={validationError.qualification && true}
                        fullWidth
                        required
                        className="mb-2"
                        variant="filled"
                      />
                      {/* <div>
                    {CaregiverData.preferredCities.map((city, index) => (
                      <Chip key={index} label={city} className="mr-1 mb-1" />
                    ))}
                  </div> */}
                    </div>
                    {/* </div> */}
                    <TextField
                      label="Specialisation"
                      name="specialisation"
                      value={CaregiverData?.specialisation?.join(", ")}
                      onChange={handleInputChange}
                      helperText={validationError.specialisation}
                      error={validationError.specialisation && true}
                      fullWidth
                      required
                      className="mb-2"
                      variant="filled"
                    />

                    <Button
                      variant="contained"
                      type="submit"
                      className="py-2 px-4 w-full bg-[#1976d2] hover:bg-[#1565c0]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Paper>
              </Box>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

UpdateProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caregiver: PropTypes.object,
};

export default UpdateProfileModal;
