import React, { useEffect, useState } from "react";
import ContentBox from "../components/ContentBox";
import { Moneys } from "iconsax-react";
import * as _ from "lodash";

import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import {
  getWalletBalance,
  getFixedIcomeOnlineBalances,
  getProducts,
  getMutualFundOnlineBalances,
} from "../api";

import PortfolioItem from "../components/PortfolioItem";

const Portfolio = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const updateFixedIncomePortfolio = async (investibleProducts) => {
    const updatedPortfolio = await Promise.all(
      investibleProducts?.map(async (product) => {
        if (product.portfolioType === 9) {
          const fixedIncomeBalances = await getFixedIcomeOnlineBalances(
            product?.portfolioId
          );
          if (fixedIncomeBalances?.length > 0) {
            return {
              portfolio: product.portfolioName,
              investments: fixedIncomeBalances,
              portfolioType: product.portfolioType,
              portfolioId: product.portfolioId,
            };
          }
        }
        return null;
      })
    );

    setFixedIncomePortfolio((prev) => {
      const newItems = updatedPortfolio.filter(
        (item) =>
          item !== null &&
          !prev.some((prevItem) => prevItem.portfolio === item.portfolio)
      );
      return [...prev, ...newItems];
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const balance = await getWalletBalance();
      balance && setUserBalance(balance[0]?.amount);

      const mutualFundBalances = await getMutualFundOnlineBalances();
      mutualFundBalances && setMutualFundBalances(mutualFundBalances);

      const investibleProducts = await getProducts();
      investibleProducts && updateFixedIncomePortfolio(investibleProducts);

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    var totalBalance = userBalance;
    fixedIncomePortfolio.forEach((portfolio) => {
      var balance = 0;
      portfolio.investments?.forEach(
        (investment) => (balance += investment?.currentValue)
      );

      totalBalance += balance;
    });

    mutualFundBalances?.forEach(
      (investment) => (totalBalance += investment?.balance)
    );

    setTotalBalance(totalBalance);
  }, [fixedIncomePortfolio, mutualFundBalances, userBalance]);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div>
      <HeaderText>My Portfolio</HeaderText>
      <ContentBox className={"bg-white"}>
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center gap-[10px]">
            <Moneys
              variant="Bold"
              size={25}
              color={Colors.primary}
            />
            <StyledText
              color={Colors.primary}
              variant="medium"
              type="subheading"
            >
              Total Portfolio Balance
            </StyledText>
          </div>
          <StyledText
            color={Colors.primary}
            type="heading"
            variant="semibold"
          >
            {amountFormatter.format(totalBalance)}
          </StyledText>
        </div>
      </ContentBox>

      <ContentBox className={"mt-[35px] bg-white"}>
        <div className="grid gap-[15px] md:grid-cols-2">
          <PortfolioItem
            product={{
              portfolio: "Wallet",
              balance: userBalance && userBalance,
            }}
          />
          {mutualFundBalances?.length > 0 &&
            mutualFundBalances?.map((portfolio, index) => (
              <PortfolioItem
                key={index}
                product={portfolio}
              />
            ))}
          {fixedIncomePortfolio?.map((portfolio, index) => (
            <PortfolioItem
              key={index}
              product={portfolio}
            />
          ))}
        </div>
      </ContentBox>
    </div>
  );
};

export default Portfolio;
