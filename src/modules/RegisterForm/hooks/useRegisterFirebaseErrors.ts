import {FirebaseError} from "types/FirebaseErrorType.ts";

export const useRegisterFirebaseError = () => {
  return (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email already used. Go to login page.";
      case "auth/internal-error":
        return "Internal error";
      case "auth/weak-password":
        return "Weak password";
      default:
        return "SignUp failed. Please try again.";
    }
  };
};
