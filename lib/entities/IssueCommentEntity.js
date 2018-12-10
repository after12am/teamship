'use strict';

const is = require('is_js');
const BasicEntity = require('./BasicEntity');

/**
 * @description
 */
module.exports = class IssueCommentEntity extends BasicEntity {

  /**
   * @description
   */
  constructor(
    id,
    repositoryId,
    number,
    userId,
    body,
    createdAt,
    updatedAt
  ) {
    super(createdAt, updatedAt);
    this.id = id;
    this.repositoryId = repositoryId;
    this.number = number;
    this.userId = userId;
    this.body = body;
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
  get repositoryId() {
    return this.data.repositoryId;
  }

  /**
   * @description
   */
  set repositoryId(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.repositoryId = value;
  }

  /**
   * @description
   */
  get number() {
    return this.data.number;
  }

  /**
   * @description
   */
  set number(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.number = value;
  }

  /**
   * @description
   */
  get userId() {
    return this.data.userId;
  }

  /**
   * @description
   */
  set userId(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.userId = value;
  }

  /**
   * @description
   */
  get body() {
    return this.data.body;
  }

  /**
   * @description
   */
  set body(value) {
    if (is.falsy(value)) {
      throw new Error('falsy is not allowed.');
    }
    this.data.body = value;
  }
};
