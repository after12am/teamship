'use strict';

const Promise = require('bluebird');
const co = Promise.coroutine;
const GithubExecutor = require('./GithubExecutor');
const UserEntity = require('../entities/UserEntity');
const IssueCommentEntity = require('../entities/IssueCommentEntity');
const UserRepository = require('../repositories/UserRepository');
const IssuesCommentsRepository = require('../repositories/IssuesCommentsRepository');
const IssuesRepository = require('../repositories/IssuesRepository');

/**
 * @description
 */
module.exports = class GetIssuesCommentsExecutor extends GithubExecutor {

  /**
   * @description
   */
  constructor() {
    super();
    this._save = this._save.bind(this);
  }

  /**
   * @description
   */
  *execute() {
    try {

      this.issuesRepository = new IssuesRepository();
      this.issueCommentsRepository = new IssuesCommentsRepository();
      this.userRepository = new UserRepository();

      const issues = yield* this.issuesRepository.getAll();

      for (var i in issues) {

        const issue = issues[i];
        const params = {
          page: 1,
          per_page: 100,
          owner: issue.owner,
          repo: issue.repository_name,
          number: issue.number
        };

        while (1) {
          console.log(params);
          let response;
          try {
            response = yield this.github.getIssuesComments(params);
          } catch (error) {
            this.emit('error', error);
            break;
          }

          for (const i in response.data) {
            yield* this._save(issue, response.data[i]);
          }

          if (response.data.length === 0 || response.data.length < params.per_page) break;

          params.page++;
        }
      }

    } catch (error) {

      this.emit('error', error);

    } finally {

      this.issuesRepository.close();
      this.issueCommentsRepository.close();
      this.userRepository.close();
      this.emit('end');

    }
  }

  /**
   * @description リポジトリ情報をデータベースに保存します。
   */
  *_save(issue, data) {
    const user = new UserEntity(
      data.user.id,
      data.user.login
    );
    yield* this.userRepository.save(user);

    const number = +data.issue_url.match(/issues\/([0-9]+)$/)[1];
    const issueComment = new IssueCommentEntity(
      data.id,
      issue.repository_id,
      number,
      data.user.id,
      data,
      data.created_at,
      data.updated_at
    );
    yield* this.issueCommentsRepository.save(issueComment);
  }
};
