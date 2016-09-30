var five = require("johnny-five");  

var board = new five.Board();  

board.on("ready", function() {  
    console.log("Arduino connected");

    var sensorA = new five.Pin("A0");
    var sensorB = new five.Pin("A1");

    sensorA.on("data", function(){
        console.log("A val:" + this.value);
    });

    sensorB.on("data", function(){
        console.log("B val:" + this.value);
    });

});