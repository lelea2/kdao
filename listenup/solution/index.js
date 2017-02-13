'use strict';

const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 8005;

var fetchData = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
};

var getAllUsers = (data) => {
  var arr = [];
  for (var i = 0; i < data.length; i++) {
    arr.push(data[i].username);
  }
  return arr;
};

var prepareRequestData = (arr, startIndex, n) => {
  var urls = [],
      users = [];
  for (var i = startIndex; i < n; i++) {
    if (arr[i]) {
      users.push(arr[i]); //generate user name
      urls.push(`http://localhost:8000/friends/${arr[i]}`); //friends call
      urls.push(`http://localhost:8001/plays/${arr[i]}`); //play call
    }
  }
  return {
    urls: urls,
    users: users
  };
};

var findUniqueTrack = (plays) => {
  var unique_tracks = {},
      count = 0;
  for (var i = 0; i < plays.length; i++) {
    if (!unique_tracks[plays[i]]) {
      count = count + 1;
      unique_tracks[plays[i]] = true;
    }
  }
  return count;
};

var generateResponses = (user_arr, responses) => {
  var users = [];
  for (var i = 0; i < responses.length / 2; i++) {
    var user = responses[2 * i], //user's data
        play = responses[2 * i + 1]; //play data
    users.push({
      username: user_arr[i],
      plays: play.plays.length,
      friends: user.friends.length,
      uri: `/users/${user_arr[i]}`
    });
  }
  return users;
};

app.listen(port, function () {
  console.log('Server started on port: ', port);
});

//GET http://localhost:8005/users?startIndex=0&n=5
app.get('/users', (req, res) => {
  var startIndex = req.query.startIndex || 0, //start index in response, by default value is 0
      n = req.query.n || 5; //number of items response, by default the value is 5
  fetchData('http://localhost:8000/friends').then(
    (data) => {
      var users = getAllUsers(data.friends),
          dataURLs = prepareRequestData(users, startIndex, n),
          urlPromises = dataURLs.urls.map(fetchData);
      Promise.all(urlPromises)
      .then((results) => {
        res.status(200).json({
          users: generateResponses(dataURLs.users, results),
          uri: '/users'
        });
      })
      .catch((err1) => {
        res.status(500).json({ error: err1.stack });
      });
    },
    (err2) => {
      res.status(500).json({ error: err2.stack });
    }
  );
});

//GET http://localhost:8005/users/joe_example
app.get('/users/:user_name', (req, res) => {
  var user_name = req.params.user_name,
      urls = [
        `http://localhost:8000/friends/${user_name}`,
        `http://localhost:8001/plays/${user_name}`
      ],
      urlPromises = urls.map(fetchData);
  Promise.all(urlPromises)
  .then((results) => {
    res.status(200).json({
      username: results[0].username,
      plays: results[1].plays.length,
      friends: results[0].friends.length,
      tracks: findUniqueTrack(results[1].plays),
      uri: `/users/${user_name}`
    });
  })
  .catch((err) => {
    // Will catch failure of first failed promise
    res.status(500).json({ error: err.stack });
  });
});
