var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 7700,

    user: "root",

    password: "",
  database: "bamazon_DB"
});

const chalkAnimation = require('chalk-animation');
 
chalkAnimation.karaoke("Welcome to Bamazon!");



connection.connect(function(err) {
    if (err) throw err;

    start();
});

function startPrompt() {
    inquirer
      .prompt({
        name: "productId",
        type: "list",
        message: "How can we help you today?",
        choices: ["View products for sale", "Add a Product", "Enter an ID", "Exit"]
      })
      .then(function(answer) {
        switch (answer.action) {
          case 'View':
          viewInven(function(){
            startPrompt;
          });
          break;

          case 'Add':
          addProd(function() {
            startPrompt;
          });
          break;

          case 'Enter':
          enterID(function() {
            startPrompt;
          });
          break;
        }
      });

    }