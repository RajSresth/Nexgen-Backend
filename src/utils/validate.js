import validator from "validator";

const validate = (fullname, email, password, role) => {
  const errors = [];
  let hasError = false;
  const validRoles = ["user", "admin", "seller"];

  if (!fullname || !validator.isLength(fullname, { min: 3, max: 16 })) {
    hasError = true;
    errors.push({ field: "fullname", message: "Fullname must be between 3 and 16 characters" });
  }

  if (!email || !validator.isEmail(email)) {
    hasError = true;
    errors.push({ field: "email", message: "Invalid email address" });
  }

  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
  ) {
    hasError = true;
    errors.push({ field: "password", message: "Password must be at least 8 characters with uppercase, lowercase, number, and symbol" });
  }

  if (!role || !validRoles.includes(role)) {
    hasError = true;
    errors.push({ field: "role", message: "Invalid role" });
  }

  return { errors, hasError };
};

export default validate;