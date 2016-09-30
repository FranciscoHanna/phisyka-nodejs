var five = require("johnny-five");  

var board = new five.Board();  

board.on("ready", function() {  
    console.log("Arduino connected");

    this.pinMode(7, five.Pin.INPUT);
    this.pinMode(8, five.Pin.INPUT);

    ard.digitalRead(7, function(value){
        console.log("A val:" + value);
    });

    ard.digitalRead(7, function(value){
        console.log("B val:" + value);
    });

});