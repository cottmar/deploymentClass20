
'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'billie',
      email: 'billie@billie.com',
      password: 'billieisthebest'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });
  test('POST should return a 400 status code for a bad route', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      email: 'billie@billie.com'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });
  test('POST should return a 409 status code, no duplicates', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'billie',
      email: 'billie@billie.com',
      password: 'nobirdieisthebest'
    }).then(function () {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: 'billie',
        email: 'billie@billie.com',
        password: 'nobirdieisthebest'
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(409);
      });
    });
  });
  describe('GET /login', function () {
    test('GET /login should get a 200 status code and a TOKEN', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password); // this line is important
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      }).catch(function (error) {
        console.log(error);
      });
    });
  });
});