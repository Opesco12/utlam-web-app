import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { ArrowCircleRight2, Moneys, TrendUp } from "iconsax-react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";
import { amountFormatter } from "../helperFunctions/amountFormatter";

const PortfolioItem = ({ product }) => {
  const navigate = useNavigate();
  const [fixedIncomeBalance, setFixedIncomeBalance] = useState(0);

  useEffect(() => {
    if (product?.portfolioType === 9) {
      var balance = 0;
      product.investments?.map(
        (investment) => (balance += investment?.currentValue)
      );

      setFixedIncomeBalance(balance);
    }
  }, []);
  return (
    <div className="border border-gray-300 p-[10px] rounded-lg bg-white hover:bg-gray-100  cursor-pointer">
      <div
        onClick={() => {
          product?.portfolio !== "Wallet" &&
            navigate(`/portfolio/${_.kebabCase(product?.portfolio)}`, {
              state:
                product.portfolioType === 9
                  ? { ...product, balance: fixedIncomeBalance }
                  : product,
            });
        }}
        className="flex justify-between items-center "
      >
        <div className="flex gap-2 items-center">
          <TrendUp
            size={30}
            variant="Bold"
            color={Colors.secondary}
          />
          <div>
            <StyledText
              color={Colors.primary}
              variant="semibold"
              type="body"
            >
              {product?.portfolio}
            </StyledText>{" "}
            <br />
            <div className="flex flex-row gap-1 items-center">
              <Moneys
                variant="Bold"
                color={Colors.primary}
                size={17}
              />
              <StyledText
                color={Colors.light}
                variant="semibold"
              >
                {product?.portfolioType === 9
                  ? amountFormatter.format(fixedIncomeBalance)
                  : amountFormatter.format(product?.balance)}
              </StyledText>
            </div>
            {!product?.portfolioType &&
              product?.portfolio !== "Wallet" &&
              product?.pendingDividendAmount && (
                <p className="text-light text-sm font-semibold">
                  Pending Dividend: {product?.pendingDividendAmount}
                </p>
              )}
          </div>
        </div>
        <ArrowCircleRight2
          size={30}
          color={Colors.primary}
          variant="Bold"
        />
      </div>
      {!product?.portfolioType && product?.portfolio !== "Wallet" && (
        <>
          <p
            className="text-right underline text-sm text-lightPrimary cursor-pointer hover:text-primary"
            onClick={() =>
              navigate(
                `/portfolio/${_.kebabCase(product.portfolio)}/statement`,
                {
                  state: { balance: product?.balance },
                }
              )
            }
          >
            View Statement
          </p>
        </>
      )}
    </div>
  );
};

export default PortfolioItem;
