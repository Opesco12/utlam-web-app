import { Copy, CopySuccess } from "iconsax-react";

import { Colors } from "../constants/Colors";

const VirtualAccountItem = ({ account, copied, onCopy }) => (
  <div className="flex items-center justify-between rounded-lg p-2 hover:bg-border">
    <div>
      <h3 className="font-semibold">
        {`${account?.virtualAccountBankName} (${account?.virtualAccountCurrency})`}
      </h3>
      <p>{account?.virtualAccountNo}</p>
      <h4 className="font-medium">{account?.virtualAccountName}</h4>
    </div>
    {copied ? (
      <CopySuccess
        size={25}
        color={Colors.primary}
      />
    ) : (
      <Copy
        size={25}
        color={Colors.primary}
        onClick={() => onCopy(account?.virtualAccountNo)}
      />
    )}
  </div>
);

export default VirtualAccountItem;
