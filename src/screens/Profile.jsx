import {
  ArrowRight2,
  Book,
  ClipboardTick,
  Headphone,
  Lock1,
  UserOctagon,
  Profile as ProfileIcon,
} from "iconsax-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ContentBox from "../components/ContentBox";
import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";

import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";

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
      {showDivider && <hr className="border-gray-400" />}
    </>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(null);

  useEffect(() => {
    const userData = userStorage.getItem(keys.user);
    if (userData) {
      setName(userData?.fullName);
    } else {
      Navigate("/login");
    }
  }, []);

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
      path: "/kyc/1",
    },
    {
      icon: (
        <Lock1
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Change Password",
      path: "/change-password",
    },
    {
      icon: (
        <UserOctagon
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Contact Account Manager",
      path: "/contact-manager",
    },
    {
      icon: (
        <Headphone
          size={25}
          color={Colors.primary}
        />
      ),
      title: "Help & Support",
      path: "/help-support",
    },
  ];

  return (
    <div>
      <HeaderText>My Profile</HeaderText>

      <ContentBox
        width={"100%"}
        backgroundColor={Colors.primary}
      >
        <div className="flex justify-between items-center py-5">
          <div>
            <StyledText
              type="heading"
              variant="medium"
              color={Colors.white}
            >
              Profile
            </StyledText>
            <br />
            <StyledText color={Colors.white}>{name}</StyledText>
          </div>
        </div>
      </ContentBox>

      <div className="mt-8">
        <ContentBox className={"md:w-[50%]"}>
          <div className="flex items-center gap-2 mb-7">
            <StyledText color={Colors.primary}>Account Settings</StyledText>
          </div>
          <hr className="border-gray-400" />

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
    </div>
  );
};

export default Profile;
