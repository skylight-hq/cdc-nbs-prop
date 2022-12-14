// This needs to be kept in sync with UserAccountStatus on the backend.

export enum UserAccountStatus {
  ACTIVE = "ACTIVE",
  PENDING_ACTIVATION = "PENDING_ACTIVATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  SET_SECURITY_QUESTIONS = "SET_SECURITY_QUESTIONS",
  MFA_SELECT = "MFA_SELECT",
  SMS_PENDING_ACTIVATION = "SMS_PENDING_ACTIVATION",
  CALL_PENDING_ACTIVATION = "CALL_PENDING_ACTIVATION",
  EMAIL_PENDING_ACTIVATION = "EMAIL_PENDING_ACTIVATION",
  GOOGLE_PENDING_ACTIVATION = "GOOGLE_PENDING_ACTIVATION",
  OKTA_PENDING_ACTIVATION = "OKTA_PENDING_ACTIVATION",
  FIDO_PENDING_ACTIVATION = "FIDO_PENDING_ACTIVATION",
  UNKNOWN = "UNKNOWN",
  LOADING = "LOADING",
}

export const routeFromStatus = (userAccountStatus: UserAccountStatus) => {
  switch (userAccountStatus) {
    case UserAccountStatus.LOADING:
    case UserAccountStatus.PENDING_ACTIVATION:
      return "/uac";
    case UserAccountStatus.PASSWORD_RESET:
      return "/uac/set-password";
    case UserAccountStatus.SET_SECURITY_QUESTIONS:
      return "/uac/set-recovery-question";
    case UserAccountStatus.MFA_SELECT:
      return "/uac/mfa-select";
    case UserAccountStatus.SMS_PENDING_ACTIVATION:
      return "/uac/mfa-sms/verify";
    case UserAccountStatus.CALL_PENDING_ACTIVATION:
      return "/uac/mfa-phone/verify";
    case UserAccountStatus.EMAIL_PENDING_ACTIVATION:
      return "/uac/mfa-email/verify";
    case UserAccountStatus.GOOGLE_PENDING_ACTIVATION:
      return "/uac/mfa-google-auth/verify";
    case UserAccountStatus.OKTA_PENDING_ACTIVATION:
      return "/uac/mfa-okta/verify";
    case UserAccountStatus.FIDO_PENDING_ACTIVATION:
      return "/uac/mfa-security-key";
    case UserAccountStatus.ACTIVE:
      return "/uac/success";
    default:
      return "/uac/not-found";
  }
};
