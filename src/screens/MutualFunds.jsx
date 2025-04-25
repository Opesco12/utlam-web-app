import { useEffect, useState } from "react";

import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import Product from "../components/Product";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";

import { getProducts } from "../api";

const MutualFunds = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getNumberOfProducts = () => {
    let numberOfProducts = 0;
    products?.forEach((product) => {
      if (product.portfolioTypeName === "mutualfund") {
        numberOfProducts++;
      }
    });
    return numberOfProducts;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const products = await getProducts();
      products &&
        setProducts(
          products.filter(
            (product) => product.portfolioTypeName === "mutualfund"
          )
        );
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      <HeaderText>Mutual Funds Investment</HeaderText>

      <ContentBox className={"p-[20px] md:mt-[35px]"}>
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
            products?.map((product, index) => (
              <Product
                product={product}
                key={index}
              />
            ))
          )}
        </div>
      </ContentBox>
    </div>
  );
};

export default MutualFunds;
