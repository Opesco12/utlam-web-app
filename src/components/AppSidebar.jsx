import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation } from "react-router-dom";

import Bg from "../svg_assets/sidebar-bg.svg";
import LogoWhite from "../svg_assets/logo_white.svg";

import "../styles/sidebar.css";

import { Colors } from "../constants/Colors";
import {
  Briefcase,
  ChartSquare,
  HambergerMenu,
  Home3,
  LogoutCurve,
  MoneyTime,
  ReceiptText,
  User,
} from "iconsax-react";

import StyledText from "./StyledText";
import { logout } from "../api";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";

import { useAuth } from "../context/AuthProvider";

const ResponsiveSidebar = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const isMediumScreen = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const handleCollapsedChange = () => {
    if (!isSmallScreen) {
      setCollapsed(!collapsed);
    }
  };

  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  const logoutUser = async () => {
    const userData = userStorage.getItem(keys.user);

    await logout(userData?.token);
    userStorage.removeItem(keys.user);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const menuItems = [
    {
      icon: (
        <Home3
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Dashboard",
      path: "/",
    },
    {
      icon: (
        <ChartSquare
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Mutual Funds",
      path: "/invest/mutual_fund",
    },
    {
      icon: (
        <MoneyTime
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Fixed Income",
      path: "/invest/fixed_income",
    },
    {
      icon: (
        <ReceiptText
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Transactions",
      path: "/transactions",
    },
    {
      icon: (
        <Briefcase
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Portfolio",
      path: "/portfolio",
    },
    {
      icon: (
        <User
          variant="Bold"
          color={Colors.white}
          size={25}
        />
      ),
      text: "Profile",
      path: "/profile",
    },
  ];

  const isActive = (path) => {
    if (path === "/" && currentPath === "/") {
      return true;
    }
    return path !== "/" && currentPath.startsWith(path);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (isSmallScreen) {
      handleToggleSidebar();
    }
  };

  return (
    <>
      {isSmallScreen && (
        <div
          className="h-15 w-full flex justify-between py-1 px-4"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="flex items-center gap-2">
            <img
              src={`${LogoWhite}`}
              alt="Logo"
              className="h-7 w-7"
            />

            <StyledText
              color={Colors.white}
              variant="semibold"
              type="heading"
            >
              UTLAM
            </StyledText>
          </div>

          <button
            className="btn-toggle"
            onClick={handleToggleSidebar}
          >
            <HambergerMenu
              size={25}
              color={Colors.white}
            />
          </button>
        </div>
      )}
      <Sidebar
        collapsed={isMediumScreen || collapsed}
        toggled={toggled}
        onBackdropClick={handleToggleSidebar}
        breakPoint="md"
        backgroundColor={"transparent"}
        style={{
          height: "100%",
          paddingTop: "25px",
          backgroundImage: `url(${Bg})`,
        }}
      >
        <Menu className="pt-20">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.path)}
              className={isActive(item.path) ? "active-menu-item" : ""}
              style={
                isActive(item.path)
                  ? {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }
                  : { marginBottom: "8px" }
              }
            >
              <StyledText
                variant="medium"
                color={Colors.white}
              >
                {item.text}
              </StyledText>
            </MenuItem>
          ))}

          <div className="sidebar-footer">
            <MenuItem
              icon={
                <LogoutCurve
                  color={Colors.white}
                  size={25}
                />
              }
              onClick={logoutUser}
            >
              <StyledText
                variant="medium"
                color={Colors.white}
              >
                Logout
              </StyledText>
            </MenuItem>
          </div>
        </Menu>
      </Sidebar>
    </>
  );
};

export default ResponsiveSidebar;
