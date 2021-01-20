const sqlite3 = require('sqlite3').verbose();



class TimeService {

  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql);
          console.log(err);
          reject(err)
        } else {
          resolve({ id: this.lastID })
        }
      })
    })
  }


  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    })
  }

  getCount(location) {
    // get sqlite connection
    // SELECT count from table
    // where locaiton = locaiotn
    // close connection
    // return count
    let sql = `SELECT count FROM timezones WHERE location = ?`;

    return new Promise((resolve, reject) => {
      this.db.get(sql, location, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

  updateCount(location) {
    // get sqlite connection
    // update count from table
    // set count = count +1
    // where location = location
    // close connection
    // return count
    return this.dao.run(
      `UPDATE timezones SET count = count + 1 WHERE location = ?`,
      [location]
    );
  }


}

module.exports = TimeService;
