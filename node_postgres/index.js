'use strict';

//Loading ENV variable
require('dotenv').load();

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  // client
  //   .query('select * from listings;')
  //   .on('row', function(row) {
  //     console.log(JSON.stringify(row));
  //   });
  console.log(client);
});
