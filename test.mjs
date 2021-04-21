import fs from "fs";
import adjectives from "./data/adjectives.js";
import animals from "./data/animals.js";
import lodash from "lodash";
import _ from "lodash";

function generate() {
  let adjective = getWord(adjectives);
  let reddot = getWord(JSON.parse(fs.readFileSync("./data/mrt.json")));
  let animal = getWord(animals);
  let word = [adjective, reddot, animal];
  let id = getId();

  word = word.map(e => {
    let o = lodash.startCase(lodash.toLower(e));
    o = o.split(' ').join('')
    return o;
  });
  word = word.join('');
  return word + '-' + id.join('');
}

function getWord(wordList) {
  let index = lodash.random(0, wordList.length);
  return wordList[index];
}

function getId() {
  let id = [];
  for (var i = 0; i < 4; i++) {
    id.push(lodash.random(0,9));
  }
  return id;
}

for (var i = 0; i < 10; i++) {
  let test = generate();
  console.log(test);
}