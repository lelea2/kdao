const csv = require('csv-parser')
const fs = require('fs')

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

const filename = myArgs[0];
const keyText = myArgs[1] ?? 'key';
const valueText = myArgs[2] ?? 'value';

const results = [];

fs.createReadStream(filename)
  .pipe(csv())
  .on('data', (data) => {
    // console.log('>>>> data', data);
    results.push({
      id: data['category_id'],
      vanity_name: data['Vanity URL']?.replace('https://linkedin.com/products/categories/', ''),
    });
  })
  .on('end', () => {
    let str = '';
    for (let i = 0; i < results.length; i++) {
      const { id, vanity_name } = results[i];
      str += `\u0020\u0020\<entry ${keyText}="${id}" ${valueText}="${vanity_name}"/>\n`;
    }
    const final_str = `<map>\n${str}</map>`;
    if (!!final_str) {
      fs.writeFile('result.txt', final_str, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('Line saved!');
      });
    }
  });
