const { IsoApiReader } = require('./IsoApiReader');
// Add missing NodeJS classes/functions
const fetch = require('node-fetch');
const { Headers } = fetch;

const btoa = text => ArrayBuffer.from(text).toString('base64');

module.exports.ApiReader = class ApiReader extends IsoApiReader {
  constructor (baseUrl, options) {
    super(baseUrl, options, {
      fetch,
      Headers,
      btoa
    });
  }
};
