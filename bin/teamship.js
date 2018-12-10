#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const _ = require('underscore');
const is = require('is_js');
const Promise = require('bluebird');
const Table = require('cli-table');
const co = Promise.coroutine;
const IssuesModel = require('../lib/models/IssuesModel');
const CommentsModel = require('../lib/models/CommentsModel');
const PullsModel = require('../lib/models/PullsModel');
const REGX_DATETIME = /^([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2})$/;

// 入力値バリデーション
program
  .option('-s, --start [value]', '[required] start datetime.  ex) node ./bin/teamship.js -s "2016-01-01 00:00:00"')
  .option('-e, --end [value]', '[required] end datetime. ex) node ./bin/teamship.js -e "2017-01-01 23:59:59"')
  .option('-f, --filter [user1,user2,user3]', '[optional] filter by github user name. ex) node ./bin/teamship.js -u john,mary,smith')
  .parse(process.argv);


if (!(!is.string(program.start) || program.start.match(REGX_DATETIME))
  || (!is.string(program.end) || !program.end.match(REGX_DATETIME))) {
  console.log('[ERROR] - datetime format is invalid.');
  return program.outputHelp((text) => {
    return colors.red(text);
  });
}

/**
 * @params data
 * @example
 * <pre>
 * // input
 * writeTable({
 * 	"john-smith": {
 * 		"issue": 1,
 * 		"comment": 211,
 * 		"pr": 23
 * 	},
 * 	"marie": {
 * 		"issue": 40,
 * 		"comment": 9,
 * 		"pr": 255
 * 	},
 * 	"smith": {
 * 		"issue": 0,
 * 		"comment": 0,
 * 		"pr": 1
 * 	},
 * 	"total": {
 * 		"issue": 41,
 * 		"comment": 220,
 * 		"pr": 279
 * 	}
 * })
 *
 * // output
 * ┌─────────────────┬────┬───────┬─────────┐
 * │                 │ pr │ issue │ comment │
 * ├─────────────────┼────┼───────┼─────────┤
 * │ john            │ 1  │ 211   │ 23      │
 * ├─────────────────┼────┼───────┼─────────┤
 * │ marie           │ 40 │ 9     │ 255     │
 * ├─────────────────┼────┼───────┼─────────┤
 * │ smith           │ 0  │ 0     │ 1       │
 * ├─────────────────┼────┼───────┼─────────┤
 * │ total           │ 41 │ 220   │ 279     │
 * └─────────────────┴────┴───────┴─────────┘
 * <pre>
 */
function writeTable(data, filter = []) {
  if (typeof filter === 'string') {
    filter = filter.split(',');
  }

  const table = new Table({ head: ['', 'pr', 'issue', 'comment'] });
  const total = {
    pr: 0,
    issue: 0,
    comment: 0
  };

  Object.keys(data).forEach((user) => {
    if (user === 'total') return;
    if (!filter.includes(user)) return;

    total.pr += data[user].pr || 0;
    total.issue += data[user].issue || 0;
    total.comment += data[user].comment || 0;

    table.push(
      [
        user,
        data[user].pr || 0,
        data[user].issue || 0,
        data[user].comment || 0
      ]
    )
  });

  table.push(
    [
      'total',
      total.pr || 0,
      total.issue || 0,
      total.comment || 0
    ]
  )

  console.log(table.toString());
}

function *main(option) {

  const result = {};

  const issuesModel = new IssuesModel();
  const issues = yield* issuesModel.calculate(option);
  _.mapObject(issues, (value, key) => {
    result[key] = result[key] || {};
    result[key] = Object.assign(result[key], {
      issue: value
    });
  });

  const commentsModel = new CommentsModel();
  const comments = yield* commentsModel.calculate(option);
  _.mapObject(comments, (value, key) => {
    result[key] = result[key] || {};
    result[key] = Object.assign(result[key], {
      comment: value
    });
  });

  const pullsModel = new PullsModel();
  const pulls = yield* pullsModel.calculate(option);
  _.mapObject(pulls, (value, key) => {
    result[key] = result[key] || {};
    result[key] = Object.assign(result[key], {
      pr: value
    });
  });

  writeTable(result, option.filter);
}

if (require.main === module) return co(main)(program);
module.exports = main;
