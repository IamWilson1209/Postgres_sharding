
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" /> <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" /> <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />

## Purpose
Implement sharding using PostgreSQL.

## Functionality
Creates 5 shards.<br>
Create API to post URLs to a specific shard.<br>
Create an API to get shard information using a specific hashed URL ID.
Using hashring to distribute URLs to different shards.

## How to use this repository

### 1. Install all dependencies<br>
```npm install```

### 2. Please make sure you've spun up docker's PostgreSQL through the following command:<br>
Building the image
```docker build -t pgshard .```

Spin up the containers
```
docker run --name shard1 -p 5432:5432 pgshard
docker run --name shard2 -p 5433:5432 pgshard
docker run --name shard3 -p 5434:5432 pgshard
docker run --name shard4 -p 5435:5432 pgshard
docker run --name shard5 -p 5436:5432 pgshard
```

Spin up pgadmin, and login
```docker run -e PGADMIN_DEFAULT_EMAIL="example@gmail.com" -e PGADMIN_DEFAULT_PASSWORD="password" -p 5580:80 —name pgadmin dpage/pgadmin4 ```

### 3. Run index.js
Run this command in the terminal
```node index.js```

### 4. Test
There are several ways that can test this script
e.g.```curl -X POST "http://localhost:3000/?url=https://www.example.com"``` || ```curl -X GET "http://localhost:3000/{urlId}"```
