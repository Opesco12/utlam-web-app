import {
  ArrowRight2,
  Book,
  ClipboardTick,
  Headphone,
  Lock1,
  UserOctagon,
  Profile as ProfileIcon,
  UserCirlceAdd,
  User,
  Profile2User,
  Key,
  Message,
} from "iconsax-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ContentBox from "../components/ContentBox";
import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import AppModal from "../components/AppModal";
import { Colors } from "../constants/Colors";

import { fetchClientPhoto, uploadImage } from "../api";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import { Camera } from "lucide-react";

const ProfileMenuItem = ({ icon, title, onClick, showDivider = true }) => {
  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-row items-center justify-between py-4 bg-white hover:bg-border cursor-pointer"
      >
        <StyledText style={{ display: "flex", gap: "10px" }}>
          {icon}
          {title}
        </StyledText>
        <ArrowRight2
          size={17}
          color={Colors.primary}
          variant="Bold"
        />
      </div>
      {showDivider && <hr className="border-gray-300" />}
    </>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });

  const [clientPhoto, setClientPhoto] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const userData = userStorage.getItem(keys.user);

    if (userData) {
      setUser({ name: userData?.fullName, email: userData?.emailAddress });
    } else {
      Navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const clientPhoto = await fetchClientPhoto();
      setClientPhoto(clientPhoto?.photo);
      // setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      if (!selectedImage) {
        toast.error("Select an image");
      } else {
        const response = await uploadImage(selectedImage);
      }

      setIsUploading(false);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error(error);
    }

    setIsUploading(false);
  };

  const menuItems = [
    {
      icon: (
        <ProfileIcon
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Personal Details",
      path: "/profile/personal-details",
    },
    {
      icon: (
        <Book
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Bank Details",
      path: "/profile/bank-details",
    },
    {
      icon: (
        <ClipboardTick
          size={25}
          color={Colors.primary}
        />
      ),
      title: "KYC",
      path: "/profile/kyc",
    },
    {
      icon: (
        <Profile2User
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Referral",
      path: "/profile/referral",
    },
    {
      icon: (
        <Lock1
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Change Password",
      path: "/profile/change-password",
    },
    {
      icon: (
        <Key
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Pin Management",
      path: "/profile/pin",
    },
    {
      icon: (
        <Message
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Contact Account Manager",
      path: "/profile/contact-manager",
    },

    {
      icon: (
        <Headphone
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Help & Support",
      // path: "/help-support",
    },
  ];

  return (
    <div>
      <HeaderText>My Profile</HeaderText>

      <div className="bg-[url('/images/sidebar-bg.svg')] bg-cover bg-no-repeat bg-center min-h-[150px] rounded-xl p-3 flex items-center justify-center">
        <div className="flex justify-between items-center py-5">
          <div className="text-center flex flex-col items-center justify-center">
            <div className="relative">
              {clientPhoto ? (
                <>
                  <img
                    src={`data:image/jpeg;base64,${clientPhoto}`}
                    alt="user"
                    className="aspect-square w-30 rounded-full object-cover"
                  />
                  <div
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center justify-center h-7 w-7 border-2 border-white bg-primary rounded-full absolute right-0 bottom-0 z-20 hover:bg-light-primary"
                  >
                    <Camera
                      color="white"
                      size={15}
                    />
                  </div>{" "}
                </>
              ) : (
                <div className="flex items-center justify-center relative border border-gray-300 w-30 h-30 rounded-full">
                  <User
                    color={Colors.white}
                    className="w-22 h-22 opacity-70"
                    variant="Bold"
                  />
                  <div
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center justify-center h-7 w-7 border-2 border-white bg-primary rounded-full absolute right-0 bottom-0 z-20 hover:bg-light-primary"
                  >
                    <Camera
                      color="white"
                      size={15}
                    />
                  </div>
                </div>
              )}
            </div>
            <br />
            <StyledText
              type="subheading"
              color={Colors.white}
            >
              {user?.name}
            </StyledText>
            <StyledText
              type="label"
              color={Colors.light}
            >
              {user?.email}
            </StyledText>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ContentBox className={"md:w-[50%]"}>
          <div className="flex items-center gap-2 mb-7">
            <StyledText color={Colors.primary}>Account Settings</StyledText>
          </div>
          <hr className="border-gray-300" />

          {menuItems.map((item, index) => (
            <ProfileMenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              onClick={() => navigate(item.path)}
              showDivider={index !== menuItems.length - 1}
            />
          ))}
        </ContentBox>
      </div>
      <AppModal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        title={"Upload Profile Image"}
      >
        <div className="">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload New Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#000050] hover:file:bg-blue-100"
            />
          </div>

          <div>
            {/* Display selected image */}
            {selectedImage && (
              <div className="h-20 w-20 overflow-hidden rounded-full border">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            )}
            <div className="">
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedImage}
                className={`mt-5 w-full rounded-md px-4 py-2 font-medium text-white ${
                  isUploading || !selectedImage
                    ? "cursor-not-allowed bg-light-primary"
                    : "bg-primary hover:opacity-80"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading
                  </span>
                ) : (
                  "Upload Photo"
                )}
              </button>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default Profile;
