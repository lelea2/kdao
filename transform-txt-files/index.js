const fs = require('fs');
const readline = require('readline');

let my_file = process.argv[2];

console.log(process.argv)

if (!my_file) {
  console.log('>>>> my file path does not provided, fall back to default');
  my_file = 'temp.txt';
}

// fs.readFile('temp.txt', 'utf-8', (err, data) => {
//   console.log(data);
// });
// create instance of readline
// each instance is associated with single input stream
let rl = readline.createInterface({
  input: fs.createReadStream(my_file)
});

let final_str = '';

// event is emitted after each line
rl.on('line', function(line) {
  // line_no++;
  // console.log('>>> line data:', line);
  if (!!line) {
    if (isNaN(parseInt(line, 10))) {
      console.log('>>>> Create new entry');
      if (!!final_str) {
        final_str += `\u0020\u0020\</list>\n</entry>\n`;
      }
      final_str += `<entry key="${line}">\n\u0020\u0020<list>\n`;
    } else {
      final_str += `\u0020\u0020\u0020\u0020<value>${line}</value>\n`;
    }
  }
});

// end
rl.on('close', function(line) {
  if (!!final_str) { // Close tag at the end
    final_str += `</list>\n</entry>\n`;
  }
  // console.log('>>> final_str', final_str);
  fs.writeFile('result.txt', final_str, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Line saved!');
  });
});
