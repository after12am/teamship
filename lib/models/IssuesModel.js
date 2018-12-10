'use strict';

const Promise = require('bluebird');
const BasicModel = require('./BasicModel');
const IssuesRepository = require('../repositories/IssuesRepository');

/**
 * @description
 */
module.exports = class IssuesModel extends BasicModel {

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

      this.issuesRepository = new IssuesRepository();

      const issues = yield* this.issuesRepository.calculateForEachUser(
        option.start,
        option.end
      );

      const data = {};
      let total = 0;
      issues.forEach((item) => {
        data[item.reviewer] = item.count;
        total += item.count;
      });
      data['total'] = total;

      return data;

    } catch (error) {

      throw error;

    } finally {

      this.issuesRepository.close();

    }
  }
};
