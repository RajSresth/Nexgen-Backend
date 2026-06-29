import validator from "validator"

const validate = (fullname, email, password,role) => {
    const errors = [];
    let hasError = false;
    let validRoles = ["user", "admin", "seller"];

    if(!fullname && !validator.isLength(fullname, {min: 3,max:16}))
    {
        hasError = true
        errors.push({message: "Invalid Fullname"});
    }

    if(!email && !validator.isEmail(email))
    {
        hasError = true;
        errors.push({message: "Invalid Email"});
    }

    if(!password && !validator.isStrongPassword(password, {minLength:8, minNumbers:1, minLowercase:1, minUppercase:1, minSymbols:1}))
    {
         hasError = true;
        errors.push({message: "Invalid Password"});
    }

    if(!validRoles.includes(role))
    {
        hasError = true;
        errors.push({message: "Invalid Role"});
    }

    return {errors,hasError}
}

export default validate;