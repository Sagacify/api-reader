const qs = require('qs');

module.exports.IsoApiReader = class IsoApiReader {
  constructor (
    baseUrl, {
      auth,
      headers = {},
      queryOptions = {},
      httpErrorHandler
    } = {},
    {
      fetch,
      Headers,
      btoa
    }
  ) {
    if (!baseUrl) {
      throw new Error('ApiReader constructor baseUrl is required');
    }

    this.baseUrl = baseUrl;

    this.auth = auth;
    this.baseHeaders = headers;
    this.queryOptions = queryOptions;
    this.httpErrorHandler = httpErrorHandler;

    this.fetch = fetch;
    this.Headers = Headers;
    this.btoa = btoa;
  }

  static headersToObject (headers) {
    const headersObject = {};
    for (const [key, value] of headers.entries()) {
      headersObject[key] = value;
    }

    return headersObject;
  }

  async req (path = '', {
    method = 'GET',
    headers = {},
    query = null,
    body = null
  } = {}) {
    const url = new URL(this.baseUrl);
    // Using directly this.[fetch|btoa] cause an "Illegal invocation" error in Browser
    const fetch = this.fetch;
    const btoa = this.btoa;

    url.pathname = `${url.pathname}/${path}`.replace(/\/+/, '/');

    const fetchOptions = {
      method: method.toUpperCase(),
      headers: new this.Headers({
        ...this.baseHeaders,
        ...headers
      })
    };

    if (this.auth && !fetchOptions.headers.has('Authorization')) {
      const { username, password } = this.auth;

      fetchOptions.headers.set(
        'Authorization',
        'Basic ' + btoa(`${username}:${password}`)
      );
    }

    if (query) {
      url.search = qs.stringify(query, this.queryOptions);
    }

    if (body) {
      if (
        typeof body === 'object' &&
        !(body instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(body)
      ) {
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers.set('Content-Type', 'application/json');
      } else {
        fetchOptions.body = body;
      }
    }

    const fetchRes = await fetch(url, fetchOptions);
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
        const error = new Error(`Http Error ${res.status} for ${fetchOptions.method} ${url.toString()}`);
        error.code = `HTTP_${res.status}`;

        throw error;
      }

      const req = {
        url: url.toString(),
        method: fetchOptions.method,
        headers: IsoApiReader.headersToObject(fetchOptions.headers),
        body: fetchOptions.body
      };

      return this.httpErrorHandler(req, res);
    }

    return resBody;
  }

  async head (path, options) {
    return this.req(path, { ...options, method: 'HEAD' });
  }

  async get (path, options) {
    return this.req(path, { ...options, method: 'GET' });
  }

  async post (path, options) {
    return this.req(path, { ...options, method: 'POST' });
  }

  async put (path, options) {
    return this.req(path, { ...options, method: 'PUT' });
  }

  async patch (path, options) {
    return this.req(path, { ...options, method: 'PATCH' });
  }

  async delete (path, options) {
    return this.req(path, { ...options, method: 'DELETE' });
  }
};
