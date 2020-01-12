import '@babel/polyfill';

import https from 'https';
import tar from 'tar';
import moment from 'moment';
import { tmpdir } from 'os';
import { sep } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { parseString } from 'xml2js';

import { name } from '../package.json';

const maybeDownload = (url) => {
  const tmpPath = `${tmpdir()}${sep}${name}`;
  if (!existsSync(tmpPath)) {
    return Promise
      .resolve()
      .then(() => mkdirSync(tmpPath))
      .then(
        () => new Promise(
          (resolve, reject) => https.get(
            url,
            res => res.pipe(
              tar.x({ C: tmpPath }),
            )
            .on('end', resolve)
            .on('error', reject),
          ),
        ),
      )
      .then(() => tmpPath);
  }
  return Promise
    .resolve(tmpPath);
};

const toArray = path => fs.readFile(path)
  .then(buf => buf.toString())
  .then(str => str.split('\n'))
  .then(arr => arr.filter(({ length }) => length > 0));

const toLowerCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map(
        (e) => {
          if (typeof e === 'object') {
            return toLowerCase(e);
          } else if (typeof e === 'string' && e.length <= 0) {
            return null;
          }
          return e;
        },
      )
      .filter(e => !!e);
  }
  return Object.fromEntries(
    Object
      .entries(
        obj,
      )
      .map(
        ([k, v]) => [
          (typeof k === 'string') ? k.toLowerCase() : k,
          (typeof v === 'object') ? toLowerCase(v) : v,
        ],
      ),
  );
};

const prettier = ({ $: { topics, ...extraInfo }, date, unknown, text, ...extras }) => {
  const [ { title, dateline, body } ] = text;
  return {
    $: {
      topics: topics === 'YES',
      ...extraInfo,
    },
    ...Object
      .fromEntries(
        Object
          .entries(extras)
            .map(
              ([k, v]) => {
                if (Array.isArray(v)) {
                  if (v.length === 1 && typeof v[0] === 'object' && v[0].hasOwnProperty('d')) {
                    return [k, v[0].d];
                  }
                }
                return [k, v];
              },
            ),
      ),
    text: {
      title: (title || [])[0],
      dateline: ((dateline || [])[0] || '').trim(),
      body: (body || [])[0],
    },
    date: moment(date[0]),
  };
};

const toJson = path => fs.readFile(path)
  .then(buf => buf.toString())
  .then(
    (str) => {
      const docType = str.substring(0, str.indexOf('\n'));
      return `
${docType}
<FORCED_ARRAY>
${str.substring(str.indexOf('\n') + 1)}
</FORCED_ARRAY>
`
        .trim();
    },
  )
  .then(
    str => new Promise(
      (resolve, reject) => parseString(
        str,
        (err, result) => {
          if (err) reject(err);
          return resolve(result);
        },
      ),
    ),
  )
  .then(
    ({ FORCED_ARRAY: { REUTERS } }) => toLowerCase(REUTERS),
  )
  .then(arr => arr.map(e => prettier(e)));

//                                    README.txt     reut2-003.sgm  reut2-007.sgm  reut2-011.sgm  reut2-015.sgm  reut2-019.sgm
//cat-descriptions_120396.txt         reut2-000.sgm  reut2-004.sgm  reut2-008.sgm  reut2-012.sgm  reut2-016.sgm  reut2-020.sgm
//feldman-cia-worldfactbook-data.txt  reut2-001.sgm  reut2-005.sgm  reut2-009.sgm  reut2-013.sgm  reut2-017.sgm  reut2-021.sgm
//lewis.dtd                           reut2-002.sgm  reut2-006.sgm  reut2-010.sgm  reut2-014.sgm  reut2-018.sgm

export default (url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/reuters21578-mld/reuters21578.tar.gz') => Promise
  .resolve()
  .then(() => maybeDownload(url))
  .then(
    dir => Promise
      .all(
        [
          toArray(`${dir}${sep}all-exchanges-strings.lc.txt`),
          toArray(`${dir}${sep}all-orgs-strings.lc.txt`),
          toArray(`${dir}${sep}all-people-strings.lc.txt`),
          toArray(`${dir}${sep}all-places-strings.lc.txt`),
          toArray(`${dir}${sep}all-topics-strings.lc.txt`),
          Promise
            .all(
              [...Array(22)]
                .map((_, i) => i <= 999 ? `00${i}`.slice(-3) : i)
                .map(str => toJson(`${dir}${sep}reut2-${str}.sgm`)),
            ),
        ],
      ),
  )
  .then(
    ([ exchanges, orgs, people, places, topics, articles ]) => ({
      exchanges,
      orgs,
      people,
      places,
      topics,
      articles,
    }),
  );

