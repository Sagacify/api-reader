/* global fetch, Headers, btoa */

const { IsoApiReader } = require('./IsoApiReader');

module.exports.ApiReader = class ApiReader extends IsoApiReader {
  constructor (baseUrl, options) {
    super(baseUrl, options, {
      fetch,
      Headers,
      btoa
    });
  }
};
