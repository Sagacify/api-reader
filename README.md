# ApiReader

[![CircleCI](https://circleci.com/gh/Sagacify/api-reader.svg?style=svg)](https://circleci.com/gh/Sagacify/api-reader)
[![Coverage Status](https://coveralls.io/repos/github/Sagacify/api-reader/badge.svg?branch=main)](https://coveralls.io/github/Sagacify/api-reader?branch=main)
[![npm version](https://img.shields.io/npm/v/@sagacify/api-reader.svg)](https://www.npmjs.com/package/@sagacify/api-reader)

## Description

ApiReader is a NodeJS & Browser package meant to simplify your requests to any Api.
Browser version is based on native fetch to be as tiny as possible if you use treechecking in your toolbelt (like webpack, create-react-app, ...).
It features:

  - API base url recording at constuction for smaller calls
  - automatic request body JSON stringifying based body type (objects are stringified)
  - automatic response body JSON parsing based on the Content-Type of the Api response
  - custom http error handling hook

## Acknowledgment

Most of the code structure and part of the code is inspired from the great [bent package](https://github.com/mikeal/bent/).
If you don't know it, check it out !

## Installation

```sh
$ npm install @sagacify/api-reader
```

## Usage

### In your project (Browser or NodeJS)

```js
const { ApiReader } = require('ApiReader');
// OR
import { ApiReader } from 'ApiReader';

const main = () => {
  const bearerToken = 'super-secret-token';
  const { apiReader } = new ApiReader('https://api.twitter.com/2/', {
    headers: {
      authorization: `Bearer ${bearerToken}`
    },
    httpErrorHandler: response => {
      console.error(`My custom error ${response.status}`)
    }
  });

  try {
    const result = await apiReader.get('/2/tweets', {
      query: {
        id: 'some-tweet-id'
      },
    });

    console.log(result);
  } catch (err) {
    // This is an unexpected error, like an network issue
    console.error(err);
  }
}

main();
```

*Note: based on the context either the Browser or the NodeJS version will be used*

### API

**constructor(baseUrl, options)**

- baseUrl: the base url of the api (e.g.: https://api.twitter.com/2/)
- options:
  - auth:
    - username: the username of the Basic Authentication
    - password: the password of the Basic Authentication
  - headers:
    - [header-name]: header value
  - httpErrorHandler: an http error handler function which recieve the response object
    The reponse object is a simplified plain version of [Response](https://developer.mozilla.org/fr/docs/Web/API/Response):

    ```js
    {
      url: <string>,
      status: <number>,
      ok: <boolean>,
      redirected: <boolean>,
      type: <string>,
      headers: <object>
    }
    ```
    By default any error will generate a basic error with the `code` field set to "HTTP_${response.status}"


**head(path, options)**

Performs an HEAD request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

**get(path, options)**

Performs an GET request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

**post(path, options)**

Performs an POST request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

**put(path, options)**

Performs an PUT request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

**patch(path, options)**

Performs an PATCH request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

**delete(path, options)**

Performs an DELETE request to the api

*Parameters*

- path: the path from the baseUrl
- options:
  - headers:
    - [header-name]: header value
    - body: body value, object will be automatically JSON stringified
    - query: query object

*Response*

Returns the response body automatically parsed according the response's Content-Type

### Running all tests

```sh
$ npm test:all
```

*Note: that's the one you want to use most of the time*

### To do

  - [ ] improve automatique response parsing, for now buffer are not managed
  - [ ] add browser unit tests

## Reporting bugs and contributing

If you want to report a bug or request a feature, please open an issue.
If want to help us improve api-reader, fork and make a pull request.
Please use commit format as described [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
And don't forget to run `npm run format` before pushing commit.

## Repository

- [https://github.com/sagacify/api-reader](https://github.com/sagacify/api-reader)

## License

The MIT License (MIT)

Copyright (c) 2020 Sagacify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
