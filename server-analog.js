// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io = require('socket.io')(httpServer);

var ip = "192.168.10.200";
var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port, ip, function(){
    console.log('Server available at http://' + ip + ":" + port);  
});  


//Arduino board connection
var board = new five.Board();  

board.on("ready", function() {  

    this.samplingInterval(25);
    console.log('Arduino connected');

    // Socket connection handler
    var sensorA = new five.Pin("A0");
    var sensorB = new five.Pin("A1");

    io.on('connection', 
        function (socket) {
        console.log('Client connected. Socket ID: ' + socket.id);

        var umbral = 500;
        // Variables para Sensor A
        var t1A, t2A, flag1A = true, flag2A = false;

        // Variables para Sensor B
        var t1B, t2B, flag1B = true, flag2B = false;

        // Tiempo de obstruccion del sensor A
        sensorA.read(function(err, val){
            //console.log("A val:" + this.value);
            if(flag1A == true && val > umbral){
                t1A = process.hrtime();
                // console.log('Tiempo T1: ' + t1A);
                flag1A = false;
                flag2A = true;
            }
            else if(flag2A == true && val < umbral){
                t2A = process.hrtime(t1A);
                // console.log('Tiempo T2: ' + t2A);
                flag1A = true;
                flag2A = false;
                var ms = (t2A[0] * 1000) + (t2A[1]/1000000);
                socket.emit('sensorA', { timeA: ms });
                
                console.log(ms + 'ms sensorA');
            }
        });

        // Tiempo de obstruccion del sensor B
        sensorB.read(function(err, val){
            //console.log("B val:" + this.value);
            if(flag1B == true && val > umbral){
                t1B = process.hrtime();
                flag1B = false;
                flag2B = true;
            }
            else if(flag2B == true && val < umbral){
                t2B = process.hrtime(t1B);
                flag1B = true;
                flag2B = false;
                var ms = (t2B[0] * 1000) + (t2B[1]/1000000);
                socket.emit('sensorB', { timeB: ms });
                
                console.log(ms + 'ms sensorB');
            }
        });

        socket.on('disconnect', function(){
            console.log('Client disconnected');
        });
    });
});

console.log('Waiting for connection');