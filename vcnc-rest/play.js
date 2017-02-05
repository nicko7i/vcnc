const r = require('rethinkdb');
const config = require('./lib/configuration.js');
const grid = require('./lib/grid.js');

grid.init()
.then(() => {
  return grid.createJob('corner-3.3.2', '/eng/mango/corner-3.3.1');
})
.then(() => {
  return grid.getJob('corner-3.3.2');
})
.then((row) => {
  console.log(row);
  return grid.deleteJob('corner-3.3.2');
})
.then(() => {
  console.log('finished');
});


/*

 var cnxtn = null;
 const dbName = config.rethinkdb.dbName;
 function init() {
 return r.connect(config.rethinkdb.connection)
 .then(conn => {
 cnxtn = conn;  // save the connection for later reuse
 return r.dbList().filter(v => {
 return v.eq(dbName);
 }).run(conn);
 })
 .then(lst => {
 console.log(lst);
 if (lst.length == 0) {
 return r.dbCreate(dbName).run(cnxtn);
 }
 return Promise.resolve();
 });
 }

r.connect(config.rethinkdb.connection)
.then((conn) => {
  r.dbList().filter(v => {
    // return v.eq('vcnc_rest');
    return v.eq(config.rethinkdb.dbName);
    //return config.rethinkdb.dbName;
  })
  .run(conn)
  .then(l => {
    console.log(l);
  })
  .catch(err => {
    console.log(err);
  });
})

r.connect(config.rethinkdb.connection)
.then((conn) => {
  r.dbList().filter(function (v) {
    // return v.eq('vcnc_rest');
    return v.eq(config.rethinkdb.dbName);
    //return config.rethinkdb.dbName;
  })
  .run(conn)
  .then(l => {
    console.log(l);
  })
  .catch(err => {
    console.log(err);
  });
})

(function (dbname) {
  r.connect(config.rethinkdb.connection)
  .then((conn) => {
    console.log(dbname);
    r.dbList()
    .run(conn)
    .then(l => {
      const shorter = l.filter(v => {
        // return (v === 'test');
        return (v.match('vcnc_rest'));
      });
      console.log(shorter)
    })
    .catch(err => {
      console.log(err);
    });
  })
})(config.rethinkdb.dbName);

*/

/*
const db_name = 'vcnc_rest';
const db_config_name = config.rethinkdb.dbName;
console.log("the two strings")
console.log(config.rethinkdb.dbName)
console.log(config.rethinkdb.dbName)
console.log("the 'typeof' values")
console.log(typeof db_name);
console.log(typeof db_config_name);
console.log("== compare")
console.log('vcnc_rest' == db_name);
console.log('vcnc_rest' == db_config_name.trim());
console.log("=== compare")
console.log('vcnc_rest' === db_name);
console.log('vcnc_rest' === db_config_name);
console.log("the string lengths")
console.log('vcnc_rest'.length)
console.log(db_name.length)
console.log(db_config_name.length)
*/
