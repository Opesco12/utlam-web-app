import React from "react";
import { useNavigate } from "react-router-dom";
import { Moneys } from "iconsax-react";

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
    <div className="flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg ">
      <a href={`/invest/${product?.portfolioId}`}>
        <img src={imageUrl} />

        <div className="flex-1 bg-[#ECF9FF] p-2 md:p-5">
          <StyledText
            color={Colors.primary}
            variant="semibold"
          >
            {product?.portfolioName}
          </StyledText>

          <div className="mt-5 flex items-center gap-1 border-t border-[#73CAEE] pt-2">
            <Moneys
              size={18}
              color={Colors.lightPrimary}
              variant="Bold"
            />

            <StyledText type="label">
              From {amountFormatter.format(product?.minimumInvestment)}
            </StyledText>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Product;
