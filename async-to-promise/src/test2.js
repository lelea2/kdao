const fetch = require('node-fetch');

async function doAsyncTask() {
  try {
    const response = await fetch('https://www.reddit.com/r/Overwatch.json');
    console.log(response);
    return response.json();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  doAsyncTask: doAsyncTask
};