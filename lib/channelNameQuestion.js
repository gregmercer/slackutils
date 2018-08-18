const inquirer = require('inquirer');

const questions = [
  { type: 'enter', name: 'channelName', message: 'Enter channel name: ' },
];

module.exports = function(bookInfo) {

  return new Promise((resolve, reject) => {
    inquirer
      .prompt(questions)
      .then(function (answers) {
        console.log(answers);
        resolve(answers);
      });
  });
  
};