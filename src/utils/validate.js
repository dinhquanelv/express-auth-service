const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const { APIError } = require('../error');

const isString = (value, fieldName) => {
  if (typeof value !== 'string') {
    throw new APIError(`${fieldName} must be string type!`, 400);
  }
};

const isNumber = (value, fieldName) => {
  if (typeof value !== 'number') {
    throw new APIError(`${fieldName} must be number type!`, 400);
  }
};

const isBoolean = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    throw new APIError(`${fieldName} must be boolean type!`, 400);
  }
};

const isArray = (value, fieldName) => {
  if (!Array.isArray(value)) {
    throw new APIError(`${fieldName} must be array type!`, 400);
  }
};

const isObject = (value, fieldName) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new APIError(`${fieldName} must be object type!`, 400);
  }
};

const isObjectId = (value, fieldName) => {
  if (!ObjectId.isValid(value)) {
    throw new APIError(`${fieldName} must be ObjectId type!`, 400);
  }
};

const isNotEmpty = (value, fieldName) => {
  if (value === undefined || value === null || value === '' || value.length === 0) {
    throw new APIError(`${fieldName} must not be empty!`, 400);
  }
};

module.exports = {
  isString,
  isNumber,
  isArray,
  isBoolean,
  isObject,
  isObjectId,
  isNotEmpty,
};
