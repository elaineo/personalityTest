/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express  = require('express'),
  app        = express(),
  bluemix    = require('./config/bluemix'),
  watson     = require('watson-developer-cloud'),
  extend     = require('util')._extend,
  i18n       = require('i18next');

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials = extend({
  version: 'v2',
  username: 'e2488f27-daba-4228-8ff7-018a41c94797',
  password: 'up3SlWhE3ZF5'
}, bluemix.getServiceCreds('personality_insights')); // VCAP_SERVICES

// Create the service wrapper
var personalityInsights = watson.personality_insights(credentials);

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

// 1. Check if we have a captcha and reset the limit
// 2. pass the request to the rate limit
app.post('/', function(req, res, next) {

  var profileParameters = extend(req.body, {
      acceptLanguage : i18n.lng()
  });

  personalityInsights.profile(profileParameters, function(err, profile) {
    if (err)
      return next(err);
    else
      return res.json(profile);
  });
});

app.post('/twitter', function(req, res, next) {
  var name = req.body.twitter;
  twitter.getUserTimeline({ screen_name: name, include_rts: 'false', count: '2000'}, error, function(djson) {
    var data = JSON.parse(djson);
    //console.log('Data %s', data);
    var tweets = []
    for (var d in data) {
      console.log(data[d].text)
      tweets.push(data[d].text)
    }
    return res.json(tweets);
  });

});
// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);

var Twitter = require('twitter-node-client').Twitter;
var config = {
      "consumerKey": "pj9aPgZz3ItVjPnMZuy0q8cwP",
      "consumerSecret": "KjUDGNVNwtdH6zvzR6BHRWieUK0tnVZaTnTORnRFf8bIsIJLOb",
      "accessToken": "1450820660-utqEA2FVYYBugOCbEpPOs3sSU7hx4ji7lgqfLgH",
      "accessTokenSecret": "ITHCwRou9IgWuo6ddT6uL02Tw9lV3uwMg0tFfNOGj1HTZ",
      "callBackUrl": ""
  }
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
    return err;
};
var success = function (djson) {
    var data = JSON.parse(djson);
    //console.log('Data %s', data);
    var tweets = []
    for (var d in data) {
      console.log(data[d].text)
      tweets.push(data[d].text)
    }
    return tweets
};
var twitter = new Twitter(config);
