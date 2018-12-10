'use strict';

const GitHubApi = require('@octokit/rest');
const config = require('config');

/**
 * @description
 */
module.exports = class Github {

  /**
   * @description
   */
  constructor() {
    this.github = new GitHubApi({
      // debug: true,
      protocol: "https",
      host: "git.dmm.com",
      pathPrefix: "/api/v3",
      headers: {
        "user-agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)"
      },
    });
  }

  /**
   * @description
   */
  authenticate() {
    this.github.authenticate({
        type: 'token',
        token: config.github.accessToken,
    });
  }

  /**
   * @description
   */
  getRepositories(options = {}) {
    return this.github.repos.getAll({
      type: options.type || 'all',
      page: options.page || 1,
      per_page: options.per_page || 100
    });
  }

  /**
   * @description
   */
  getPullRequests(options = {}) {
    return this.github.pullRequests.getAll({
      owner: options.owner,
      repo: options.repo,
      state: 'all',
      sort: 'created',
      direction: 'asc',
      page: options.page || 1,
      per_page: options.per_page || 100
    });
  }

  /**
   * @description
   */
  getReviews(options = {}) {
    if (!options.owner) return Promise.reject(new Error('options.owner argument is requires.'));
    if (!options.repo) return Promise.reject(new Error('options.repo argument is requires.'));
    if (!options.number) return Promise.reject(new Error('options.number argument is requires.'));
    return this.github.pullRequests.getReviews({
      owner: options.owner,
      repo: options.repo,
      number: options.number,
      page: options.page || 1,
      per_page: options.per_page || 100
    });
  }

  /**
   * @description
   */
  getPullRequestsComments(options = {}) {
    if (!options.owner) return Promise.reject(new Error('options.owner argument is requires.'));
    if (!options.repo) return Promise.reject(new Error('options.repo argument is requires.'));
    if (!options.number) return Promise.reject(new Error('options.number argument is requires.'));
    return this.github.pullRequests.getComments({
      owner: options.owner,
      repo: options.repo,
      number: options.number,
      page: options.page || 1,
      per_page: options.per_page || 100
    });
  }

  /**
   * @description
   */
  getIssuesComments(options = {}) {
    if (!options.owner) return Promise.reject(new Error('options.owner argument is requires.'));
    if (!options.repo) return Promise.reject(new Error('options.repo argument is requires.'));
    if (!options.number) return Promise.reject(new Error('options.number argument is requires.'));
    return this.github.issues.getComments({
      page: options.page || 1,
      per_page: options.per_page || 100,
      owner: options.owner,
      repo: options.repo,
      number: options.number
    });
  }

  /**
   * @description
   */
  getIssuesForRepo(options = {}) {
    if (!options.owner) return  Promise.reject(new Error('options.owner argument is requires.'));
    if (!options.repo) return  Promise.reject(new Error('options.repo argument is requires.'));
    return this.github.issues.getForRepo({
      owner: options.owner,
      repo: options.repo,
      state: 'all',
      sort: 'created',
      direction: 'asc',
      since: options.since || '1970-01-01T00:00:00Z',
      page: options.page || 1,
      per_page: options.per_page || 100
    });
  }
};
