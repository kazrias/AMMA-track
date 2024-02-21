const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "Success" : "Invalid email.";
}

const validateUserName = (userName) => {
    const alphabetRegex  = /^[a-zA-Z]+$/;
    const validUserNameregex = /^[a-zA-Z_-]+$/;
    if (userName.length < 2) {
        return "User namet must be at least 2 characters";
    }

    if (!alphabetRegex.test(userName[0])) {
        return "User name must start with letter.";
    }

    if (!validUserNameregex.test(userName)) {
        return "User Name can contain only albhabet letters, underscores (_), and hyphens (-)";
    }

    return "Success";
}

const validatePassword = (password) => {
    const passwordErrorLists  = {};
    
    if (password.length < 8) {
        passwordErrorLists["lengthError"]= "Password must be at least 8 characters" ;
    }

    if (!(/[A-Z]/.test(password))) {
        passwordErrorLists["upperCaseError"] = "Password must contain uppercase letter";
    }

    if (!(/[a-z]/.test(password))) {
        passwordErrorLists["lowerCaseError"] = "Password must contain lowercase letter";
    }

    if (!(/[0-9]/.test(password))) {
        passwordErrorLists["numberError"] = "Password must contain number";
    }

    if (!(/[@#$%^&*]/.test(password))) {
        passwordErrorLists["specificError"] = "Password must contain specific symbol (e.g., @, #, $, etc.)";
    }

    return passwordErrorLists;
}

export { validateEmail, validateUserName, validatePassword };