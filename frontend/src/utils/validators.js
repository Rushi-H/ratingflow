export const validators = {
  name: /^.{20,60}$/,
  address: /^.{0,400}$/,
  password: /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export const validatePassword = (password) => {
  if (!validators.password.test(password)) {
    return "8-16 characters, 1 uppercase, 1 special character";
  }
  return "";
}

export const validateName = (name) => {
  if (!validators.name.test(name)) return "Name must be 20-60 characters";
  return "";
}

export const validateEmail = (email) => {
  if (!validators.email.test(email)) return "Invalid email format";
  return "";
}

export const validateAddress = (address) => {
  if (address && !validators.address.test(address)) return "Address max 400 chars";
  return "";
}
