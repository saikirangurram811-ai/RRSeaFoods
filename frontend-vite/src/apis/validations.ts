export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailError = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!validateEmail(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const getMobileError = (mobile: string): string | null => {
  if (!mobile.trim()) {
    return "Mobile number is required.";
  }
  if (!validateMobile(mobile)) {
    return "Please enter a valid 10-digit mobile number.";
  }
  return null;
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};

export const getPasswordError = (password: string): string | null => {
  if (!password.trim()) {
    return "Password is required.";
  }
  if (!validatePassword(password)) {
    return "Please enter a valid password.";
  }
  return null;
};    

export const validateForm = (
  email: string,
  mobile: string,
  password: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const emailError = getEmailError(email);
  if (emailError) errors.email = emailError;

  const mobileError = getMobileError(mobile);
  if (mobileError) errors.mobile = mobileError;

  const passwordError = getPasswordError(password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};