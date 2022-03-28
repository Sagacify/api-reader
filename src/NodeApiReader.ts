// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IsoApiReader, ApiReaderOptions, IsoFetch } from './IsoApiReader.ts';
// Add missing NodeJS classes/functions

import {
  Headers as nHeaders,
  RequestInfo,
  RequestInit,
  Response
} from 'node-fetch';
const nFetch = (url: RequestInfo, init?: RequestInit): Promise<Response> =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const nBtoa = (text: string) => Buffer.from(text).toString('base64');

export class ApiReader extends IsoApiReader {
  constructor(baseUrl: string, options: ApiReaderOptions = {}) {
    super(
      {
        fetch: nFetch as unknown as IsoFetch,
        Headers: nHeaders,
        btoa: nBtoa
      },
      baseUrl,
      options
    );
  }
}
