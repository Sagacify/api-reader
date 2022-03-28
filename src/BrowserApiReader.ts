import { IsoApiReader, ApiReaderOptions } from './IsoApiReader';

export class ApiReader extends IsoApiReader {
  constructor(baseUrl: string, options: ApiReaderOptions) {
    super(
      {
        fetch: window.fetch,
        Headers: window.Headers,
        btoa: window.btoa
      },
      baseUrl,
      options
    );
  }
}
