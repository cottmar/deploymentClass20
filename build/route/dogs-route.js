'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // interview keywords : de-structuring and module


var _bodyParser = require('body-parser');

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _dogs = require('../model/dogs');

var _dogs2 = _interopRequireDefault(_dogs);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var dogsRouter = new _express.Router();

dogsRouter.post('/dogss', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }

  return new _dogs2.default(_extends({}, request.body, {
    account: request.account._id
  })).save().then(function (dogs) {
    _logger2.default.log(_logger2.default.INFO, 'Returing a 200 and a new Dogs');
    return response.json(dogs);
  }).catch(next);
});

dogsRouter.get('/api/dogss:id', function (request, response, next) {
  return _dogs2.default.findById(request.params.id).then(function (dogs) {
    if (!dogs) {
      _logger2.default.log(_logger2.default.ERROR, 'DOGS ROUTER: responding with a 404 status code for !dogs');
      return next(new _httpErrors2.default(404, 'dogs not found'));
    }
    _logger2.default.log(_logger2.default.INFO, 'DOGS ROUTER: responding with a 200 status code');
    _logger2.default.log(_logger2.default.INFO, 'DOGS ROUTER: ' + JSON.stringify(dogs));
    return response.json(dogs);
  }).catch(next);
});

exports.default = dogsRouter;