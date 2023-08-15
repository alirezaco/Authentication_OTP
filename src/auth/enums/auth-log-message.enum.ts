export enum AuthLogMessage {
  UNAUTHORIZED = 'The user sent a request without signin',
  FORBIDDEN = 'The user does not have sufficient access to the requested section',
  LOGIN_ADMIN = 'A user logged in as admin with username: ',
}
