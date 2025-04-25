export const copyToClipboard = async (text) => {
  await Clipboard.setStringAsync(text);
  setIsDepositModalOpen(false);
  showMessage({ message: "Copied", type: "success" });
};
