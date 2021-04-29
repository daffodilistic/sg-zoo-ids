import fs from "fs";
import { NEA_PAGES } from "./generate.js";
import adjectives from "./data/adjectives.cjs";
// import animals from "./data/animals.js";
import lodash from "lodash";

function generate() {
  let adjective = getWord(adjectives);
  let reddot = getWord(JSON.parse(fs.readFileSync("./data/mrt.json")));
  let fauna = getWord(getNativeFauna());
  // let animal = getWord(animals);
  let word = [adjective, reddot, fauna];
  let id = getId();

  word = word.map(e => {
    let o = lodash.startCase(lodash.toLower(e));
    o = o.split(' ').join('');
    return o;
  });
  word = word.join('');
  return word + '-' + id.join('');
}

function getNativeFauna() {
  let faunaList = [];
  for (const filename of NEA_PAGES) {
    let data = JSON.parse(fs.readFileSync(`./data/${filename}.json`));
    switch (filename) {
      case 'butterfly':
        data.forEach((name, idx) => {
          if (name.search('fly') === -1) {
            data[idx] = `${name} Butterfly`;
          }
        });
        break;
      default:
        break;
    }
    faunaList = faunaList.concat(data);
  }

  return faunaList;
}

function getWord(wordList) {
  let index = lodash.random(0, wordList.length);
  return wordList[index];
}

function getId() {
  let id = [];
  for (var i = 0; i < 4; i++) {
    id.push(lodash.random(0, 9));
  }
  return id;
}

for (var i = 0; i < 10; i++) {
  let test = generate();
  console.log(test);
}