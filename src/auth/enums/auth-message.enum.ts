export enum AuthErrorEnum {
  LOGIN_REQUIRED = 'لطفا وارد حساب کاربری خود شوید',
  TOKEN_INVALID = 'لطفا دوباره وارد حساب کاربری خود شوید',
  FORBIDDEN = 'شما اجازه دسترسی به این بخش را ندارید',
  NOT_MATCH = 'نام‌کاربری یا رمز‌عبور معتبر نیست',
  BAN_USER = 'شما بن شدید',
  INVALID_CODE = 'کد وارد شده معتبر نمی‌باشد',
  EXIST_CODE = 'کد قبلا برای شما ارسال شده است',
}

export enum AuthSuccessEnum {
  LOG_OUT = 'با موفقیت خارج شدید',
  SUCCESS_SEND_SMS = 'با موفقیت ارسال شد',
  SUCCESS_LOGIN = 'لاگین با موفقیت انجام شد',
  SUCCESS_SIGNUP = 'حساب با موفقیت برای شما ایجاد شد',
}
