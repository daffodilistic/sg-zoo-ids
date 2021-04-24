import fs from "fs";
import lodash from "lodash";
import cheerio from "cheerio";
import axios from "axios";

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
      if (word.includes('-')) {
        word = word.replace('-', ' ');
      }

      word = lodash.startCase(lodash.toLower(word));

      outData[word] = true;
    }

    outData = Object.keys(outData).sort();
    // console.log(outData);

    fs.writeFile("./data/mrt.json", JSON.stringify(outData, null, 2), (_) => { });
  });
}

async function getMammals() {
  const url = "https://www.nparks.gov.sg/biodiversity/wildlife-in-singapore/species-list/mammal";
  const document = await axios.get(url);

  let $ = cheerio.load(document.data);
  let mammalData = [];

  $('table > tbody > tr:gt(0) ').each(function (idx, tbody) {
    const td = cheerio(tbody).children();
    const isSubheading = td.first().attr('colspan') != null;
    if (!isSubheading) {
      // td.children().each(function (ri, p) {
      //   mammalRow[ri] = cheerio(p).text();
      // });
      // mammalRow = cheerio(td.children().get()[2]).text();
      let mammalName = td.children('p:eq(2)').text();
      mammalData.push(mammalName);
    }
  });

  // mammalData.forEach((v, i) => {
  //   console.log(`[${i}]: ${v}`);
  // });

  fs.writeFile("./data/mammals.json", JSON.stringify(mammalData, null, 2), (_) => { });
}

getMrtStations();
getMammals();