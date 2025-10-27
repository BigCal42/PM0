const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const randomChar = () => alphabet[Math.floor(Math.random() * alphabet.length)];

export const nanoid = (size = 16): string => {
  return Array.from({ length: size }, randomChar).join('');
};
