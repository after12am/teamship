'use strict';

const is = require('is_js');
const moment = require('moment');

/**
 * @description
 */
module.exports = class BasicEntity {

  /**
   * @description
   */
  constructor(
    createdAt,
    updatedAt
  ) {
    this.data = {};
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * @description
   */
  get createdAt() {
    return moment(this.data.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * @description
   */
  set createdAt(value) {
    this.data.createdAt = value || null;
  }

  /**
   * @description
   */
  get updatedAt() {
    return moment(this.data.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * @description
   */
  set updatedAt(value) {
    this.data.updatedAt = value || null;
  }

  /**
   * @description
   */
  equals(value) {
    throw new Error('have to be overridden.');
  }
};
