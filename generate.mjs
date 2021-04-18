import fs from "fs";
import lodash from "lodash";

fs.readFile("data/source/mrt_stations.json", "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }

  const wordlist = JSON.parse(data);
  let outData = [];

  for (const obj of wordlist) {
    let word = obj["Station Name"];
    // To handle "one-north" case
    if (word.includes('-')) {
      word = word.replace('-', ' ');
    }

    word = lodash.startCase(lodash.toLower(word));

    outData[word] = true;
  }

  outData = Object.keys(outData).sort();
  // console.log(outData);

  fs.writeFile("./data/mrt_stations.json", JSON.stringify(outData, null, 2), (_) => { });
});