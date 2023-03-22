export const validateName = (name: string) => {
  if (!name || name.length < 3) {
    return "name needs to be at least 3 characters";
  } else if (name.length > 8) {
    return "name can not exceed 8 characters";
  } else {
    return "valid";
  }
};
