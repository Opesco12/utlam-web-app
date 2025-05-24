import React, { useEffect, useState } from "react";
import { Moneys } from "iconsax-react";

import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import ContentBox from "../components/ContentBox";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import PortfolioItem from "../components/PortfolioItem";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import {
  getWalletBalance,
  getFixedIcomeOnlineBalances,
  getProducts,
  getMutualFundOnlineBalances,
} from "../api";

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    walletBalance: 0,
    mutualFundBalances: [],
    fixedIncomePortfolio: [],
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        const [walletBalance, mutualFundBalances, investibleProducts] =
          await Promise.all([
            getWalletBalance(),
            getMutualFundOnlineBalances(),
            getProducts(),
          ]);

        const fixedIncomePortfolio = await Promise.all(
          investibleProducts
            ?.filter((product) => product.portfolioType === 9)
            .map(async (product) => {
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
              return null;
            }) || []
        );

        const validFixedIncomePortfolio = fixedIncomePortfolio.filter(
          (item) => item !== null
        );

        let totalBalance = walletBalance?.[0]?.amount || 0;

        validFixedIncomePortfolio.forEach((portfolio) => {
          portfolio.investments?.forEach((investment) => {
            totalBalance = totalBalance + (investment?.currentValue || 0);
          });
        });

        mutualFundBalances?.forEach((investment) => {
          totalBalance =
            totalBalance +
            investment?.balance +
            (investment?.pendingDividendAmount || 0);
        });

        setPortfolioData({
          walletBalance: walletBalance?.[0]?.amount || 0,
          mutualFundBalances: mutualFundBalances || [],
          fixedIncomePortfolio: validFixedIncomePortfolio,
          totalBalance,
        });
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

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
      <ContentBox className="bg-white">
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
            {amountFormatter.format(portfolioData.totalBalance)}
          </StyledText>
        </div>
      </ContentBox>

      <ContentBox className="mt-[35px] bg-white">
        <div className="grid gap-[15px] md:grid-cols-2 items-start">
          <PortfolioItem
            product={{
              portfolio: "Wallet",
              balance: portfolioData.walletBalance,
            }}
          />
          {portfolioData.mutualFundBalances?.map((portfolio, index) => (
            <PortfolioItem
              key={`mutual-${index}`}
              product={portfolio}
            />
          ))}
          {portfolioData.fixedIncomePortfolio?.map((portfolio, index) => (
            <PortfolioItem
              key={`fixed-${index}`}
              product={portfolio}
            />
          ))}
        </div>
      </ContentBox>
    </div>
  );
};

export default Portfolio;
