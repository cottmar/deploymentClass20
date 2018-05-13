'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _dogsMock = require('./lib/dogs-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /dogss', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_dogsMock.pRemoveDogsMock);

  test('POST /dogss should get a 200 and the newly created dogs', function () {
    // eslint-disable-line
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/dogss').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        bio: 'Three-legged Bird-Dog',
        firstName: 'Birdie',
        lastName: 'Blue'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.firstName).toEqual('Birdie');
      expect(response.body.lastName).toEqual('Blue');
      expect(response.body.bio).toEqual('Three-legged Bird-Dog');
    });
  });
  test('POST /dogss should return a 400 status code for a bad route', function () {
    return _superagent2.default.post(apiURL + '/dogss').send({
      email: 'billie@billie.com'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });
  test('POST /api/dogss/:id should return a 404 status code for route not found', function () {
    return _superagent2.default.post(apiURL + '/missing').send({
      email: 'billie@billie.com'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(404);
    });
  });

  describe('GET /api/dogss/:id', function () {
    test('GET /api/doggs/:id should get a 200 status code and a TOKEN', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/dogss/:id').auth(mock.request.username, mock.request.password); // this line is important
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      }).catch(function (error) {
        console.log(error);
      });
    });
  });
  // test('GET /api/dogss/:id should return a 400 status code for a bad route', function () {
  //   return _superagent2.default.get(apiURL + '/dogsss/:wrongid').send({
  //     email: 'billie@billie.com'
  //   }).then(Promise.reject).catch(function (response) {
  //     expect(response.status).toEqual(400);
  //   });
  // });
  test('GET /api/dogss/:id should return a 404 status code for route not found', function () {
    return _superagent2.default.get(apiURL + '/').send({
      email: 'billie@billie.com'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(404);
    });
  });
});