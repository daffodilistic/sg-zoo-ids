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

  // console.log($('table > tbody > tr > td').text());

  let test = [];
  let parseNextRow = false;
  $('table > tbody > tr').each(function (idx, tbody) {
    if (idx !== 0) {
      const tr = cheerio(tbody);
      const isSubheading = (tr.children('td').attr('colspan') == 4);

      if (isSubheading) {
        parseNextRow = true;
      } else if (parseNextRow) {
        const rowData = tr.children('td').children('p').map((_, e) => {
          return cheerio(e).text();
        }).get();
        
        parseNextRow = false;

        console.log(`[${idx - 1}] isSubheading: ${element}`);
      }
      // test[idx] = el.attr('colspan');
      // test[idx] = $(this).children('td').html();

      // let td = tr.children().length;
      // test.push(tr);
      // $(this).children('td').each(function (idx, p) {
      //   test[idx] = $(this).text();
      // });
    }
  });

  test.forEach((v, i) => {
    console.log(`[${i}] isSubheading: ${v}`);
  });

  // const fruits = [];
  // let $ = cheerio.load('<ul id="fruits">\
  //   <li class="apple">Apple</li>\
  //   <li class="orange">Orange</li>\
  //   <li class="pear">Pear</li>\
  // </ul>');
  // $('li').each(function (i, elem) {
  //   fruits[i] = $(this).text();
  // });
  // console.log(fruits.join(', '));
  // console.log($('ul > li').text());
}

// getMrtStations();
getMammals();