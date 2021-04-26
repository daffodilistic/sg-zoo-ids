import fs from "fs";
import lodash from "lodash";
import cheerio from "cheerio";
import axios from "axios";

export const NEA_PAGES = [
  "mammal",
  "freshwater-fish",
  "dragonfly",
  "butterfly"
];

getMrtStations();
getNEASpecies();

function getMrtStations() {
  fs.readFile("data/source/mrt_stations.json", "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    const wordlist = JSON.parse(data);
    let outData = [];

    for (const obj of wordlist) {
      let word = obj["Station Name"];
      // To handle "one-north" case
      if (word.includes("-")) {
        word = word.replace("-", " ");
      }

      word = lodash.startCase(lodash.toLower(word));

      outData[word] = true;
    }

    outData = Object.keys(outData).sort();
    // console.log(outData);

    fs.writeFile(
      "./data/mrt.json",
      JSON.stringify(outData, null, 2),
      () => { /* NOOP */ }
    );
  });
}

async function getNEASpeciesList(url, outputFile) {
  const document = await axios.get(url);

  let $ = cheerio.load(document.data);
  let faunaData = [];

  $("table > tbody > tr:gt(0) ").each(function (idx, tr) {
    const td = cheerio(tr).children();
    const isSubheading = td.first().attr("colspan") != null;
    if (!isSubheading) {
      let faunaName = cheerio(tr).children("td:eq(2)").text();
      faunaName = faunaName.replace(/ \([\s\S]*?\)/g, "")
        .replace(/[^\w\s]/gi, "")
        .trim();
      if (faunaName.length > 0) {
        faunaData.push(faunaName);
      }
    }
  });

  fs.writeFile(
    outputFile,
    JSON.stringify(faunaData, null, 2),
    () => { /* NOOP */ }
  );
}

function getNEASpecies() {
  const DATA_PATH = "./data/";
  const NEA_BASE_URL =
    "https://www.nparks.gov.sg/ \
    biodiversity/wildlife-in-singapore/species-list/";

  for (let page of NEA_PAGES) {
    let url = `${NEA_BASE_URL}/${page}`;
    let filePath = `${DATA_PATH}/${page}.json`;
    getNEASpeciesList(url, filePath);
  }
}