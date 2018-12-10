'use strict';

const config = require('config');
const mysql = require('mysql');


/**
 * @description
 */
module.exports = class MySQL {

  /**
   * @description
   * TODO: シングルトンにする
   */
  constructor() {
    this.pool = mysql.createPool(config.mysql);
  }

  /**
   * @description
   * @param {String}
   * @param {Array}
   */
  query(sql, values) {
    return new Promise((resolve, reject) => {
      return this.pool.query(sql, values, (error, results, fields) => {
        if (error) return reject(error);
        return resolve(results); // => resolve({ results, fields })
      });
    });
  }

  /**
   * @description
   * @param {String}
   * @param {Array}
   */
  end(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.end();
      resolve();
    });
  }
};
