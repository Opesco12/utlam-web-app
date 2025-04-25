import React, { useEffect, useState } from "react";

import HeaderText from "../components/HeaderText";
import Product from "../components/Product";
import ContentBox from "../components/ContentBox";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import FilterBox from "../components/FilterBox";
import AppRipple from "../components/AppRipple";

import { getProducts } from "../api";
import Toggle from "../components/Toggle";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

const Invest = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);

  const toggleOptions = [
    { label: "All", value: "all" },
    { label: "Mutual Funds", value: "mutualfund" },
    { label: "Liabilities", value: "liability" },
  ];

  const getNumberOfProducts = () => {
    if (filter === "all") {
      if (products?.length === 0) return 0;
      return products?.length;
    } else {
      let numberOfProducts = 0;
      products?.forEach((product) => {
        if (product.portfolioTypeName === filter) {
          numberOfProducts++;
        }
      });
      return numberOfProducts;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const products = await getProducts();
      products && setProducts(products);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      <HeaderText>Investment Products</HeaderText>

      <ContentBox className={"p-[20px] md:mt-[35px]"}>
        <Toggle
          options={toggleOptions}
          onValueChange={(value) => setFilter(value)}
        />
        <div className="flex items-center justify-center my-3">
          <StyledText
            type="label"
            variant="medium"
            color={Colors.primary}
          >
            {getNumberOfProducts()} Investment Products Available
          </StyledText>
        </div>
        <div className={`grid ${!loading && "grid-cols-2"} gap-[15px]`}>
          {loading ? (
            <div className="flex flex-1 items-center justify-center my-[20px]">
              <LargeLoadingSpinner color={Colors.lightPrimary} />
            </div>
          ) : (
            products?.length > 0 &&
            products?.map((product, index) =>
              filter === "all" ? (
                <Product
                  product={product}
                  key={index}
                />
              ) : (
                product?.portfolioTypeName === filter && (
                  <Product
                    product={product}
                    key={index}
                  />
                )
              )
            )
          )}
        </div>
      </ContentBox>
    </div>
  );
};

export default Invest;
