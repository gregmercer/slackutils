'use strict';

const axios = require('axios');

const groupData = require('../lib/groupData');

const channelsToken = process.env.CHANNELS_TOKEN;

const TaskQueue = require('cwait').TaskQueue;
const Promise = require('bluebird');

let queueCreateGroups = new TaskQueue(Promise, 3);
let queueDeleteGroups = new TaskQueue(Promise, 1);

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

function findGroupId(groupName) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'groups.list' + '?' + 'token=' + channelsToken + '&exclude_archived=true', 
      'headers' : getHeaders()

    }).then(function(result) {

      console.log('findGroupId groupName = ' + groupName + ' status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      var groupId = '';
      var groups = result.data.groups;
      for (var index = 0; index < groups.length; index++) {
        if (groups[index].name == groupName) {
          groupId = groups[index].id;
          break;
        }
      }

      resolve(groupId);

    });

  });

}

// 

function findUserId(userEmail) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'users.list' + '?' + 'token=' + channelsToken + '&exclude_archived=true', 
      'headers' : getHeaders()

    }).then(function(result) {

      console.log('findUserId userEmail = ' + userEmail + ' status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      var userId = '';
      var members = result.data.members;
      for (var index = 0; index < members.length; index++) {
        if (members[index].profile.email == userEmail) {
          userId = members[index].id;
          break;
        }
      }

      console.log(`in findUserId userEmail = ${userEmail} found userId ${userId}`)

      resolve(userId);

    });

  });

}

// 

function inviteToGroupWithId(groupId, userEmail) {

  console.log(`in inviteToGroupWithId groupId = ${groupId} userEmail = ${userEmail}`);

  let data = {channel: groupId, user: userEmail, token: channelsToken};

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'POST', 
      'url' : getURL() + 'groups.invite', 
      'headers' : getHeaders(),
      'data' : data

    }).then(function(result) {

      console.log('inviteToGroupWithId status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      console.log(result.data);

      console.log(`Invited userEmail = ${userEmail} to groupId = ${groupId}`);

      resolve();

    })
    .catch(err => {
      console.error(`deleteGroupWithId error: ${err}`);
    });

  });

}

// 

function deleteGroupWithId(groupId) {

  console.log('in deleteGroupWithId groupId = ' + groupId);

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'GET', 
      'url' : getURL() + 'groups.delete' + '?' + 'token=' + channelsToken + '&channel=' + groupId, 
      'headers' : getHeaders()

    }).then(function(result) {

      console.log('deleteGroupWithId status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      console.log(result);

      console.log('Deleted group id = ' + groupId);

      resolve();

    })
    .catch(err => {
      console.error(`deleteGroupWithId error: ${err}`);
    });

  });

}

//

function setGroupPurpose(data) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'POST', 
      'url' : getURL() + 'groups.setPurpose', 
      'headers' : getHeaders(),
      'data' : data

    })
    .then(function(result) {

      console.log('setGroupPurpose status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      console.log(result.data);

      resolve(result.data);

    })
    .catch(err => {
      console.error(`in setGroupPurpose error: ${err}`);
    });

  });

}

//

function createGroupName(data) {

  return new Promise((resolve, reject) => {

    axios({ 

      'method' : 'POST', 
      'url' : getURL() + 'groups.create', 
      'headers' : getHeaders(),
      'data' : data

    }).then(function(result) {

      console.log('createGroupName status = ' + result.status);

      if (result.status != 200) {
        reject(result.status);
      }

      //console.log(result);
      if (result.data.ok != false) {
        console.log('Created group name = ' + result.data.group.name);
      }
      else {
        console.log('Failed to create group');
        console.log(result.data);
      }

      resolve(result.data);

    })
    .catch(err => {
      console.error(`in createGroupName error: ${err}`);
    });

  });

}

//

const createGroup = (groupName, groupPurpose) => {

	console.log('in createGroup for groupService');

  var resultData = {};

  return new Promise((resolve, reject) => {

    var data = getCreateData();
    data.name = groupName;
    console.log(data);

    createGroupName(data)
    .then(function (groupData) {

      if (groupData.ok != false) {

        data = getSetPurposeData();
        data.channel = groupData.group.id;
        data.purpose = groupPurpose;

        return resultData = setGroupPurpose(data);

      }

      return groupData;

    })
    .then(function (resultData) {
      resolve(resultData);
    })
    .catch(err => {
      console.error(`in createGroup error: ${err}`);
    });

  });

}

//

function createGroupsMap (item) {

  return new Promise((resolve, reject) => {   

    var name = item.name;
    var purpose = item.purpose;
    name = name.substring(0, 21);
    if (name.slice(-1) === "_") {
      name = name.substring(0, name.length-1);
    }

    setTimeout(function() { 

      createGroup(name, purpose)
      .then(() => { resolve(); })
      .catch(err => {
        console.error(`createGroup error: ${err}`);
      });

    }, 10000);

  });
}

//

const createGroups = (data) => {

  let groupDataList = [];

  for (let index = 0; index < data.length; index++) {
    groupDataList.push(data[index]);
  }

  Promise.map(groupDataList, queueCreateGroups.wrap(createGroupsMap))
    .then((result) => {
      console.log(`All done.`);
    })
    .catch(err => {
      console.error(`error: ${err}`);
    });

}

//

const inviteToGroup = (groupName, userEmail) => {

  //console.log('in deleteGroup for groupService');

  let data = {};

  findGroupId(groupName)
  .then(function(groupId) {
  	data.groupId = groupId;
  	let userId = findUserId(userEmail);
  	return userId;
  })
  .then(function(userId) {
  	data.userId = userId;
    if (data.groupId != '' && data.userId != '') {
      inviteToGroupWithId(data.groupId, data.userId);
    }
  });

}

//

const deleteGroup = (groupName) => {

  //console.log('in deleteGroup for groupService');

  findGroupId(groupName)
  .then(function(groupId) {
    if (groupId != '') {
      deleteGroupWithId(groupId);
    }
  })

}

//

function deleteGroupsMap (item) {

  return new Promise((resolve, reject) => {   

    findGroupId(item.name)
    .then(function(groupId) {
      if (groupId != '') {
        setTimeout(function() { 
          deleteGroupWithId(groupId)
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

const deleteGroups = (data) => {

  let groupDataList = [];

  for (var index = 0; index < data.length; index++) {
    groupDataList.push(data[index]);
  }

  Promise.map(groupDataList, queueDeleteGroups.wrap(deleteGroupsMap))
    .then((result) => {
      console.log(`All done.`);
    })
    .catch(err => {
      console.error(`error: ${err}`);
    });

}

module.exports = { createGroups, inviteToGroup, deleteGroup, deleteGroups };
