'use strict';

const moment = require('moment');
const BasicRepository = require('./BasicRepository');
const IssueCommentEntity = require('../entities/IssueCommentEntity');

/**
 * @description
 */
module.exports = class IssuesCommentsRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(issueComment) {

    if (!(issueComment instanceof IssueCommentEntity)) {
      throw new Error('argument has to be instance of IssueCommentEntity.');
    }

    const exists = yield* this.exist(issueComment.id);
    if (!exists) {
      yield* this.insert(issueComment);
      return;
    }

    yield* this.update(issueComment);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        issues_comments
      WHERE
        id = ?;
    `;
    const data = yield this.conn.query(sql, [
      id
    ]);
    return data.length > 0;
  }

  /**
   * @description
   */
  *insert(issueComment) {

    if (!(issueComment instanceof IssueCommentEntity)) {
      throw new Error('argument has to be instance of IssueCommentEntity.');
    }

    const sql = `
      INSERT INTO
        issues_comments
      SET
        id = ?,
        repository_id = ?,
        number = ?,
        user_id = ?,
        body = ?,
        created_at = ?,
        updated_at = ?;
    `;
    return yield this.conn.query(sql, [
      issueComment.id,
      issueComment.repositoryId,
      issueComment.number,
      issueComment.userId,
      JSON.stringify(issueComment.body),
      issueComment.createdAt,
      issueComment.updatedAt
    ]);
  }

  /**
   * @description
   */
  *update(issueComment) {

    if (!(issueComment instanceof IssueCommentEntity)) {
      throw new Error('argument has to be instance of IssueCommentEntity.');
    }

    const sql = `
      UPDATE
        issues_comments
      SET
        repository_id = ?,
        number = ?,
        user_id = ?,
        body = ?,
        created_at = ?,
        updated_at = ?
      WHERE
        id = ?;
    `;
    return yield this.conn.query(sql, [
      issueComment.repositoryId,
      issueComment.number,
      issueComment.userId,
      JSON.stringify(issueComment.body),
      issueComment.createdAt,
      issueComment.updatedAt,
      issueComment.id
    ]);
  }

  /**
   * @description
   */
  *getAll() {
    const sql = `
      SELECT
        id,
        repository_id,
        number,
        user_id,
        body,
        created_at,
        updated_at
      FROM
        issues_comments;
    `;
    return yield this.conn.query(sql);
  }

  /**
   * @description コメント数を集計します。
   */
  *calculateForEachUser(start, end) {
    const sql = `
      SELECT
        commentator,
        count(commentator) AS count
      FROM (
        SELECT
          users.name AS commentator
        FROM
          issues_comments
        INNER JOIN
          users ON issues_comments.user_id = users.id
        WHERE
            issues_comments.created_at >= ?
        AND issues_comments.created_at < ?
        -- NOTE: I wonder if group by is missing.
      ) AS tmp
      GROUP BY
        commentator;
    `;
    return yield this.conn.query(sql, [
      start || moment('1970-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
      end || moment().format('YYYY-MM-DD HH:mm:ss')
    ]);
  }
};
