'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _awsSdkMock = require('aws-sdk-mock');

var awsSDKMock = _interopRequireWildcard(_awsSdkMock);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this will pre-empt aws methods in code

// takes in the name of the actual aws service we are using, which is S3
// params is equal to whatever options you passed into the original method
// in this case, params is equal to the uploadOptions in s2Upload.
awsSDKMock.mock('S3', 'upload', function (params, callback) {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('SETUP AWS MOCK ERROR: key, bucket, body, or ACL required'));
  }

  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AWS MOCK ERROR: ACL should be public-read'));
  }

  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS MOCK ERROR: wrong bucket'));
  }

  return callback(null, { Location: _faker2.default.internet.url() });
});

awsSDKMock.mock('S3', 'deleteObject', function (params, callback) {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AWS MOCK ERROR: key and bukcet required'));
  }

  return callback(null, 'successful deletion');
});