/**
 * Setup test environment
 *  - Setup Database for testing
 *  - Build table that will be used during the testing
 *  - Setup express server
 *
 * Teardown test environment after test
 *  - Remove used table and close database connection from the express server
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import * as crypto from 'crypto';
import * as Cosmos from '@azure/cosmos';
import TestConfig from './TestConfig';
import ExpressServer from '../src/ExpressServer';
import Admin from '../src/datatypes/authentication/Admin';
import Event from '../src/datatypes/event/Event';
import Participation from '../src/datatypes/participate/Participation';

/**
 * Class for Test Environment
 */
export default class TestEnv {
  testConfig: TestConfig; // Configuration Object (to use hash function later)
  expressServer: ExpressServer | undefined; // Express Server Object
  dbClient: Cosmos.Database | undefined; // DB Client Object
  dbIdentifier: string; // unique identifier string for the database

  /**
   * Constructor for TestEnv
   *  - Setup express server
   *  - Setup db client
   *
   * @param identifier Identifier to specify the test
   */
  constructor(identifier: string) {
    // Hash identifier to create new identifier string
    this.dbIdentifier = crypto
      .createHash('md5')
      .update(identifier)
      .digest('hex');

    // Generate TestConfig obj
    this.testConfig = new TestConfig(
      this.dbIdentifier,
      process.env.DB_ENDPOINT,
      process.env.DB_KEY
    );
  }

  /**
   * beforeEach test case, run this function
   * - Setup Database for testing
   * - Build table that will be used during the testing
   */
  async start(): Promise<void> {
    // Setup DB
    const dbClient = new Cosmos.CosmosClient({
      endpoint: this.testConfig.db.endpoint,
      key: this.testConfig.db.key,
    });
    const dbOps = await dbClient.databases.create({
      id: this.testConfig.db.databaseId,
    });
    /* istanbul ignore next */
    if (dbOps.statusCode !== 201) {
      throw new Error(JSON.stringify(dbOps));
    }
    this.dbClient = dbClient.database(this.testConfig.db.databaseId);

    // Create resources
    // admin container
    let containerOps = await this.dbClient.containers.create({
      id: 'admin',
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [{path: '/session/token/?'}],
        excludedPaths: [{path: '/*'}, {path: '/"_etag"/?'}],
      },
    });
    /* istanbul ignore next */
    if (containerOps.statusCode !== 201) {
      throw new Error(JSON.stringify(containerOps));
    }

    // event table
    containerOps = await this.dbClient.containers.create({
      id: 'event',
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [{path: '/date/?'}],
        excludedPaths: [{path: '/*'}, {path: '/"_etag"/?'}],
      },
    });
    /* istanbul ignore next */
    if (containerOps.statusCode !== 201) {
      throw new Error(JSON.stringify(containerOps));
    }

    // participation table
    containerOps = await this.dbClient.containers.create({
      id: 'participation',
      partitionKey: {paths: ['/eventId']},
      uniqueKeyPolicy: {
        uniqueKeys: [{paths: ['/eventId', '/participantName', '/email']}],
      },
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [
          {path: '/eventId/?'},
          {path: '/participantName/?'},
          {path: '/email/?'},
        ],
        excludedPaths: [{path: '/*'}, {path: '/"_etag"/?'}],
      },
    });
    /* istanbul ignore next */
    if (containerOps.statusCode !== 201) {
      throw new Error(JSON.stringify(containerOps));
    }

    // admin data
    const adminSamples: Admin[] = [];
    // testuser1, Password13!, ?????????
    let adminTimestamp = new Date('2021-03-10T00:50:43.000Z');
    adminSamples.push({
      id: 'testuser1',
      password: TestConfig.hash(
        'testuser1',
        adminTimestamp.toISOString(),
        'Password13!'
      ),
      name: '?????????',
      memberSince: adminTimestamp.toISOString(),
      session: undefined,
    });
    // testuser2, Password12!,?????????
    adminTimestamp = new Date('2021-03-07T01:15:42.000Z');
    adminSamples.push({
      id: 'testuser2',
      password: TestConfig.hash(
        'testuser2',
        adminTimestamp.toISOString(),
        'Password12!'
      ),
      name: '?????????',
      memberSince: adminTimestamp.toISOString(),
      session: undefined,
    });
    for (let index = 0; index < adminSamples.length; ++index) {
      await this.dbClient.container('admin').items.create(adminSamples[index]);
    }

    // event data
    const eventSamples: Event[] = [];
    // 2021-10-31, ????????? ??????, N/A, ????????????, testuser1
    eventSamples.push({
      id: undefined,
      date: new Date(2021, 9, 31),
      createdAt: new Date(),
      name: '????????? ??????',
      editor: 'testuser1',
      detail: undefined,
      category: '????????????',
    });
    // 2021-08-15, ?????????, N/A, N/A, testuser2
    eventSamples.push({
      id: undefined,
      date: new Date(2021, 7, 15),
      createdAt: new Date(),
      name: '?????????',
      editor: 'testuser2',
      detail: undefined,
      category: undefined,
    });
    // 2021-08-26, ????????? ?????? ??????, ????????? ????????? ?????? ????????? ???????????????., ????????? ??????, testuser2
    eventSamples.push({
      id: undefined,
      date: new Date(2021, 7, 26),
      createdAt: new Date(),
      name: '????????? ?????? ??????',
      editor: 'testuser2',
      detail: '????????? ????????? ?????? ????????? ???????????????.',
      category: '????????? ??????',
    });
    // 2021-12-31, ?????? ?????? ??????, ????????? ?????? BGM ???????????? ?????? ????????? ????????? ????????????, ?????? ????????? ??????????????? ?????? ?????????????????? ?????????., N/A, testuser1
    eventSamples.push({
      id: undefined,
      date: new Date(2021, 11, 31),
      createdAt: new Date(),
      name: '?????? ?????? ??????',
      editor: 'testuser1',
      detail:
        '????????? ?????? BGM ???????????? ?????? ????????? ????????? ????????????, ?????? ????????? ??????????????? ?????? ?????????????????? ?????????.',
      category: undefined,
    });
    for (let index = 0; index < eventSamples.length; ++index) {
      await Event.create(this.dbClient, eventSamples[index]);
    }

    // Retrieve Event ID
    const queryResult = await this.dbClient
      .container('event')
      .items.query('SELECT e.id, e.name FROM event as e')
      .fetchAll();
    const eventIdArray = [];
    eventIdArray.push(
      queryResult.resources.filter(r => r.name === '????????? ??????')[0].id
    );
    eventIdArray.push(
      queryResult.resources.filter(r => r.name === '?????????')[0].id
    );
    eventIdArray.push(
      queryResult.resources.filter(r => r.name === '????????? ?????? ??????')[0].id
    );
    eventIdArray.push(
      queryResult.resources.filter(r => r.name === '?????? ?????? ??????')[0].id
    );

    // participation data
    const participationSamples: Participation[] = [];
    // event 1, 2021-08-17, ?????????, null, yhkim@gmail.com, null
    participationSamples.push({
      id: undefined,
      eventId: eventIdArray[0],
      participantName: '?????????',
      email: 'yhkim@gmail.com',
      createdAt: new Date('2021-08-17'),
      comment: undefined,
      phoneNumber: undefined,
    });
    // event 3, 2021-08-20, ?????????, 010-1234-5678, yhkim@gmail.com, ??? ????????? yhkim ?????????.
    participationSamples.push({
      id: undefined,
      eventId: eventIdArray[2],
      createdAt: new Date('2021-08-20'),
      participantName: '?????????',
      phoneNumber: '01012345678',
      email: 'yhkim@gmail.com',
      comment: '??? ????????? yhkim ?????????.',
    });
    // event 3, 2021-08-21, ?????????, null, mskim@gmail.com, ??? ????????? mskim ?????????.
    participationSamples.push({
      id: undefined,
      eventId: eventIdArray[2],
      createdAt: new Date('2021-08-21'),
      participantName: '?????????',
      phoneNumber: undefined,
      email: 'mskim@gmail.com',
      comment: '??? ????????? mskim ?????????.',
    });
    // event 4, 2021-08-21, ?????????, 010-4567-1234, mskim@gmail.com, null
    participationSamples.push({
      id: undefined,
      eventId: eventIdArray[3],
      createdAt: new Date('2021-08-21'),
      participantName: '?????????',
      phoneNumber: '01045671234',
      email: 'mskim@gmail.com',
      comment: undefined,
    });
    for (let index = 0; index < participationSamples.length; ++index) {
      await Participation.create(this.dbClient, participationSamples[index]);
    }

    // Setup Express Server
    this.expressServer = new ExpressServer(this.testConfig);
  }

  /**
   * Teardown test environment after test
   *  - Remove used resources (DB)
   *  - close database/redis connection from the express server
   */
  async stop(): Promise<void> {
    // Drop database
    await (this.dbClient as Cosmos.Database).delete();

    // Close database connection of the express server
    await (this.expressServer as ExpressServer).closeServer();

    // Close database connection used during tests
    await (this.dbClient as Cosmos.Database).client.dispose();
  }
}
