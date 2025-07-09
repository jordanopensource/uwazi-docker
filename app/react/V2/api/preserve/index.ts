/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingHttpHeaders } from 'http';
import api from 'app/utils/api';
import { RequestParams } from 'app/utils/RequestParams';

const requestToken = async () => {
  const { json } = await api.post('preserve');
  return json.token;
};

export { requestToken };
