/* global fetch, Headers, btoa */
import { IsoApiReader, ApiReaderOptions } from './IsoApiReader';

module.exports.ApiReader = class ApiReader extends IsoApiReader {
  constructor(baseUrl: string, options: ApiReaderOptions) {
    super(
      {
        fetch,
        Headers,
        btoa
      },
      baseUrl,
      options
    );
  }
};
