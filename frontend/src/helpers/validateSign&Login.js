export const validateLoginFields = (user, password, email = undefined) => {
  const errors = [];
  const regex = /^[a-zA-Z0-9]+$/;

  if (user === "" || password === "") {
    errors.push("Fields can not be empty");
  }

  if (user && password && (!regex.test(user) || !regex.test(password))) {
    errors.push("You can only use letters and numbers");
  }

  if (user || password) {
    if (user.length < 3 || password.length < 3) {
      errors.push("Fields must be at least 3 characters long");
    }
  }

  if (email && !/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors.push("Invalid email");
  }

  return errors;
};

export const validateLoginStatus = (status) => {
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

//if the form goes larger, consider to use Yup library to make this
