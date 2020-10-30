const expect = require('chai').expect;
const nock = require('nock');
const { ApiReader } = require('../../src/NodeApiReader');

describe('ApiReader', () => {
  describe('constructor', () => {
    it('should error when no base url provided', async () => {
      const create = () => new ApiReader();

      expect(create).to.throw();
    });

    it('should create an api reader instance', async () => {
      const create = () => new ApiReader('http://localhost:8080');

      expect(create).to.not.throw();
    });
  });

  describe('get', () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it('should generate an error on http status greather than 299', async () => {
      nock('http://fake-api')
        .get('/profile')
        .reply(500);

      const apiReader = new ApiReader('http://fake-api');
      let error;

      try {
        await apiReader.get('/profile');
      } catch (err) {
        error = err;
      }

      expect(error.code).to.equal('HTTP_500');
    });

    it('should call httpErrorHandler on http status greather than 299', async () => {
      nock('http://fake-api')
        .get('/profile')
        .reply(500);

      let customErrorStatus;

      const apiReader = new ApiReader('http://fake-api', {
        httpErrorHandler: res => {
          customErrorStatus = res.status;
        }
      });

      await apiReader.get('/profile');

      expect(customErrorStatus).to.equal(500);
    });

    it('should send a get request and json parse the response', async () => {
      nock('http://fake-api')
        .get('/profile')
        .reply(200, { firstname: 'Olivier', company: 'Sagacify' });

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.get('/profile');

      expect(result).to.deep.equal({
        firstname: 'Olivier',
        company: 'Sagacify'
      });
    });

    it('should send a get request and leave text the response', async () => {
      nock('http://fake-api')
        .get('/message/1')
        .reply(200, 'Some message');

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.get('/message/1');

      expect(result).to.deep.equal('Some message');
    });
  });

  describe('head', () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it('should generate an error on http status greather than 299', async () => {
      nock('http://fake-api')
        .head('/profile')
        .reply(500);

      const apiReader = new ApiReader('http://fake-api');
      let error;

      try {
        await apiReader.head('/profile');
      } catch (err) {
        error = err;
      }

      expect(error.code).to.equal('HTTP_500');
    });

    it('should send an head request on the api', async () => {
      nock('http://fake-api')
        .head('/profile')
        .reply(200, { firstname: 'Olivier', company: 'Sagacify' });

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.head('/profile');

      expect(result).to.deep.equal({
        firstname: 'Olivier',
        company: 'Sagacify'
      });
    });
  });

  describe('post', () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it('should generate an error on http status greather than 299', async () => {
      nock('http://fake-api')
        .post('/profile')
        .reply(500);

      const apiReader = new ApiReader('http://fake-api');
      let error;

      try {
        await apiReader.post('/profile');
      } catch (err) {
        error = err;
      }

      expect(error.code).to.equal('HTTP_500');
    });

    it('should send a post request and json parse the response', async () => {
      nock('http://fake-api', { firstname: 'Olivier', company: 'Sagacify' })
        .post('/profile')
        .reply(201, { id: 1, firstname: 'Olivier', company: 'Sagacify' });

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.post('/profile');

      expect(result).to.deep.equal({
        id: 1,
        firstname: 'Olivier',
        company: 'Sagacify'
      });
    });
  });

  describe('put', () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it('should generate an error on http status greather than 299', async () => {
      nock('http://fake-api')
        .put('/profile')
        .reply(500);

      const apiReader = new ApiReader('http://fake-api');
      let error;

      try {
        await apiReader.put('/profile');
      } catch (err) {
        error = err;
      }

      expect(error.code).to.equal('HTTP_500');
    });

    it('should send a put request and json parse the response', async () => {
      nock('http://fake-api', { id: 1, firstname: 'José', company: 'Sagacify' })
        .put('/profile')
        .reply(200, { id: 1, firstname: 'José', company: 'Sagacify' });

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.put('/profile');

      expect(result).to.deep.equal({
        id: 1,
        firstname: 'José',
        company: 'Sagacify'
      });
    });
  });

  describe('patch', () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it('should generate an error on http status greather than 299', async () => {
      nock('http://fake-api')
        .patch('/profile')
        .reply(500);

      const apiReader = new ApiReader('http://fake-api');
      let error;

      try {
        await apiReader.patch('/profile');
      } catch (err) {
        error = err;
      }

      expect(error.code).to.equal('HTTP_500');
    });

    it('should send a patch request and json parse the response', async () => {
      nock('http://fake-api', { id: 1, firstname: 'José', company: 'Sagacify' })
        .patch('/profile')
        .reply(200, { id: 1, firstname: 'José', company: 'Sagacify' });

      const apiReader = new ApiReader('http://fake-api');
      const result = await apiReader.patch('/profile');

      expect(result).to.deep.equal({
        id: 1,
        firstname: 'José',
        company: 'Sagacify'
      });
    });
  });
});
