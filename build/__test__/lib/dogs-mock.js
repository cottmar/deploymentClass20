'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveDogsMock = exports.pCreateDogsMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _dogs = require('../../model/dogs');

var _dogs2 = _interopRequireDefault(_dogs);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateDogsMock = function pCreateDogsMock() {
  var resultMock = {};

  return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;

    return new _dogs2.default({
      bio: _faker2.default.lorem.words(10),
      avatar: _faker2.default.random.image(),
      lastName: _faker2.default.name.lastName(),
      firstName: _faker2.default.name.firstName(),
      account: accountSetMock.account._id // this line sets up the relationship
    }).save();
  }).then(function (dogs) {
    resultMock.dogs = dogs;
    return resultMock;
  });
};

var pRemoveDogsMock = function pRemoveDogsMock() {
  return Promise.all([_dogs2.default.remove({}), (0, _accountMock.pRemoveAccountMock)()]);
};

exports.pCreateDogsMock = pCreateDogsMock;
exports.pRemoveDogsMock = pRemoveDogsMock;