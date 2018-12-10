'use strict';

const moment = require('moment');
const BasicRepository = require('./BasicRepository');
const PullsCommentEntity = require('../entities/PullsCommentEntity');

/**
 * @description
 */
module.exports = class CommentsRepository extends BasicRepository {

  /**
   * @description レビュー数を集計します。
   */
  *calculateForEachUser(start, end) {
    const sql = `
      SELECT
        users.name AS reviewer,
        count(users.name) AS count
      FROM
        pulls_comments AS comments
      INNER JOIN
        users ON comments.user_id = users.id
      WHERE
          comments.created_at >= ?
      AND comments.created_at < ?
      GROUP BY
        users.name
    `;
    return yield this.conn.query(sql, [
      start || moment('1970-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
      end || moment().format('YYYY-MM-DD HH:mm:ss')
    ]);
  }
};
