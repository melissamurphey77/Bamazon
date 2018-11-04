var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3360,

    user: "root",

    password: "",

    database: "bamazon_DB"
});

//const chalkAnimation = require('chalk-animation');

//chalkAnimation.karaoke("Welcome to Bamazon!");



var vieworBuy = function () {


    connection.query("SELECT * FROM products", function (err, res) {

        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });

        console.log("BAMAZON INVENTORY: ");
        console.log("===========================================");

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].ProductName, res[i].DepartmentName, res[i].Price.toFixed(2), res[i].StockQuantity]);
        }
        console.log("-----------------------------------------------");


        console.log(table.toString());
        inquirer.prompt([{
            name: "productId",
            type: "input",
            message: "Hello! What is the product ID you would like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;

                }
            }

        }]).then(function (answer) {
            var chosenId = answer.productId - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity
            if (chosenQuantity < res[chosenId].StockQuantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].ProductName + " is: " + res[chosenId].Price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    StockQuantity: res[chosenId].StockQuantity - chosenQuantity
                }, {
                    id: res[chosenId].id
                }], function (err, res) {
                    //console.log(err);
                    vieworBuy();
                });

            } else {
                console.log("Sorry, we are unable to accomodate that quantity. We do have " + res[chosenId].StockQuantity + " in our Inventory.");
                vieworBuy();
            }
        });

    })
}

connection.connect(function (err) {
    if (err) throw err;
    vieworBuy();
    console.log("connecting to Bamazon...");

});