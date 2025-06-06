export const validateLoginFields = ( user: string, password: string, email?: string): string[] => {
  const errors = [];
  const regex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (user === "" || password === "") {
    errors.push("Fields can not be empty");
  }

  if (user && password && (!regex.test(user) || !regex.test(password))) {
    errors.push("You can only use letters and numbers");
  }

  if (user || password) {
    if (user.length < 1 || password.length < 1) {
      errors.push("Fields must be at least 1 character");
    }
  }

  if (email && !emailRegex.test(email)) {
    errors.push("Invalid email");
  }

  return errors;
};

interface ValidationStatus {
  message: string;
  redirect: boolean;
}

/*  backend status errors */

export const validateLoginStatus = (status: number): ValidationStatus => {
  if (status >= 200 && status < 300) {
    return { message: "Operation successful", redirect: true };
  } else if (status === 401) {
    return { message: "Invalid credentials", redirect: false };
  } else if (status === 409) {
    return { message: "User or email already exist", redirect: false };
  } else if (status >= 500) {
    return { message: "Server error. Try again later", redirect: false };
  } else {
    return {
      message: `Something went wrong: Status ${status}`,
      redirect: false,
    };
  }
};