'use strict';

const moment = require('moment');
const BasicRepository = require('./BasicRepository');
const PullsCommentEntity = require('../entities/PullsCommentEntity');

/**
 * @description
 */
module.exports = class PullsCommentsRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(pullsComment) {

    if (!(pullsComment instanceof PullsCommentEntity)) {
      throw new Error('argument has to be instance of PullsCommentEntity.');
    }

    const exists = yield* this.exist(pullsComment.id);
    if (!exists) {
      yield* this.insert(pullsComment);
      return;
    }

    yield* this.update(pullsComment);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        pulls_comments
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
  *insert(pullsComment) {

    if (!(pullsComment instanceof PullsCommentEntity)) {
      throw new Error('argument has to be instance of PullsCommentEntity.');
    }

    const sql = `
      INSERT INTO
        pulls_comments
      SET
        id = ?,
        repository_id = ?,
        number = ?,
        user_id = ?,
        path = ?,
        position = ?,
        original_position = ?,
        body = ?,
        created_at = ?,
        updated_at = ?;
    `;
    return yield this.conn.query(sql, [
      pullsComment.id,
      pullsComment.repositoryId,
      pullsComment.number,
      pullsComment.userId,
      pullsComment.path,
      pullsComment.position,
      pullsComment.originalPosition,
      JSON.stringify(pullsComment.body),
      pullsComment.createdAt,
      pullsComment.updatedAt
    ]);
  }

  /**
   * @description
   */
  *update(pullsComment) {

    if (!(pullsComment instanceof PullsCommentEntity)) {
      throw new Error('argument has to be instance of PullsCommentEntity.');
    }

    const sql = `
      UPDATE
        pulls_comments
      SET
        repository_id = ?,
        number = ?,
        user_id = ?,
        path = ?,
        position = ?,
        original_position = ?,
        body = ?,
        created_at = ?,
        updated_at = ?
      WHERE
        id = ?;
    `;
    return yield this.conn.query(sql, [
      pullsComment.repositoryId,
      pullsComment.number,
      pullsComment.userId,
      pullsComment.path,
      pullsComment.position,
      pullsComment.originalPosition,
      JSON.stringify(pullsComment.body),
      pullsComment.createdAt,
      pullsComment.updatedAt,
      pullsComment.id
    ]);
  }

  /**
   * @description レビュー数を集計します。
   */
  *calculateForEachUser(start, end) {
    const sql = `
      SELECT
        reviewer,
        count(reviewer) AS count
      FROM (
        SELECT
          users.name AS reviewer
        FROM
          pulls_comments AS reviews
        INNER JOIN
          users ON reviews.user_id = users.id
        WHERE
          reviews.created_at >= ?
        AND reviews.created_at < ?
        GROUP BY
          repository_id, number, user_id, position, original_position, path
      ) AS tmp
      GROUP BY
        reviewer;
    `;
    return yield this.conn.query(sql, [
      start || moment('1970-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
      end || moment().format('YYYY-MM-DD HH:mm:ss')
    ]);
  }

  /**
   * @description
   * TODO: pagingつける
   */
  *getAll() {
    const sql = `
      SELECT
        id,
        repository_id,
        number,
        user_id,
        path,
        original_position,
        body,
        created_at,
        updated_at
      FROM
        pulls_comments
    `;
    return yield this.conn.query(sql);
  }
};
