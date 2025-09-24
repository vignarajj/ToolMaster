export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = '';
  if (options.includeUppercase) charset += uppercase;
  if (options.includeLowercase) charset += lowercase;
  if (options.includeNumbers) charset += numbers;
  if (options.includeSymbols) charset += symbols;

  if (!charset) return '';

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}

export function encodeBase64(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    throw new Error('Failed to encode text');
  }
}

export function decodeBase64(encodedText: string): string {
  try {
    return decodeURIComponent(escape(atob(encodedText)));
  } catch (error) {
    throw new Error('Invalid Base64 input');
  }
}
