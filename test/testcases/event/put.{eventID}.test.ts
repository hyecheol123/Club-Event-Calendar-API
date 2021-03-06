/**
 * Jest unit test for PUT /event/{eventID} method
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import * as Cosmos from '@azure/cosmos';
import TestEnv from '../../TestEnv';
import ExpressServer from '../../../src/ExpressServer';

describe('PUT /event/{eventID} - Edit an existing event', () => {
  let testEnv: TestEnv;

  // DB Container ID
  const EVENT = 'event';

  // Information that used during the test
  const loginCredentials = {id: 'testuser1', password: 'Password13!'};

  beforeAll(() => {
    jest.setTimeout(120000);
  });

  beforeEach(async () => {
    // Setup test environment
    testEnv = new TestEnv(expect.getState().currentTestName);

    // Start Test Environment
    await testEnv.start();
  });

  afterEach(async () => {
    await testEnv.stop();
  });

  test('Success - Edit year', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-10');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({year: 2022});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2022, 9, 31).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ??????');
    expect(queryResult.resources[0].detail).toBeUndefined();
    expect(queryResult.resources[0].category).toBe('????????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit month', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({month: 10});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 9, 26).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit date', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({date: 11});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 11).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit name', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '?????????'
    )[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({name: '?????????: ?????????'});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 15).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????????: ?????????');
    expect(queryResult.resources[0].detail).toBeUndefined();
    expect(queryResult.resources[0].category).toBeUndefined();
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit detail', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '?????????'
    )[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({detail: '???????????? ???????????????.'});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 15).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????????');
    expect(queryResult.resources[0].detail).toBe('???????????? ???????????????.');
    expect(queryResult.resources[0].category).toBeUndefined();
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit category', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '?????????'
    )[0].id;

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({category: '?????????'});
    expect(response.status).toBe(200);

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 15).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????????');
    expect(queryResult.resources[0].detail).toBeUndefined();
    expect(queryResult.resources[0].category).toBe('?????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Success - Edit numerous properties', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-10');
    expect(response.status).toBe(200);
    let eventId = response.body.eventList[0].id;

    // Update an event - date and name
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({month: 11, date: 1, name: '?????? ????????? ??????'});
    expect(response.status).toBe(200);
    // DB Check
    let queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 10, 1).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????? ????????? ??????');
    expect(queryResult.resources[0].detail).toBeUndefined();
    expect(queryResult.resources[0].category).toBe('????????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');

    // date and detail
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({month: 11, date: 2, detail: '????????? ????????? ???????????? ??????'});
    expect(response.status).toBe(200);
    // DB Check
    queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 10, 2).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????? ????????? ??????');
    expect(queryResult.resources[0].detail).toBe('????????? ????????? ???????????? ??????');
    expect(queryResult.resources[0].category).toBe('????????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '?????????'
    )[0].id;

    // detail and category
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({detail: '???????????? ???????????????', category: '?????????'});
    expect(response.status).toBe(200);
    // DB Check
    queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 15).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('?????????');
    expect(queryResult.resources[0].detail).toBe('???????????? ???????????????');
    expect(queryResult.resources[0].category).toBe('?????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // everything
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({
        month: 10,
        date: 11,
        name: '??? 1??? ????????? ??????',
        detail: '??? ?????? ?????? ??????',
        category: '??? ??????',
      });
    expect(response.status).toBe(200);
    // DB Check
    queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 9, 11).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('??? 1??? ????????? ??????');
    expect(queryResult.resources[0].detail).toBe('??? ?????? ?????? ??????');
    expect(queryResult.resources[0].category).toBe('??? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser1');

    // Leap Year
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({
        year: 2024,
        month: 2,
        date: 29,
        name: '??? 1??? ????????? ??????',
        detail: '??? ?????? ?????? ??????',
        category: '??? ??????',
      });
    expect(response.status).toBe(200);
    // DB Check
    queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2024, 1, 29).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('??? 1??? ????????? ??????');
    expect(queryResult.resources[0].detail).toBe('??? ?????? ?????? ??????');
    expect(queryResult.resources[0].category).toBe('??? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser1');
  });

  test('Fail - Invalid year range', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Request
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({
        year: 2020,
        month: 10,
        date: 11,
        name: '??? 1??? ????????? ??????',
        detail: '??? ?????? ?????? ??????',
        category: '??? ??????',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 26).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser2');
  });

  test('Fail - Additional field', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Request
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({
        month: 10,
        date: 11,
        name: '??? 1??? ????????? ??????',
        detail: '??? ?????? ?????? ??????',
        category: '??? ??????',
        contact: 'bgmadmin@gmail.com',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 26).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser2');
  });

  test('Fail - Unauthorized', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    const eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Request
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', ['X-ACCESS-TOKEN='])
      .send({month: 10, date: 11});
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      'Authentication information is missing/invalid'
    );

    // DB Check
    const queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 26).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser2');
  });

  test('Fail - Invalid date', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-10');
    expect(response.status).toBe(200);
    let eventId = response.body.eventList[0].id;

    // Request
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({month: 9});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    // DB Check
    let queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 9, 31).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ??????');
    expect(queryResult.resources[0].detail).toBeUndefined();
    expect(queryResult.resources[0].category).toBe('????????????');
    expect(queryResult.resources[0].editor).toBe('testuser1');

    // Get Event ID
    response = await request(testEnv.expressServer.app).get('/2021-8');
    expect(response.status).toBe(200);
    eventId = response.body.eventList.filter(
      (e: {name: string}) => e.name === '????????? ?????? ??????'
    )[0].id;

    // Request - Leap Year
    response = await request(testEnv.expressServer.app)
      .put(`/event/${eventId}`)
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({year: 2021, month: 2, date: 29});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    // DB Check
    queryResult = await testEnv.dbClient
      .container(EVENT)
      .items.query(`SELECT * FROM event AS e WHERE e.id = "${eventId}"`)
      .fetchAll();
    expect(queryResult.resources.length).toBe(1);
    expect(new Date(queryResult.resources[0].date).toISOString()).toBe(
      new Date(2021, 7, 26).toISOString()
    );
    expect(queryResult.resources[0].name).toBe('????????? ?????? ??????');
    expect(queryResult.resources[0].detail).toBe(
      '????????? ????????? ?????? ????????? ???????????????.'
    );
    expect(queryResult.resources[0].category).toBe('????????? ??????');
    expect(queryResult.resources[0].editor).toBe('testuser2');
  });

  test('Fail - Event ID Not found', async () => {
    testEnv.expressServer = testEnv.expressServer as ExpressServer;
    testEnv.dbClient = testEnv.dbClient as Cosmos.Database;

    // Login
    let response = await request(testEnv.expressServer.app)
      .post('/auth/login')
      .send(loginCredentials);
    expect(response.status).toBe(200);
    const accessToken = response.header['set-cookie'][0]
      .split('; ')[0]
      .split('=')[1];

    // Update an event
    response = await request(testEnv.expressServer.app)
      .put('/event/100')
      .set('Cookie', [`X-ACCESS-TOKEN=${accessToken}`])
      .send({name: '?????? ????????? ??????', year: 2022, month: 11, date: 1});
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found');
  });
});
