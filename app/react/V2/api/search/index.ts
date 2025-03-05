import { IncomingHttpHeaders } from 'http';
import api from 'app/utils/api';
import { RequestParams } from 'app/utils/RequestParams';

interface LookupEntity {
  value: string;
  label: string;
  template: string;
}

const lookup = async (
  searchterm: string,
  templates?: string[],
  headers?: IncomingHttpHeaders
): Promise<LookupEntity[]> => {
  try {
    const requestParams = new RequestParams({ searchterm, templates }, headers);
    if (headers && headers['Content-Language']) {
      api.locale(headers['Content-Language']);
    }
    const response = await api.get('search/lookup', requestParams);
    return response.json;
  } catch (e) {
    return e;
  }
};

export { lookup };
