/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingHttpHeaders } from 'http';
import { RequestParams } from 'app/utils/RequestParams';
import {
  ParagraphExtractorApiResponse,
  ParagraphExtractorApiPayload,
} from 'app/V2/Routes/Settings/ParagraphExtraction/types';
import api from 'app/utils/api';

const API_BASE = 'paragraphExtraction';
const ENDPOINTS = {
  CREATE_EXTRACTOR: `${API_BASE}/extractor`,
  GET_EXTRACTORS: `${API_BASE}/extractors`,
  DELETE_EXTRACTOR: `${API_BASE}/extractor`, // TODO: adjust this once available
};

const get = async (headers?: IncomingHttpHeaders): Promise<ParagraphExtractorApiResponse[]> => {
  const requestParams = new RequestParams({}, headers);
  const response = await api.get(ENDPOINTS.GET_EXTRACTORS, requestParams);
  return response.json;
};

const save = async (
  extractorValues: ParagraphExtractorApiPayload
): Promise<ParagraphExtractorApiResponse> => {
  const requestParams = new RequestParams(extractorValues);
  return api.post(ENDPOINTS.CREATE_EXTRACTOR, requestParams);
};

const remove = async (ids: string[]) => {
  const requestParams = new RequestParams({ ids });
  return api.delete(ENDPOINTS.DELETE_EXTRACTOR, requestParams);
};

export { get, save, remove };
