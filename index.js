import express from 'express';
import { Client } from 'pg';
import crypto from 'crypto';
import HashRing from 'hashring';

export const app = express();
const hr = new HashRing();

/* 
  Add 5 database to hashring
  Using consistency hashing algorithm
  to avoid new database added into hashring
  ot delete database from hashring
  Consistency hashing algorithm will make sure
  uniform distribution for hashing
  so we can avoid high rebalance cost for any accident
*/
hr.add('5432');
hr.add('5433');
hr.add('5434');
hr.add('5435');
hr.add('5436');

const clients = {
  5432: new Client({
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
  5433: new Client({
    host: 'localhost',
    port: '5433',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
  5434: new Client({
    host: 'localhost',
    port: '5434',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
  5435: new Client({
    host: 'localhost',
    port: '5435',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
  5436: new Client({
    host: 'localhost',
    port: '5436',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
};

connect();
async function connect() {
  await clients['5432'].connect();
  await clients['5433'].connect();
  await clients['5434'].connect();
  await clients['5435'].connect();
  await clients['5436'].connect();
}

app.get('/:urlId', async (req, res) => {
  /* 
    GET database data by specific urlId 
  */
  const urlId = req.params.urlId; // "e.g. QX73o"
  const server = hr.get(urlId); // Assigned hashed url to related database server

  const result = await clients[server].query(
    'SELECT * FROM URL_TABLE WHERE URL_ID = $1',
    [url, urlId] // $1 -> urlId
  );

  if (result.rows.length > 0) {
    res.send({
      urlId: urlId, // "QX73o"
      url: result.rows[0], // {id: 9, url: http://google.com.in?q=test6, url_id: QX73o}
      server: server, // 5433
    });
  } else {
    res.status(404).send('Not Found');
  }
});

app.post('/', async (req, res) => {
  /* 
    POST database data by automatically assign urlId
    to different server
  */
  const url = req.query.url; // Origin url
  /*
  e.g. www.wikipedia.org/wiki/Main_Page...，exch url will be hashed to base64
  Consistently hash this url to get a port
  */
  const hash = crypto.createHash('sha256').update(url).digest('base64'); // Using consistent hashing to get urlId
  const urlId = hash.substring(0, 5); // get Hashed urlId's string(0, 5), 5 words long
  const server = hr.get(urlId); // Assigned hashed url to related database server

  await clients[server].query(
    'INSERT INTO URL_TABLE (URL, URL_ID) VALUES ($1,$2)',
    [url, urlId] // $1 -> url,  $2 -> urlId
  );

  res.send({
    urlId: urlId,
    url: url,
    server: server,
  });
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // await connectToDatabase();
  console.log('Connected to all databases');
});
