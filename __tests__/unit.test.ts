import axios from 'axios';
import { getPlantUrlFromHtml, getPlantTableData, fetchHTML, plantDataByTextSearch } from '../src';

import { mockPlantHtmlTable } from '../__mocks__/mockPlantHtmlTable';
import { mockPlantDataHtml } from '../__mocks__/mockPlantDataHtml'

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const SEARCH_URL='https://garden.org/plants/search/text/?q=leeks';
// value from getPlantUrl
const PLANT_DATA_URL:string = 'https://garden.org/plants/view/75202/Leeks-Allium-ampeloprasum';
const PLANT_HREF:string = '/plants/view/75202/Leeks-Allium-ampeloprasum/'


const mockAxiosHtml = {
  data: mockPlantHtmlTable,
}

describe('getPlantUrlFromHtml()', () => {
  it('should ....', async () => {
    mockedAxios.get.mockResolvedValue(mockAxiosHtml);

    const result = await getPlantUrlFromHtml(SEARCH_URL);
    expect(result).toBeDefined();
    expect(result).toBe(PLANT_HREF);
  });

  it('should throw error if plant url is not found', async () => {
    mockedAxios.get.mockResolvedValue('kitten');
    expect( () => getPlantUrlFromHtml(SEARCH_URL)).rejects.toThrow();
  });
});

describe('fetchHTML()', () => {
  it('should return cheerio api obj', async () => {
    const mockUrl = 'http://garden.org/plants/view/75202/Leeks-Allium-ampeloprasum';
    mockedAxios.get.mockResolvedValue(mockAxiosHtml);

    const result = await fetchHTML(mockUrl);

    expect(result).toBeDefined();
    expect(result?.text).toBeDefined();
    expect(result?.html).toBeDefined();
  });

  it('Should return null for a bad url', async () => {
    mockedAxios.get.mockResolvedValue(undefined);

    const result = await fetchHTML('test');
    expect(result).toBeNull()
  });
});



describe('getPlantTableData', () => {
  it('should do stuff', async () => {
    mockedAxios.get.mockResolvedValue({data: mockPlantDataHtml});

    const result = await getPlantTableData('test');
    
    expect(result).toBeDefined();
    expect(result).toBe('kitten');


  })

})

