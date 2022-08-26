enum AccountType {
  Mobile = 'mobile',
  Email = 'email',
  Google = 'google'
}
enum API {
  SIGNUP = '/appuser/v1/signup',
  LOGIN = '/appuser/v1/login',
  LOGIN_VERIFY = '/appuser/v1/loginverify',
  LOGOUT = '/appuser/v1/logout',
  UPDATE_USER = '/appuser/v1/update/user',
}
export { API, AccountType }
