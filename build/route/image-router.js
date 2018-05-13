'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _s = require('../lib/s3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//eslint-disable-line

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var imageRouter = new _express.Router();

imageRouter.post('/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'IMAGE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new _httpErrors2.default(400, 'IMAGE ROUTER __ERROR__ invalid request'));
  }
  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;
  return (0, _s.s3Upload)(file.path, key).then(function (url) {
    return new _image2.default({
      title: request.body.title,
      account: request.account._id,
      url: url
    }).save();
  }).then(function (image) {
    return response.json(image);
  }).catch(next);
});

imageRouter.get('/api/images:id', function (request, response, next) {
  return _image2.default.findById(request.params.id).then(function (image) {
    if (!image) {
      _logger2.default.log(_logger2.default.ERROR, 'IMAGE ROUTER: responding with a 404 status code for !image');
      return next(new _httpErrors2.default(404, 'image not found'));
    }
    _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER: responding with a 200 status code');
    _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER: ' + JSON.stringify(image));
    return response.json(image);
  }).catch(next);
});
// console.log('before delete');
// imageRouter.delete('/api/images/:id', bearerAuthMiddleWare, (request, response, next) => {
//   return Image.findByIdAndRemove(request.params.id)
//     .then((image) => {
//       console.log('inside delete .thn');
//       if (!image) {
//         logger.log(logger.ERROR, 'IMAGE ROUTER: responding with 404 !image');
//         return next(new HttpError(404, 'image not found'));
//       }
//       logger.log(logger.INFO, 'IMAGE ROUTER: responding with 204 status code');
//       return response.sendStatus(204);
//     });
// });

exports.default = imageRouter;