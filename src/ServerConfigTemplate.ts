/**
 * Configuration for the Server
 *
 * This file contains important credentials.
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import {BinaryLike} from 'crypto';
import {
  ConfigObj,
  DbObj,
  JwtKeyObj,
  ServerDomainPathObj,
} from './datatypes/ConfigObj';

/**
 * Module contains the configuration
 * Need to implement hash function
 */
export default abstract class ServerConfigTemplate {
  readonly db: DbObj;
  readonly expressPort: number;
  readonly jwt: JwtKeyObj;
  readonly domainPath: ServerDomainPathObj;

  /**
   * Constructor for ServerConfig Object
   *
   * @param config configuration parameters will given by an object
   */
  protected constructor(config: ConfigObj) {
    this.db = config.db;
    this.expressPort = config.expressPort;
    this.jwt = config.jwtKeys;
    this.domainPath = config.serverDomainPath;
  }

  /**
   * Function to create hashed password
   *
   * Detail of this function also should not be disclosed for security purpose.
   * Should not be uploaded to version control system (git).
   *
   * @param id user's id (used to generate salt)
   * @param additionalSalt unique additional salt element for each user
   * @param secretString string to be hashed (password, etc)
   * @returns {string} Hashed Password
   */
  /* istanbul ignore next */
  static hash(
    id: BinaryLike,
    additionalSalt: BinaryLike,
    secretString: BinaryLike
  ): string {
    /* istanbul ignore next */
    return `${id}_${additionalSalt}_${secretString}`;
  }
}
