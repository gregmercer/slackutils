const inquirer = require('inquirer');

const questions = [
  { type: 'enter', name: 'userName', message: 'Enter user name: ' },
];

module.exports = function(bookInfo) {

  return new Promise((resolve, reject) => {
    inquirer
      .prompt(questions)
      .then(function (answers) {
        //console.log(answers);
        resolve(answers);
      });
  });
  
};