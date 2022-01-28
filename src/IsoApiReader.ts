import qs from 'qs';
import {
  Headers as nHeaders,
  BodyInit as nBodyInit,
  RequestInit as nRequestInit
} from 'node-fetch';

type IsoHeadersClass = typeof Headers | typeof nHeaders;
type IsoHeaders = Headers | nHeaders;
type IsoBody = BodyInit | nBodyInit | null;
type IsoRequestInit = RequestInit | nRequestInit;

type IsoFetch = (url: RequestInfo, init?: IsoRequestInit) => Promise<Response>;

type SimpleRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: IsoBody;
};

type SimpleResponse = {
  url: string;
  status: number;
  ok: boolean;
  redirected: boolean;
  type: string;
  headers: object;
  body: unknown;
};

type Auth = {
  username?: string;
  password?: string;
};

type PreRequestHandler = (options: IsoRequestInit) => IsoRequestInit;
type HttpErrorHandler = (req: SimpleRequest, res: SimpleResponse) => void;

export type ApiReaderOptions = {
  json?: boolean;
  auth?: Auth;
  headers?: Record<string, string>;
  queryOptions?: Record<string, string>;
  preRequestHandler?: PreRequestHandler;
  httpErrorHandler?: HttpErrorHandler;
};

type Bota = (stringToEncode: string) => string;

type ApiReaderSpecialOptions = {
  fetch: IsoFetch;
  Headers: IsoHeadersClass;
  btoa: Bota;
};

type ReqOptions = {
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: (BodyInit & nBodyInit) | null;
  auth?: Auth;
  json?: boolean;
};

type DefniedReqOptions = Omit<ReqOptions, 'method'>;

export class IsoApiReader {
  baseUrl: string;
  auth?: Auth;
  json: boolean;
  baseHeaders: IsoHeaders;
  queryOptions: Record<string, unknown>;
  preRequestHandler?: PreRequestHandler;
  httpErrorHandler?: HttpErrorHandler;
  // Special options
  fetch: IsoFetch;
  Headers: IsoHeadersClass;
  btoa: Bota;

  constructor(
    { fetch, Headers, btoa }: ApiReaderSpecialOptions,
    baseUrl: string,
    {
      auth,
      json = true,
      headers = {},
      queryOptions = {},
      preRequestHandler,
      httpErrorHandler
    }: ApiReaderOptions = {}
  ) {
    if (!baseUrl) {
      throw new Error('ApiReader constructor baseUrl is required');
    }

    this.fetch = fetch;
    this.Headers = Headers;
    this.btoa = btoa;

    this.baseUrl = baseUrl;

    this.auth = auth;
    this.json = json;
    this.baseHeaders = new this.Headers(headers);
    this.queryOptions = queryOptions;
    this.preRequestHandler = preRequestHandler;
    this.httpErrorHandler = httpErrorHandler;
  }

  static headersToObject(headers: IsoHeaders): Record<string, string> {
    const headersObject: Record<string, string> = {};

    headers.forEach((name, value) => {
      headersObject[name] = value;
    });

    return headersObject;
  }

  mergeHeaders(baseHeaders: IsoHeaders, newHeaders: IsoHeaders): IsoHeaders {
    const finalHeaders = new this.Headers(baseHeaders as nHeaders);

    newHeaders.forEach((name, value) => {
      finalHeaders.set(name, value);
    });

    return finalHeaders;
  }

  async req(
    path = '',
    { method = 'GET', headers = {}, query, body, auth, json }: ReqOptions = {}
  ) {
    const url = new URL(this.baseUrl);
    // Using directly this.[fetch|btoa] cause an "Illegal invocation" error in Browser
    const fetch = this.fetch;
    const btoa = this.btoa;

    url.pathname = `${url.pathname}/${path}`.replace(/\/+/, '/');
    const reqHeaders = new this.Headers(headers);

    let fetchOptions: IsoRequestInit = {
      method: method.toUpperCase(),
      headers: this.mergeHeaders(this.baseHeaders, reqHeaders)
    };

    const finalAuth = auth !== undefined ? auth : this.auth;

    if (finalAuth) {
      const { username, password } = finalAuth;

      (fetchOptions.headers as IsoHeaders).set(
        'Authorization',
        `Basic ${btoa(`${username || ''}:${password || ''}`)}`
      );
    }

    if (query) {
      url.search = qs.stringify(query, this.queryOptions);
    }

    if (this.preRequestHandler) {
      fetchOptions = this.preRequestHandler({ ...fetchOptions, body });
    }

    if (body !== undefined) {
      const finalJson = json !== undefined ? json : this.json;

      if (finalJson) {
        (fetchOptions.headers as IsoHeaders).set(
          'Content-Type',
          'application/json'
        );
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    const fetchRes = await fetch(url.toString(), fetchOptions);
    const contentType = (fetchRes.headers.get('Content-Type') || '')
      .split(';', 1)[0]
      .toLocaleLowerCase()
      .trim();

    let resBody;
    if (contentType === 'application/json') {
      resBody = await fetchRes.json();
    } else {
      resBody = await fetchRes.text();
    }

    if (!fetchRes.ok) {
      const res = {
        url: fetchRes.url,
        status: fetchRes.status,
        ok: fetchRes.ok,
        redirected: fetchRes.redirected,
        type: fetchRes.type,
        headers: IsoApiReader.headersToObject(fetchRes.headers),
        body: resBody
      };

      if (!this.httpErrorHandler) {
        const error = new Error(
          `Http Error ${res.status} for ${
            fetchOptions.method
          } ${url.toString()}`
        );

        throw error;
      }

      const req = {
        url: url.toString(),
        method: fetchOptions.method as string,
        headers: IsoApiReader.headersToObject(
          fetchOptions.headers as IsoHeaders
        ),
        body: fetchOptions.body as IsoBody
      };

      return this.httpErrorHandler(req, res);
    }

    return resBody;
  }

  async head(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'HEAD' });
  }

  async get(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'GET' });
  }

  async post(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'POST' });
  }

  async put(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'PUT' });
  }

  async patch(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'PATCH' });
  }

  async delete(path: string, options: DefniedReqOptions) {
    return this.req(path, { ...options, method: 'DELETE' });
  }
}
