'use strict';

const is = require('is_js');
const BasicEntity = require('./BasicEntity');

/**
 * @description
 */
module.exports = class RepoEntity extends BasicEntity {

  /**
   * @description
   */
  constructor(
    id,
    ownerId,
    name,
    createdAt,
    updatedAt
  ) {
    super(createdAt, updatedAt);
    this.id = id;
    this.ownerId = ownerId;
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
  get ownerId() {
    return this.data.ownerId;
  }

  /**
   * @description
   */
  set ownerId(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.ownerId = value;
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
};
