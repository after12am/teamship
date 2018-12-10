'use strict';

const is = require('is_js');
const BasicEntity = require('./BasicEntity');

/**
 * @description
 */
module.exports = class PullsCommentEntity extends BasicEntity {

  /**
   * @description
   */
  constructor(
    id,
    repositoryId,
    number,
    userId,
    path,
    position,
    originalPosition,
    body,
    createdAt,
    updatedAt
  ) {
    super(createdAt, updatedAt);
    this.id = id;
    this.repositoryId = repositoryId;
    this.number = number;
    this.userId = userId;
    this.path = path;
    this.position = position;
    this.originalPosition = originalPosition;
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
  get path() {
    return this.data.path;
  }

  /**
   * @description
   */
  set path(value) {
    if (!is.string(value)) {
      throw new Error('have to be string');
    }
    this.data.path = value;
  }

  /**
   * @description
   */
  get position() {
    return this.data.position;
  }

  /**
   * @description
   */
  set position(value) {
    this.data.position = value || null;
  }

  /**
   * @description
   */
  get originalPosition() {
    return this.data.originalPosition;
  }

  /**
   * @description
   */
  set originalPosition(value) {
    if (!is.number(value)) {
      throw new Error('have to be numeric');
    }
    this.data.originalPosition = value;
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
