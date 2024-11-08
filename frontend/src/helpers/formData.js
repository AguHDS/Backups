/** Get all entries  of the form and return them as an object */
export default function getFormData(form) {
  const formEntries = {};

  const data = new FormData(form);

  data.forEach((value, key) => {
    if (form.elements[key]?.type === "checkbox") {
      formEntries[key] = form.elements[key].checked;
    } else {
      formEntries[key] = value;
    }
  });

  return formEntries;
}
