import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeScreenSkeleton = () => {
  return (
    <div className="md:px-[20px]">
      {/* Header */}
      <Skeleton
        height={32}
        width={128}
        className="mb-4 rounded-md"
      />

      {/* Greeting */}
      <Skeleton
        height={24}
        width={192}
        className="mb-4 rounded-md"
      />

      {/* Balance Display (Big Box) */}
      <Skeleton
        height={200}
        width="100%"
        className="mb-8 rounded-xl"
      />

      {/* Quick Access (Big Box) */}
      <Skeleton
        height={250}
        width="100%"
        className="mb-4 rounded-xl"
      />
    </div>
  );
};

export default HomeScreenSkeleton;
