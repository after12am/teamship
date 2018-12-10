'use strict';

const Promise = require('bluebird');
const co = Promise.coroutine;
const GithubExecutor = require('./GithubExecutor');
const UserEntity = require('../entities/UserEntity');
const PullsCommentEntity = require('../entities/PullsCommentEntity');
const UserRepository = require('../repositories/UserRepository');
const PullsRepository = require('../repositories/PullsRepository');
const PullsCommentsRepository = require('../repositories/PullsCommentsRepository');

/**
 * @description
 */
module.exports = class GetPullsCommentsExecutor extends GithubExecutor {

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

      this.pullsRepository = new PullsRepository();
      this.pullsCommentsRepository = new PullsCommentsRepository();
      this.userRepository = new UserRepository();

      const pulls = yield* this.pullsRepository.getAll();

      for (var i in pulls) {

        const pull = pulls[i];
        const params = {
          page: 1,
          per_page: 100,
          owner: pull.owner,
          repo: pull.repository_name,
          number: pull.number
        };

        while (1) {
          console.log(params);
          let response;
          try {
            response = yield this.github.getPullRequestsComments(params);
          } catch (error) {
            this.emit('error', error);
            break;
          }

          for (const i in response.data) {
            yield* this._save(pull, response.data[i]);
          }

          if (response.data.length === 0 || response.data.length < params.per_page) break;

          params.page++;
        }
      }

    } catch (error) {

      this.emit('error', error);

    } finally {

      this.pullsRepository.close();
      this.pullsCommentsRepository.close();
      this.userRepository.close();
      this.emit('end');

    }
  }

  /**
   * @description リポジトリ情報をデータベースに保存します。
   */
  *_save(pull, data) {

    const user = new UserEntity(
      data.user.id,
      data.user.login
    );
    yield* this.userRepository.save(user);

    const number = +data.pull_request_url.match(/pulls\/([0-9]+)$/)[1];
    const pullsComment = new PullsCommentEntity(
      data.id,
      pull.repository_id,
      number,
      data.user.id,
      data.path,
      data.position,
      data.original_position,
      data,
      data.created_at,
      data.updated_at
    );
    yield* this.pullsCommentsRepository.save(pullsComment);
  }
};
