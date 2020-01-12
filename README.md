# reuters-dataset
🗞️ A tool for downloading and parsing Reuters-21578. These are a collection of documents that appeared on Reuters newswire back in 1987.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

#### 🔥 Features
  - Asynchronously caches the full dataset to your temporary directory.
    - This reduces your project size.
  - Prettifies the results.
    - Uses proper JSON naming conventions and common-sense values.

## 🚀 Getting Started

Using [`npm`]():

```bash
npm install --save reuters-dataset
```

Using [`yarn`]():

```bash
yarn add reuters-dataset
```

## ✍️ Usage

```javascript
import getReutersDataset from 'reuters-dataset';

(
  async () => {
    const { exchanges, orgs, people, places, topics, articles } = await getReutersDataset();
  }
)();

```

## 📌 Example

```json
{
  "$": {
    "topics": true,
    "lewissplit": "TRAIN",
    "cgisplit": "TRAINING-SET",
    "oldid": "5544",
    "newid": "1"
  },
  "topics": ["cocoa"],
  "places": ["el-salvador", "usa", "uruguay"],
  "people": [],
  "orgs": [],
  "exchanges": [],
  "companies": [],
  "text": {
    "title": "BAHIA COCOA REVIEW",
    "dateline": "SALVADOR, Feb 26 -",
    "body": "Showers continued throughout [...]"
  },
  "date": "1987-02-26T15:01:01.790Z"
}
```

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://www.buymeacoffee.com/cawfree">
    <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy @cawfree a coffee" width="232" height="50" />
  </a>
</p>
