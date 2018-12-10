#!/usr/bin/env node
'use strict';

const Promise = require('bluebird');
const co = Promise.coroutine;
const saveRepositories = require('./_save_repositories');
const savePullsComments = require('./_save_pulls_comments');
const saveIssues = require('./_save_issues');
const saveIssuesComments = require('./_save_issues_comments');
const savePulls = require('./_save_pulls');


function *main() {

  yield saveRepositories();
  yield savePulls();
  yield saveIssues();
  yield saveIssuesComments();
  yield savePullsComments();

}

if (require.main === module) return co(main)();
module.exports = main;
