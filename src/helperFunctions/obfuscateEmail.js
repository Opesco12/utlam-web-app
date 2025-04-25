export const obfuscateEmail = (email) => {
  const [localPart, domain] = email.split("@");

  if (localPart.length < 2) {
    return `${localPart}@${domain}`;
  }

  const obfuscatedLocal = `${localPart[0]}****${
    localPart[localPart.length - 1]
  }`;

  return `${obfuscatedLocal}@${domain}`;
};
