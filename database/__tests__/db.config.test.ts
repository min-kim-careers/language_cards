import * as dbConfig from '../db.config';

describe('Fetch collection count', () => {
  it('Should return collection count', async () => {
    return expect(dbConfig.fetchCollectionCount(10)).resolves.toBe(56);
  });
});

describe('Fetch words', () => {
  it('Should return word count', async () => {
    return expect(
      dbConfig.fetchWordsForCollection(0, 9).then((e) => e!.length)
    ).resolves.toBe(10);
  });
});

// describe('Favouriting words for user', () => {
//   it('', async () => {
//     return expect(
//       dbConfig.updateFavourites('123e4567-e89b-12d3-a456-426614174000', )
//     ).resolves.toStrictEqual([1,2,4,5]);
//   });
// });
