'use strict';

const axios = require('axios');
const channelData = require('../lib/channelData');

const channelsToken = process.env.CHANNELS_TOKEN;

//

function getURL() {
  return 'https://slack.com/api/';
}

function getHeaders() {
  var headers = {
    'Authorization' : 'Bearer ' + channelsToken,
    'Content-type' : 'application/json'
  };
  return headers;
}

//

function getCreateData() {
  var data = {
    'name' : '',
    'validate' : 'true',
    'token' : channelsToken
  };
  return data;
}

function getSetPurposeData() {
  var data = {
    'channel' : '',
    'purpose' : '',
    'token' : channelsToken
  };
  return data;
}

// 

function findChannelId(channelName) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'channels.list' + '?' + 'token=' + channelsToken + '&exclude_archived=true', 
      'headers' : getHeaders()

    }).then(function(result) {

        console.log(result.status);

        if (result.status != 200) {
          reject(result.status);
        }

        return result;

    }).then(function(result) {

      //console.log('List channels = ' + result.data.channels);

      var channelId = '';
      var channels = result.data.channels;
      for (var index = 0; index < channels.length; index++) {
        //console.log(channels[index]);
        if (channels[index].name == channelName) {
          channelId = channels[index].id;
          break;
        }
      }

      resolve(channelId);

    });

  });

}

// 

function deleteChannelWithId(channelId) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'channels.delete' + '?' + 'token=' + channelsToken + '&channel=' + channelId, 
      'headers' : getHeaders()

    }).then(function(result) {

        console.log(result.status);

        if (result.status != 200) {
          reject(result.status);
        }

        return result;

    }).then(function(result) {

      //console.log('List channels = ' + result.data.channels);

      console.log('Deleted channel id = ' + channelId);

      resolve();

    });

  });

}

//

function createChannelName(data) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'POST', 
      'url' : getURL() + 'channels.create', 
      'headers' : getHeaders(),
      'data' : data

    }).then(function(result) {

        console.log(result.status);

        if (result.status != 200) {
          reject(result.status);
        }

        return result;

    }).then(function(result) {

      //console.log(result);
      if (result.data.ok != false) {
        console.log('Created channel name = ' + result.data.channel.name);
      }

      resolve(result.data);

    });

  });

}

//

function setChannelPurpose(data) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'POST', 
      'url' : getURL() + 'channels.setPurpose', 
      'headers' : getHeaders(),
      'data' : data

    }).then(function(result) {

        console.log(result.status);

        if (result.status != 200) {
          reject(result.status);
        }

        return result;

    }).then(function(result) {

      resolve(result.data);

    });

  });

}

//

const createChannel = (channelName, channelPurpose) => {

	console.log('in createChannel for channelService');

  var resultData = {};

  return new Promise((resolve, reject) => {

    var data = getCreateData();
    data.name = channelName;
    console.log(data);

    createChannelName(data)
    .then(function (channelData) {

      if (channelData.ok != false) {

        data = getSetPurposeData();
        data.channel = channelData.channel.id;
        data.purpose = channelPurpose;

        return resultData = setChannelPurpose(data);

      }

      return channelData;

    }).then(function (resultData) {
      resolve(resultData);
    });

  });

}

//

const createChannels = (data) => {

  //console.log('in createChannels for channelService');

  var promises = [];

  for (var index = 0; index < data.length; index++) {
    var name = data[index].name;
    var purpose = data[index].purpose;
    name = name.substring(0, 21);
    if (name.slice(-1) === "_") {
      name = name.substring(0, name.length-1);
    }
    promises.push(createChannel(name, purpose));
  }

  Promise.all(promises)    
  .then(function(data) { 
    console.log(data);
  }).catch(function(err) { 
    console.log('error = ' + err);
  });

}

const deleteChannel = (channelName) => {

  //console.log('in createChannels for channelService');

  findChannelId(channelName)
  .then(function(channelId) {
    console.log(channelId);
    if (channelId != '') {
      deleteChannelWithId(channelId);
    }
  });

}

module.exports = { createChannel, createChannels, deleteChannel };