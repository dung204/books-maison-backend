export enum OAuthAction {
  /**
   * Performs a login for an existing user in the database having the corresponding OAuth email & OAuth ID found.
   */
  AUTHENTICATE = 'authenticate',

  /**
   * Inserts the OAuth ID to the existing user having the corresponding OAuth email.
   * Only use this when that user does not have a OAuth ID.
   * If that user already has a OAuth ID, throws a conflict error.
   * Once linking is finished, performs a login
   */
  LINK = 'link',

  /**
   * Overrides the current existing user in the database with user info (email, OAuth ID, first name, last name, avatar) retrieved from OAuth login.
   * Once overriding is finished, performs a login
   */
  OVERRIDE = 'override',
}
