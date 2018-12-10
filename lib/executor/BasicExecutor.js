'use strict';

const EventEmitter = require('events');

/**
 * @description
 */
module.exports = class BasicExecutor extends EventEmitter {

  /**
   * @description
   */
  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  /**
   * @description
   */
  *execute() {
    throw new Error('should be overwritten.');
  }
};
