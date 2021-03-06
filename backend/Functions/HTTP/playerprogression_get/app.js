/*
  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// SPDX-License-Identifier: MIT-0
// Function: playerprogression_get:app.js

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

const AWS = require('aws-sdk');

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update = ({ region: process.env.REGION });

const ddb = new AWS.DynamoDB.DocumentClient();

const playerWalletTable = process.env.PLAYER_PROGRESS_TABLE_NAME;

async function getPlayerProgress(event) {
  const { playerId } = event.pathParameters;
  let result;
  let msg;
  try {
    result = await ddb.get({
      TableName: playerWalletTable,
      Key: { playerName: playerId },
    }).promise();
    if (Object.prototype.hasOwnProperty.call(result, 'Item')) {
      msg = result.Item;
    } else {
      msg = {
        playerName: playerId, experience: 0, wins: 0, level: 0,
      };
    }
  } catch (e) {
    console.error(`Error getting player wallet ${e.stack}`);
    return { statuCode: 500, body: 'error occurred retrieving player progress' };
  }
  return { statusCode: 200, body: JSON.stringify(msg) };
}

exports.handler = async (event) => {
  const retVal = await getPlayerProgress(event);
  return retVal;
};
