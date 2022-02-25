const AUTH_ERRORS = {
  invalidCredentials: {
    code: 1,
    status: 401,
    name: "invalidCredentials",
    message: "Invalid username and password combination.",
  },
  unauthorized: {
    code: 2,
    status: 403,
    name: "unauthorized",
    message:
      "Access forbidden. You do not have privileges to access this resource.",
  },
};

const JWT_ERRORS = {
  invalidToken: {
    code: 1,
    status: 401,
    name: "invalidToken",
    message: "Invalid token.",
  },
  expiredToken: {
    code: 2,
    status: 401,
    name: "expiredToken",
    message: "Expired token.",
  },
  noToken: {
    code: 3,
    status: 401,
    name: "noToken",
    message: "No token.",
  },
  signError: {
    code: 4,
    status: 500,
    name: "signError",
    message: "JWT signing error.",
  },
  invalidType: {
    code: 5,
    status: 401,
    name: "invalidType",
    message: "Invalid token type",
  },
};

const SIGNUP_ERRORS = {
  genericError: {
    code: 1,
    status: 500,
    name: "genericError",
    message: "An error occured when registering user.",
  },
  userAlreadyExists: {
    code: 2,
    status: 403,
    name: "userAlreadyExists",
    message: "User already exists.",
  },
};

const SIGNIN_ERRORS = {
  invalidCredentials: {
    code: 1,
    status: 403,
    name: "invalidCredentials",
    message: "Invalid username and password combination.",
  },
  userNotFound: {
    code: 2,
    status: 401,
    name: "userNotFound",
    message: "User does not exist.",
  },
};

module.exports = {
  authErrors: AUTH_ERRORS,
  signupErrors: SIGNUP_ERRORS,
  signinErrors: SIGNIN_ERRORS,
  jwtErrors: JWT_ERRORS,
};
