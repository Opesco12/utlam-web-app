import { useState } from "react";
import { toast } from "sonner";
import { Mail, PhoneCall } from "lucide-react";
import { Copy, CopySuccess } from "iconsax-react";

import HeaderText from "../components/HeaderText";
import { Colors } from "../constants/Colors";
import StyledText from "../components/StyledText";

const ContactRelationShipManager = () => {
  const [isMailCopied, setIsMailCopied] = useState(false);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);

  const handleMailCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsMailCopied(true);
      toast.success("Copied");
      setTimeout(() => setIsMailCopied(false), 5000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePhoneCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsPhoneCopied(true);
      toast.success("Copied");
      setTimeout(() => setIsPhoneCopied(false), 5000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="h-full w-full">
      <HeaderText>Contact Account Manager</HeaderText>

      <div className="flex-1 space-y-4 rounded-xl bg-white p-4 md:p-8">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2">
          <Mail
            size={20}
            color={Colors.primary}
          />
          <StyledText color={Colors.primary}>
            Email Address: support@utlam.com
          </StyledText>

          {isMailCopied ? (
            <CopySuccess
              size={20}
              color={Colors.primary}
            />
          ) : (
            <Copy
              size={20}
              color={Colors.primary}
              onClick={() => handleMailCopy("support@utlam.com")}
            />
          )}
        </div>

        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2">
          <PhoneCall
            size={20}
            color={Colors.primary}
          />
          <StyledText color={Colors.primary}>
            Telephone Number: (+234) 903 - 0289 - 111
          </StyledText>
          {isPhoneCopied ? (
            <CopySuccess
              size={20}
              color={Colors.primary}
            />
          ) : (
            <Copy
              size={20}
              color={Colors.primary}
              onClick={() => handlePhoneCopy("09030289111")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRelationShipManager;
