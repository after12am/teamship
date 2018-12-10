'use strict';

const Promise = require('bluebird');
const BasicModel = require('./BasicModel');
const PullsRepository = require('../repositories/PullsRepository');

/**
 * @description
 */
module.exports = class PullsModel extends BasicModel {

  /**
   * @description
   */
  constructor() {
    super();
    this.calculate = this.calculate.bind(this);
  }

  /**
   * @description
   * TODO: BusinessExecutionError
   */
  *calculate(option) {
    try {

      this.pullsRepository = new PullsRepository();

      const pulls = yield* this.pullsRepository.calculateForEachUser(
        option.start,
        option.end
      );

      const data = {};
      let total = 0;
      pulls.forEach((item) => {
        data[item.opener] = item.count;
        total += item.count;
      });
      data['total'] = total;

      return data;

    } catch (error) {

      throw error;

    } finally {

      this.pullsRepository.close();

    }
  }
};
