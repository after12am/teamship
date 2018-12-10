'use strict';

const is = require('is_js');
const BasicEntity = require('./BasicEntity');

/**
 * @description
 */
module.exports = class UserEntity extends BasicEntity {

  /**
   * @description
   */
  constructor(
    id,
    name
  ) {
    super();
    this.id = id;
    this.name = name;
  }

  /**
   * @description
   */
  get id() {
    return this.data.id;
  }

  /**
   * @description
   */
  set id(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.id = value;
  }

  /**
   * @description
   */
  get name() {
    return this.data.name;
  }

  /**
   * @description
   */
  set name(value) {
    if (!is.string(value)) {
      throw new Error('have to be string');
    }
    this.data.name = value;
  }

  /**
   * @description
   */
  equals(user) {
    return user.id === this.id
      && user.name === this.name;
  }
};
