import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, CopySuccess } from "iconsax-react";

import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import { Colors } from "../constants/Colors";

import { getClientInfo } from "../api";

const Referral = () => {
  const [referralCode, setReferralCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClientInfo();
      setReferralCode(data?.referralCode);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }
  return (
    <div className="">
      <HeaderText>Referral</HeaderText>

      <div className="flex-1 space-y-4 rounded-xl bg-white p-4 md:p-8">
        <StyledText
          color={Colors.primary}
          type="title"
          variant="semibold"
        >
          Invite your friends! Share your referral code and earn rewards when
          they sign up.
        </StyledText>
        <br />
        <div className="flex items-center gap-2 mt-2">
          <StyledText
            color={Colors.primary}
            type="title"
            variant="semibold"
          >
            {referralCode}
          </StyledText>

          {copied ? (
            <CopySuccess
              size={25}
              color={Colors.lightPrimary}
            />
          ) : (
            <Copy
              size={25}
              color={Colors.lightPrimary}
              onClick={() => handleCopy(referralCode)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
