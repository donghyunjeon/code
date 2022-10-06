var express  = require('express');

var app      = express();

var http     = require('http').Server(app);

var io       = require('socket.io')(http);

const path = require('path');

var SerialPort = require('serialport').SerialPort;

var ReadlineParser = require('@serialport/parser-readline').ReadlineParser;

var parsers    = SerialPort.parsers;

var fs = require('fs');
var multipart = require('connect-multiparty');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));


var sp = new SerialPort( {
  path:'COM4',
  baudRate: 9600
});

var parser = sp.pipe(new ReadlineParser({
  delimiter: '\r\n'
}));

var port = 3000;
sp.pipe(parser);
sp.on('open', () => console.log('Port open'));

app.use(express.static(__dirname + '/public'));
 
http.listen(port, function() {  // server.listen(port, function() {
    console.log('listening on *:' + port);
});

parser.on('data', function(data)
{
   console.log(data.toString());
   if(data.substring(0,3) == "led"){
      if(data.substring(3,4) == "1")   ledStatus = "on";
      else                     ledStatus = "off";
      
      io.emit('led', ledStatus);
      console.log('led status: ' + ledStatus);
   }

   else if(data.substring(0,3) == "adc"){
      adcValue = data.substring(3);
      io.emit('adc', adcValue);
      console.log('adc value: ' + adcValue);
   }
});

app.post('/test',function(req,res){
	console.log(req.body);
	res.redirect('/');
	
});

 
app.post('/eating',function(req,res){
	console.log(req.body);
	res.redirect('/');
	
});
app.get('/09_00',function(req,res)      // 버튼 클릭시
{
   sp.write('time9\n\r', function(err){
      if (err) {
            return console.log('Error on write: ', err.message);
        }
      
        console.log('send: setting 07:00');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('set 07:00\n');
   });
});

app.get('/13_00',function(req,res)
{
   sp.write('time13\n\r', function(err){
      if (err) {
            return console.log('Error on write: ', err.message);
        }

        console.log('send: setting 13:00');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('set 13:00\n');
   }); 
});

app.get('/19_00',function(req,res)
{
   sp.write('time19\n\r', function(err){
      if (err) {
            return console.log('Error on write: ', err.message);
        }

        console.log('send: setting 19:00');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('set 19:00\n');
   }); 
});