import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useMediaQuery } from "react-responsive";

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
import { useNavigate } from "react-router-dom";

import StyledText from "./StyledText";
import { logout } from "../api";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";

import { useAuth } from "../context/AuthProvider";

const ResponsiveSidebar = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  return (
    <>
      {isSmallScreen && (
        <div
          className="h-20 w-full flex justify-between py-1 px-4"
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
        <Menu>
          <MenuItem
            icon={
              <img
                src={`${LogoWhite}`}
                alt="Logo"
              />
            }
            style={{ marginBottom: "40px", pointerEvents: "none" }}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              UTLAM
            </StyledText>
          </MenuItem>

          <MenuItem
            icon={
              <Home3
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Home
            </StyledText>
          </MenuItem>
          <MenuItem
            icon={
              <ChartSquare
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/invest/mutual_fund" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Mutual Funds
            </StyledText>
          </MenuItem>
          <MenuItem
            icon={
              <MoneyTime
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/invest/fixed_income" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Fixed Income
            </StyledText>
          </MenuItem>
          <MenuItem
            icon={
              <ReceiptText
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/transactions" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Transactions
            </StyledText>
          </MenuItem>
          <MenuItem
            icon={
              <Briefcase
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/portfolio" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Portfolio
            </StyledText>
          </MenuItem>
          <MenuItem
            icon={
              <User
                variant="Bold"
                color={Colors.white}
                size={25}
              />
            }
            component={<a href="/profile" />}
          >
            <StyledText
              variant="medium"
              color={Colors.white}
            >
              Profile
            </StyledText>
          </MenuItem>

          <div className="sidebar-footer">
            <MenuItem
              icon={
                <LogoutCurve
                  color={Colors.white}
                  size={25}
                />
              }
              // component={<a href="/logout" />}
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
