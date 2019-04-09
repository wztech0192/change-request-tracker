# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.

## Migrations
```migrate database table
adonis migration:run
```

## Data Seeding
generate default developer account 
```
adonis seed --files='DefaultSeeder.js'
```
### Mock Seeding
* Relocate mock seed files from `database\seeds\mock_seeds` to `database\seeds` to enable mock seeding
generate 20 mock users  
```
adonis seed --files='UserSeeder.js'
```

generate 10 mock change requests from random user
```
adonis seed --files='ChangeRequestSeeder.js'
```

## Functional API Testing
```functional api testing with 31 test items
adonis test
```
