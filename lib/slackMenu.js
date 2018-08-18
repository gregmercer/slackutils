const inquirer = require('inquirer');

// import function to list coffee menu
const slackActions = require('../lib/slackActions');

const questions = [
  { type: 'list', name: 'selectedAction', message: 'Choose an action: ', choices: slackActions.actionStrings },
];

module.exports = function() {

  return new Promise((resolve, reject) => {

    inquirer
      .prompt(questions)
      .then(function (answers) {
        resolve(answers);
      }); 

  });

};