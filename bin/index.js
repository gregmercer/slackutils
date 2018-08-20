#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const slackMenu = require('../lib/slackMenu');

const channelService = require('../lib/channelService');
const channelData = require('../lib/channelData');
const channelNameQuestion = require('../lib/channelNameQuestion');

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
    })

  });

// allow commander to parse `process.argv`
program.parse(process.argv);