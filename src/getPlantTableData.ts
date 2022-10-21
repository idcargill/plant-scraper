import { fetchHTML } from './fetchHTML';




// Strip plant data from HTML
export const getPlantTableData = async (url:string): Promise<any | null> => {
  let data:any = {};

  const $ = await fetchHTML(url);
  if ($) {
    $('tr').each((i, el) => {
      let row = $(el).text().split(':');
      const key = row[0]?.replace(',', '').replace('\n', '').trim();
      const value = row[1]?.replace('\n', '').trim();
      data[key] = value;
    });
  }
  console.log('no data');
  return data;
}
