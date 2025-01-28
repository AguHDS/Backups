/** Get all entries  of the form and return them as an object */

interface LoginFormData {
  user: string;
  password: string;
}

interface RegistrationFormData extends LoginFormData {
  email: string;
}

type LoginAndSignFormData = LoginFormData | RegistrationFormData;

export const getFormData = (form: HTMLFormElement): LoginAndSignFormData => {
  const formEntries: Record<string, string | boolean> = {};

  const data = new FormData(form);

  data.forEach((value, key) => {
    const element = form.elements.namedItem(key) as HTMLInputElement;
    if (element?.type === "checkbox") {
      formEntries[key] = element.checked;
    } else {
      formEntries[key] = value.toString();
    }
  });

  if (
    typeof formEntries.user === "string" &&
    typeof formEntries.password === "string"
  ) {
    //if it has email, it's registration
    if (typeof formEntries.email === "string") {
      return {
        user: formEntries.user,
        password: formEntries.password,
        email: formEntries.email,
      } as RegistrationFormData;
    }

    //if there's not email, it's login
    return {
      user: formEntries.user,
      password: formEntries.password,
    } as LoginFormData;
  }

  throw new Error("Form does not have a valid format");
};
