#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const slackMenu = require('../lib/slackMenu');

const channelService = require('../lib/channelService');
const channelData = require('../lib/channelData');
const channelNameQuestion = require('../lib/channelNameQuestion');

const groupService = require('../lib/groupService');
const groupData = require('../lib/groupData');
const groupNameQuestion = require('../lib/groupNameQuestion');

const userEmailQuestion = require('../lib/userEmailQuestion');

program
  .command('menu') 
  .alias('su') 
  .description('Slack Utilities') 
  .action(function (args) {

    slackMenu()
    .then(function (answers) {
      if (answers.selectedAction == 'Create Channels') {
        var data = channelData.testClubs;
        channelService.createChannels(data);
      }
      else if (answers.selectedAction == 'Delete Channel') {
        channelNameQuestion()
        .then(function(answers) {
          channelService.deleteChannel(answers.channelName);
        });
      }
      else if (answers.selectedAction == 'Delete Channels') {
        var data = channelData.testClubs;
        channelService.deleteChannels(data);
      }
      else if (answers.selectedAction == 'Create Groups') {
        var data = groupData.testClubs;
        groupService.createGroups(data);
      }
      else if (answers.selectedAction == 'Invite to Group') {
        let data = {};
        groupNameQuestion()
        .then(function(answers) {
          data.groupName = answers.groupName;
          answers = userEmailQuestion();
          return answers;
        })
        .then(function(answers) {
          data.userEmail = answers.userEmail;
          groupService.inviteToGroup(data.groupName, data.userEmail);
        })
      }
      // todo: Slack Dev support is saying that deleting groups
      // is not possible with the current undocumented groups.delete 
      // api. 
      /*
      else if (answers.selectedAction == 'Delete Group') {
        groupNameQuestion()
        .then(function(answers) {
          groupService.deleteGroup(answers.groupName);
        });
      }
      else if (answers.selectedAction == 'Delete Groups') {
        let data = groupData.testClubs;
        groupService.deleteGroups(data);
      }
      */
    })

  });

// allow commander to parse `process.argv`
program.parse(process.argv);