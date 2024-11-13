export default function handlerInputChange(e) {
  const { value, name, type, checked } = e.target;
  if (type === "checkbox") {
    return {
      [name]: checked
    };
  }

  return {
    [name]: value
  };
};