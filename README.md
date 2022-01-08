# Club Event Calendar API

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Repository for Club Event Calendar Backend API.
Originally built for Busan Developers Club (BGM): [BusanDevelopers/BGM-Event-Calendar-API](https://github.com/BusanDevelopers/BGM-Event-Calendar-API)

Refer [API Document](https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/) for supporting API list and features.  
Refer this [Repository](https://github.com/hyecheol123/Club-Event-Calendar-Webpage) for Frontend webpage.

## Scripts

Here is the list for supported npm/yarn scripts. These are used to lint, test, build, and run the code.

1. `lint`: lint the code
2. `lint:fix`: lint the code and try auto-fix
3. `build`: compile typescript codes (destination: `dist` directory)
4. `clean`: remove the compiled code
5. `start`: run the codes (Need following Environment Vairables: DB_ENDPOINT, DB_KEY, DB_ID)
6. `test`: Run the codes
7. `newAdmin`: Register new admin account (Need three CLA - username, password, admin's name)
8. `deleteAdmin`: remove admin account (Need one CLA - username)

Use Azure Cosmos DB Emulator while testing the application.
Details on install and usage guide of the emulator can be found [here](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=ssl-netstd21).  
Microsoft also offers Linux Docker image, but due to the severe performance issue, we recomment to run the emulator on Windows.
In this case, developers have to manually enable access on a local network.
Refer to the guide provided above.

As of now, Windows Worker of GitHub Action does not support Service Container.
Therefore, Azure Cosmos DB Emulator cannot run on the GitHub Action Worker.
So, automatic tests are disabled; Need manual test and code review for all features before pull request merge.

## Dependencies/Environment

Developed and tested with `Ubuntu 20.04.3 LTS` and `Node v16.13.1`.

To configure the typescript development environment easily, [gts](https://github.com/google/gts) has been used.
Based on the `gts` style rules, I modified some to enforce rules more strictly.
To see the modification, please check [`.eslintrc.json` file](https://github.com/BusanDevelopers/BGM-Event-Calendar-API/blob/main/.eslintrc.json).

This project uses [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) (Core(SQL) API).  
It is NoSQL Database without schema; The stored data will look like the Data Diagram located below.

Data Diagram
![ERD.png](img/ERD.png)

<details>
  <summary>Click to see configurations of each collection.</summary>

Configuration of `admin` Collection

```JSON
{
  id: 'admin',
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: [{path: '/session/token/?'}],
    excludedPaths: [{path: '/*'}, {path: '/"_etag"/?'}],
  },
}
```

Configuration of `event` Collection

```JSON
{
  id: 'event',
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: [{path: '/date/?'}],
    excludedPaths: [{path: '/*'}, {path: '/"_etag"/?'}],
  },
}
```

Configuration of `participation` Collection

```JSON
{
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
}
```

</details>

[Express](https://expressjs.com/) is a web framework for node.js.
This project used it to develop and maintain APIs more conveniently.

[ajv](https://ajv.js.org/) is used for runtime type checks.
