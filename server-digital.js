// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io = require('socket.io')(httpServer);

var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port, function(){
    console.log('Server available at http://localhost:' + port);  
});  


/*
    Esta version lee constantemente los pines digitales 7 y 8.
    Esto lo hace mediante la funcion ard.digitalRead.
*/

//Arduino board connection
var board = new five.Board();  

board.on("ready", function() {  

    // Referencia a la placa
    var ard = this;

    console.log('Arduino connected');

    ard.pinMode(7, five.Pin.INPUT);
    ard.pinMode(8, five.Pin.INPUT);

    // Socket connection handler
    io.on('connection', 
        function (socket) {
        console.log('Client connected. Socket ID: ' + socket.id);

        // Variables para Sensor A
        var t1A, t2A, flag1A = true, flag2A = false;

        // Variables para Sensor B
        var t1B, t2B, flag1B = true, flag2B = false;

        // Funcion para calcular tiempo de obstruccion del sensor A
        ard.digitalRead(7, function(value){
            // Preguntamos si el valor del pin digital 7 esta en HIGH
            if(flag1A == true && value == 1){
                t1A = process.hrtime();
                flag1A = false;
                flag2A = true;
            }
            // Preguntamos si el valor del pin digital 7 esta en LOW
            else if(flag2A == true && value == 0){
                t2A = process.hrtime(t1A);
                flag1A = true;
                flag2A = false;
                var ms = (t2A[0] * 1000) + (t2A[1]/1000000);
                socket.emit('sensorA', { timeA: ms });
                
                console.log(ms + 'ms sensorA');
            }
        });

        // Funcion para calcular tiempo de obstruccion del sensor B
        ard.digitalRead(8, function(value){
            // Preguntamos si el valor del pin digital 8 esta en HIGH
            if(flag1B == true && value == 1){
                t1B = process.hrtime();
                flag1B = false;
                flag2B = true;
            }
            // Preguntamos si el valor del pin digital 8 esta en LOW
            else if(flag2B == true && value == 0){
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