const config = require('config');
//const request = require('request');
const key = config.get('youtubeAPIKey');
const { google } = require('googleapis');
//const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

module.exports = function(req, res, next) {
  const service = google.youtube('v3');
  service.channels.list(
    {
      auth: key,
      part: 'snippet,contentDetails,statistics',
      forUsername: req.params.username
    },
    function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      const channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
      } else {
        const playlistID = channels[0].contentDetails.relatedPlaylists.uploads;
        console.log(playlistID);
      }
    }
  );
  next();
  //   const options = {
  //     uri: `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=${req.params.username}&key=${key}`,
  //     method: 'GET',
  //     headers: { 'user-agent': 'node.js' }
  //   };

  //   request(options, (error, response, body) => {
  //     // console.log(response);
  //     const obj = JSON.parse(body);
  //     req.user = obj.items[0].contentDetails.relatedPlaylists.uploads;
  //     next();
  //   });
};
