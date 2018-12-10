'use strict';

const config = require('config');
const Github = require('../Github');
const BasicExecutor = require('./BasicExecutor');

/**
 * @description
 */
module.exports = class GithubExecutor extends BasicExecutor {

  /**
   * @description
   */
  constructor() {
    super();
    this.github = new Github();
    this.github.authenticate();
  }
};
