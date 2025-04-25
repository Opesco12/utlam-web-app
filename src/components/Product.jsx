import React from "react";
import { useNavigate } from "react-router-dom";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";
import AppRipple from "./AppRipple";

import { amountFormatter } from "../helperFunctions/amountFormatter";

const Product = ({ product }) => {
  const navigate = useNavigate();
  function convertToKebabCase(inputString) {
    inputString = inputString.trim();

    inputString = inputString.toLowerCase();

    inputString = inputString.replace(/\s+/g, "-");

    return inputString;
  }
  const products = [
    "UTLAM MONEY MARKET PLAN",
    "UTLAM LIFESTYLE ACCOUNT",
    "UTLAM LIQUIDITY MANAGER",
    "UTLAM TARGET SAVINGS",
    "UTLAM FIXED INCOME STRATEGY",
    "UTLAM BALANCED STRATEGY",
    "UTLAM GROWTH STRATEGY",
    "UTLAM FIXED INCOME PLAN",
    "UTLAM BALANCE PLAN",
    "UTLAM GROWTH PLAN",
  ];
  var imageUrl = products.includes(product.portfolioName)
    ? `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/${convertToKebabCase(
        product.portfolioName
      )}.webp?alt=media&token=9fbb64ae-96b9-49e1-`
    : `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/utlam-default.webp?alt=media&token=9fbb64ae-96b9-49e1-`;
  return (
    <div
      className="w-[100%] my-[5px]"
      onClick={() => navigate(`/invest/${product.portfolioId}`)}
    >
      <AppRipple>
        <div className="flex gap-3 rounded-lg border border-gray-300 overflow-hidden p-[10px] flex-col md:flex-row hover:bg-border cursor-pointer">
          <img
            src={imageUrl}
            className="h-full w-full md:h-[100px] md:w-[100px] rounded-lg"
          />
          <div className="flex flex-col justify-between w-[100%]">
            <StyledText
              variant="semibold"
              color={Colors.primary}
              style={{ textAlign: "center" }}
            >
              {product.portfolioName}
            </StyledText>

            <div
              className="flex justify-between items-center border-t pt-[5px] mt-[5px] md:mt-[0px]"
              style={{ borderColor: Colors.border }}
            >
              <StyledText color={Colors.primary}>
                From{" "}
                <StyledText variant="semibold">
                  {amountFormatter.format(product.minimumInvestment)}
                </StyledText>
              </StyledText>
              <StyledText color={Colors.primary}>
                Min{" "}
                <StyledText variant="semibold">
                  {product.minimumHoldingPeriod} Days
                </StyledText>
              </StyledText>
            </div>
          </div>
        </div>
      </AppRipple>
    </div>
  );
};

export default Product;
