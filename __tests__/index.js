import '@babel/polyfill';
import getReuters from '../src';

it('should download and parse the reuters newswire stories', async () => {
  const { exchanges, orgs, people, places, topics, articles } = await getReuters();
  expect(exchanges.length).toBe(39);
  expect(orgs.length).toBe(56);
  expect(people.length).toBe(267);
  expect(places.length).toBe(175);
  expect(topics.length).toBe(135);
  expect(articles.length).toBe(21578);
});
