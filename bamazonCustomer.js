var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "P!nkLem0nade$tand",

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
       
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
         }
        console.log("-----------------------------------------------");


        //console.log(table.toString());
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
            var chosenId = answer.product_name - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity
            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    id: res[chosenId].id
                }], function (err, res) {
                    //console.log(err);
                    vieworBuy();
                });

            } else {
                console.log("Sorry, we are unable to accomodate that quantity. We do have " + res[chosenId].stock_quantity + " in our Inventory.");
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