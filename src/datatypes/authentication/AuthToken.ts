/**
 * Define type for the objects related with the Authentication Tokens
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

/**
 * Interface to define the contents of Access/Refresh Token
 */
export default interface AuthToken {
  id: string; // contains username of the owner of the token
  type: 'access' | 'refresh'; // type of the token
}
