'use strict';

const is = require('is_js');
const moment = require('moment');
const BasicEntity = require('./BasicEntity');

/**
 * @description
 */
module.exports = class PullsEntity extends BasicEntity {

  /**
   * @description
   */
  constructor(
    id,
    repositoryId,
    number,
    userId,
    state,
    body,
    createdAt,
    updatedAt,
    closedAt,
    mergedAt
  ) {
    super(createdAt, updatedAt);
    this.id = id;
    this.repositoryId = repositoryId;
    this.number = number;
    this.userId = userId;
    this.state = state;
    this.body = body;
    this.closedAt = closedAt;
    this.mergedAt = mergedAt;
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
  get state() {
    return this.data.state;
  }

  /**
   * @description
   */
  set state(value) {
    if (!is.string(value)) {
      throw new Error('have to be string');
    }
    this.data.state = value;
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

  /**
   * @description
   */
  get closedAt() {
    if (this.data.closedAt) {
      return moment(this.data.closedAt).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
  }

  /**
   * @description
   */
  set closedAt(value) {
    this.data.closedAt = value || null;
  }

  /**
   * @description
   */
  get mergedAt() {
    if (this.data.mergedAt) {
      return moment(this.data.mergedAt).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
  }

  /**
   * @description
   */
  set mergedAt(value) {
    this.data.mergedAt = value || null;
  }
};
