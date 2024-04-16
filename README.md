# Setup

- install and open docker desktop (or at lease docker should be running)
- cd to root of this project and run `docker compose up -d`
- run `yarn`
- sync tables in database with the migration files wiht `npx prisma db push`
- go to pgadmin (`localhost:8080`) to connect to database

## setup pgadmin

- open browser at `localhost:8080`
- create new server
- type some name
- go to tab `connection`
- Host name: `pgdb_container`
- Port: `5432`
- Username and Pwd: `haola`
- save pwd and connect
- open database `postgres` u will see the result

## add default data

- at root, see the `data` directory?
- inside it, there is a file called `init_data`
- go to the `pgadmin`, righ-click on the database called `postgres`
- select `Restore...`
- select file, if it's not there? upload it first (click `...` at top right of the modal)
- click `restore`
- check data in tables

# start server

- `yarn start:dev`
- open browser at `localhost:3000/players/all`, u will see the json data of all players
