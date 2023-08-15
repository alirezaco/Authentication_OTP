export enum AuthEndPointsEnum {
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  FORGET_PASSWORD = '/forget',
  UPDATE_PASSWORD = '/updatePass',
  LOGOUT = '/signout',
  VERIFY_AND_LOGIN = '/verify/:code',
  SMS_CODE = '/code'
}