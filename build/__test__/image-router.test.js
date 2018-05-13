'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set this to true or false depending on if you want to hit the mock AWS-SDK
//  or if you want to hit the real AWS-SDK, i.e., upload an asset to your real bucket

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /images', function () {
  beforeAll(_server.startServer);
  afterEach(_imageMock.pRemoveImageMock);
  afterAll(_server.stopServer);

  // describe('POST 200 for successful post /images', () => {
  //   test('should return 200 for sucessful image post', () => {
  //     jest.setTimeout(20000);
  //     return pCreateImageMock()
  //       .then((mockResponse) => {
  //         const { token } = mockResponse.accountMock;
  //         return superagent.post(`${apiUrl}/images`)
  //           .set('Authorization', `Bearer ${token}`)
  //           .field('title', 'bird')
  //           .attach('image', `${__dirname}/asset/dog.jpg`)
  //           .then((response) => {
  //             expect(response.status).toEqual(200);
  //             expect(response.body.title).toEqual('bird');
  //             expect(response.body._id).toBeTruthy();
  //             expect(response.body.url).toBeTruthy();
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err.message, 'ERR IN TEST');
  //         console.log(err.status, 'CODE ERR IN TEST');
  //         expect(err.status).toEqual(200);
  //       });
  //   });
  // });

  describe('GET /api/images/:id', function () {
    test('GET /api/images/:id should get a 200 status code and a TOKEN', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mock) {
        return _superagent2.default.get(apiUrl + '/images/:id').auth(mock.request.username, mock.request.password); // this line is important
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      }).catch(function (error) {
        console.log(error);
      });
    });
    test('GET /api/images/:id should return a 404 status code for a bad route', function () {
      return _superagent2.default.get(apiUrl + '/imagesss/:wrongid').send({
        title: 'title'
      }).then(Promise.reject).catch(function (response) {
        expect(response.status).toEqual(404);
      });
    });
    test('GET /api/images/:id should return a 401 status code for a bad token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mock) {
        return _superagent2.default.get(apiUrl + '/images/:id').auth(mock.request.username, mock.request.password); // this line is important
      }).then(function (response) {
        expect(response.status).toEqual(401);
        expect(response.body.title).toBeFalsy();
      }).catch(function (error) {
        console.log(error);
      });
    });
  });

  // describe('DELETE /api/images', () => {
  //   test('should return status code 204', () => {
  //     return pCreateImageMock()
  //       .then((imageMock) => {
  //         console.log('WHAT IS IT', imageMock);
  //         return superagent.delete(`${apiUrl}/images/${imageMock.image._id}`)
  //           .set('Authorization', `Bearer ${imageMock.accountMock.token}`);
  //       })
  //       .then((response) => {
  //         expect(response.status).toEqual(204);
  //       });
  //   });
  // });
  describe('DELETE /api/images_id', function () {
    test('404 if no image found', function () {
      return _superagent2.default.delete(apiUrl + '/invalidId').then(Promise.reject).catch(function (response) {
        expect(response.status).toEqual(404);
      });
    });
  });
});