export const useLoginFirebaseErrors = () => {
  const firebaseError = (error: { code: string }): string => {
    switch (error.code) {
      case "auth/wrong-password":
        return "Wrong password";
      case "auth/user-disabled":
        return "User disabled";
      case "auth/user-not-found":
        return "User not found";
      case "auth/invalid-email":
        return "Invalid email";
      default:
        return "Sign In failed. Please try again.";
    }
  };
  return [firebaseError];
};
