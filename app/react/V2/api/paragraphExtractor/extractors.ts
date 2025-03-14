/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingHttpHeaders } from 'http';
// import api from 'app/utils/api';
import { RequestParams } from 'app/utils/RequestParams';
import {
  ParagraphExtractorApiResponse,
  ParagraphExtractorApiPayload,
} from 'app/V2/Routes/Settings/ParagraphExtraction/types';
import api from 'app/utils/api';

let dummyData = [
  {
    _id: '1',
    sourceTemplateId: '66fbe4f28542cc5545e05a46',
    targetTemplateId: '66ffac5860f7ab062d87d13e',
    documents: 831,
    count: {
      generatedEntities: 1224,
      new: 5,
    },
  },
  {
    _id: '2',
    sourceTemplateId: '66fbe4d28542cc5545e0599c',
    targetTemplateId: '66ffac5860f7ab062d87d13e',
    documents: 500,
    count: {
      generatedEntities: 12001,
      new: 2,
    },
  },
  {
    _id: '3',
    sourceTemplateId: '66fbe4d28542cc5545e0599c',
    targetTemplateId: '66ffac5860f7ab062d87d13e',
    documents: 500,
    count: {
      generatedEntities: 1201,
      new: 0,
    },
  },
] as ParagraphExtractorApiResponse[];

// const apiEndpoint = 'paragraph-extractor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (headers?: IncomingHttpHeaders) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyData);
    });
  });

// app.post(
//   '/api/paragraphExtraction/extract',
//   needsAuthorization(),
//   PXExtractParagraphFromEntitiesController.adapt(PXExtractParagraphFromEntitiesController)
// );

// app.get(
//   '/api/paragraphExtraction/extractors',
//   needsAuthorization(),
//   PXGetExtractorsController.adapt(PXGetExtractorsController)
// );

const save = async (
  extractorValues: ParagraphExtractorApiPayload
): Promise<ParagraphExtractorApiResponse> => {
  const requestParams = new RequestParams(extractorValues);
  const response = await api.post('paragraphExtraction/extractor', { requestParams });
  return new Promise(resolve => {
    resolve(response);
  });
};

const remove = async (ids: string[]) => {
  // const requestParams = new RequestParams({ ids });
  // const response = await api.delete(apiEndpoint, requestParams);
  // return response;
  dummyData = dummyData.filter(data => !ids.includes(data._id ?? ''));
  console.log(dummyData);
  return true;
};

export { get, save, remove };
