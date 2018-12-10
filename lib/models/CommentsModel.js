'use strict';

const Promise = require('bluebird');
const BasicModel = require('./BasicModel');
const CommentsRepository = require('../repositories/CommentsRepository');
const IssuesCommentsRepository = require('../repositories/IssuesCommentsRepository');

/**
 * @description
 */
module.exports = class CommentsModel extends BasicModel {

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

      this.commentsRepository = new CommentsRepository();
      this.issuesCommentsRepository = new IssuesCommentsRepository();

      const comments = yield* this.commentsRepository.calculateForEachUser(
        option.start,
        option.end
      );

      const issuesComments = yield* this.issuesCommentsRepository.calculateForEachUser(
        option.start,
        option.end
      );

      const data = {};
      let total = 0;

      comments.forEach((item) => {
        data[item.reviewer] = data[item.reviewer] || 0;
        data[item.reviewer] = item.count;
        total += item.count;
      });

      issuesComments.forEach((item) => {
        data[item.commentator] = data[item.commentator] || 0;
        data[item.commentator] += item.count;
        total += item.count;
      });

      data['total'] = total;

      return data;

    } catch (error) {

      throw error;

    } finally {

      this.commentsRepository.close();
      this.issuesCommentsRepository.close();

    }
  }
};
