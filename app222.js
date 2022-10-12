var parserNumber = 0;
var postNumber = 0;
var arrNumber = new Array();
var setHours = new Array();
var setMinutes = new Array();
var setSeconds = 0;
var flag = 0;
var setting1 = 0;
var setting2 = 0;
var setting3 = 0;

var input1;
var input2;
var input3;

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
  path:'/dev/ttyUSB0',
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

var pythonShell = require('python-shell');
var options = {
mode: 'text',
pythonPath: '',
pythonOptions: ['-u'],
scriptPath: '',
args: ['value1', 'value2', 'value3']
};
//pythonShell.PythonShell.run('yolo_uvc2.py', options, function(err, results) {
// if(err) console.log(err);
// else console.log(results);
//
//});

parser.on('data', function(data)
{
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

for (var i=0; i<3; ++i) {

if (setting1==0 && hours==setHours[i] && minutes==setMinutes[i] && seconds==setSeconds) { // 3가지 경우 추가
setting1 = 1;

sp.write('time8\n\r', function(err){
if (err) {
return console.log('Error on write: ', err.message);
}
console.log('부저');
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('set 07:00\n');
});

pythonShell.PythonShell.run('yolo_uvc2.py', options, function(err, results) {
if(err) console.log(err);
else console.log(results);
input = 1;
io.emit('time', input);
setting1 = 2;

});
}
else if (setting1==2 && setting2==0 && hours==setHours[i] && minutes==setMinutes[i] && seconds==setSeconds) { // 3가지 경우 추가
setting2 = 1;

sp.write('time8\n\r', function(err){
if (err) {
return console.log('Error on write: ', err.message);
}
console.log('부저');
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('set 07:00\n');
});

pythonShell.PythonShell.run('yolo_uvc2.py', options, function(err, results) {
if(err) console.log(err);
else console.log(results);
input = 1;
io.emit('time', input);
setting2 = 2;

});
}
else if (setting1==2 && setting2==2 && setting3==0 && hours==setHours[i] && minutes==setMinutes[i] && seconds==setSeconds) { // 3가지 경우 추가
setting3 = 1;

sp.write('time8\n\r', function(err){
if (err) {
return console.log('Error on write: ', err.message);
}
console.log('부저');
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('set 07:00\n');
});

pythonShell.PythonShell.run('yolo_uvc2.py', options, function(err, results) {
if(err) console.log(err);
else console.log(results);
input = 1;
io.emit('time', input);
setting3 = 2;

});
}

}


if (flag == 1 && parserNumber==0 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) { // 3가지 경우 추가
flag = 0;
input1 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag1', input1);

parserNumber++;
}
else if (flag == 1 && parserNumber==1 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) {
flag = 0;
input2 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag2', input1, input2);

parserNumber++;
}
else if (flag == 1 && parserNumber==2 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) {
flag = 0;
input3 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag3', input1, input2, input3);

parserNumber++;
}
else {

}

});


app.post('/test',function(req,res){ // 3가지 경우 추가
if(postNumber<3){
arrNumber[postNumber] = req.body;
console.log(arrNumber[postNumber]);

x = JSON.stringify(arrNumber[postNumber]);
x = x.toString();
 
setHours[postNumber] = parseInt(x.substring(9,11));
setMinutes[postNumber] = parseInt(x.substring(12,14));
 
flag = 1;
postNumber++;
 
res.redirect('/');
}
else {

}
   
});

app.get('/morning',function(req,res)      // 버튼 클릭시
{
sp.write('time9\n\r', function(err){
if (err) {
return console.log('Error on write: ', err.message);
}
console.log('밥먹자 애기야');

res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('set 07:00\n');
});
});
