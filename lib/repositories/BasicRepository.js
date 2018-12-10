'use strict';

const MySQL = require('../MySQL');

/**
 * @description
 */
module.exports = class BasicRepository {

  /**
   * @description
   */
  constructor() {
    this.conn = new MySQL(); // TODO: MySQL.getInstance()
    this.save = this.save.bind(this);
    this.exist = this.exist.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * @description
   */
  close() {
    this.conn.end();
  }

  /**
   * @description
   */
  *save() {
    throw new Error('have to override method.');
  }

  /**
   * @description
   */
  *exist() {
    throw new Error('have to override method.');
  }

  /**
   * @description
   */
  *insert() {
    throw new Error('have to override method.');
  }

  /**
   * @description
   */
  *update() {
    throw new Error('have to override method.');
  }
};
