const inquirer = require('inquirer');

const questions = [
  { type: 'enter', name: 'userEmail', message: 'Enter user email: ' },
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