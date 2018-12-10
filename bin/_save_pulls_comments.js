'use strict';

/*
  Githubレビューをデータベースに保存するバッチプログラム
*/

const Promise = require('bluebird');
const co = require('co');
const GetPullsCommentsExecutor = require('../lib/executor/GetPullsCommentsExecutor');

/**
 * @description メイン処理
 */
function main() {
  return new Promise((resolve, reject) => {

    const executor = new GetPullsCommentsExecutor();

    executor.on('error', (error) => {
      console.error(error);
    });

    executor.on('end', () => {
      console.log('done with execute to get comments.');
      executor.removeAllListeners();
      resolve();
    });

    console.log('start getting comments.');
    return co(executor.execute);
  });
}

if (require.main === module) return main();
module.exports = main;
