'use strict';

const axios = require('axios');

const channelData = require('../lib/channelData');

const channelsToken = process.env.CHANNELS_TOKEN;

const TaskQueue = require('cwait').TaskQueue;
const Promise = require('bluebird');

let queueCreateChannels = new TaskQueue(Promise, 3);
let queueDeleteChannels = new TaskQueue(Promise, 1);

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

      console.log('findChannelId channelName = ' + channelName + ' status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

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

  console.log('in deleteChannelWithId channelId = ' + channelId);

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'channels.delete' + '?' + 'token=' + channelsToken + '&channel=' + channelId, 
      'headers' : getHeaders()

    }).then(function(result) {

      console.log('deleteChannelWithId status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      console.log('Deleted channel id = ' + channelId);

      resolve();

    })
    .catch(err => {
      console.error(`deleteChannelWithId error: ${err}`);
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

      console.log('createChannelName status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      //console.log(result);
      if (result.data.ok != false) {
        console.log('Created channel name = ' + result.data.channel.name);
      }
      else {
        console.log('Failed to create channel');
        console.log(result.data);
      }

      resolve(result.data);

    })
    .catch(err => {
      console.error(`in createChannelName error: ${err}`);
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

    })
    .then(function(result) {

      console.log('setChannelPurpose status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      console.log(result.data);

      resolve(result.data);

    })
    .catch(err => {
      console.error(`in setChannelPurpose error: ${err}`);
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

    })
    .then(function (resultData) {
      resolve(resultData);
    })
    .catch(err => {
      console.error(`in createChannel error: ${err}`);
    });

  });

}

//

function createChannelsMap (item) {

  return new Promise((resolve, reject) => {   

    var name = item.name;
    var purpose = item.purpose;
    name = name.substring(0, 21);
    if (name.slice(-1) === "_") {
      name = name.substring(0, name.length-1);
    }

    setTimeout(function() { 

      createChannel(name, purpose)
      .then(() => { resolve(); })
      .catch(err => {
        console.error(`createChannel error: ${err}`);
      });

    }, 10000);

  });
}

//

const createChannels = (data) => {

  let channelDataList = [];

  for (var index = 0; index < data.length; index++) {
    channelDataList.push(data[index]);
  }

  Promise.map(channelDataList, queueCreateChannels.wrap(createChannelsMap))
    .then((result) => {
      console.log(`All done.`);
    })
    .catch(err => {
      console.error(`error: ${err}`);
    });

}

//

const deleteChannel = (channelName) => {

  //console.log('in deleteChannel for channelService');

  findChannelId(channelName)
  .then(function(channelId) {
    if (channelId != '') {
      deleteChannelWithId(channelId);
    }
  })

}

//

function deleteChannelsMap (item) {

  return new Promise((resolve, reject) => {   

    findChannelId(item.name)
    .then(function(channelId) {
      if (channelId != '') {
        setTimeout(function() { 
          deleteChannelWithId(channelId)
          .then(() => { resolve(); });
        }, 10000);
      }
      else {
        resolve();
      }
    })

  });
}

//

const deleteChannels = (data) => {

  let channelDataList = [];

  for (var index = 0; index < data.length; index++) {
    channelDataList.push(data[index]);
  }

  Promise.map(channelDataList, queueDeleteChannels.wrap(deleteChannelsMap))
    .then((result) => {
      console.log(`All done.`);
    })
    .catch(err => {
      console.error(`error: ${err}`);
    });

}

module.exports = { createChannel, createChannels, deleteChannel, deleteChannels };