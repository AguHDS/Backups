export const validateLoginFields = (
  user: string,
  password: string,
  email?: string
): string[] => {
  const errors = [];

  if (!user || !password) {
    errors.push("All fields are required");
  }

  if (email && email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email");
    }
  }

  return errors;
};
