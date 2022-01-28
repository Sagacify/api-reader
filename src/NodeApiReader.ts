import { IsoApiReader, ApiReaderOptions } from './IsoApiReader';
// Add missing NodeJS classes/functions
import nFetch, { Headers as nHeaders } from 'node-fetch';

const nBtoa = (text: string) => Buffer.from(text).toString('base64');

export class ApiReader extends IsoApiReader {
  constructor(baseUrl: string, options: ApiReaderOptions) {
    super(
      {
        fetch: nFetch,
        Headers: nHeaders,
        btoa: nBtoa
      },
      baseUrl,
      options
    );
  }
}
