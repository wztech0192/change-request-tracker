# Adonis Query, Migration, and Seeding Commands

## Migration
```generate default developer account 
adonis migration:run
```

## Data Seeding
```generate default developer account 
adonis seed --files='DefaultSeeder.js'
```

```generate 20 mock users  
adonis seed --files='UserSeeder.js'
```

```generate 10 mock change requests from random user
adonis seed --files='ChangeRequestSeeder.js'
```

## My SQL Queries
```update user total request 

UPDATE users
SET totalRequest =
(SELECT COUNT(*) FROM change_requests
WHERE change_requests.user_id = users.id);

```