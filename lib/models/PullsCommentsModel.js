'use strict';

const Promise = require('bluebird');
const BasicModel = require('./BasicModel');
const PullsCommentsRepository = require('../repositories/PullsCommentsRepository');

/**
 * @description 使ってない
 */
module.exports = class PullsCommentsModel extends BasicModel {

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

      this.pullsCommentsRepository = new PullsCommentsRepository();

      const comments = yield* this.pullsCommentsRepository.calculateForEachUser(
        option.start,
        option.end
      );

      const data = {};
      let total = 0;
      comments.forEach((item) => {
        data[item.reviewer] = item.count;
        total += item.count;
      });
      data['total'] = total;

      return data;

    } catch (error) {

      throw error;

    } finally {

      this.pullsCommentsRepository.close();

    }
  }
};
