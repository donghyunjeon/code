var parserNumber = 0;
var postNumber = 0;
var arrNumber = new Array();
var setHours = new Array();
var setMinutes = new Array();
var setSeconds = 0;
var flag = 0;
var setting = 0;

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

if (setting==0 && hours==setHours[i] && minutes==setMinutes[i] && seconds==setSeconds) { // 3가지 경우 추가
setting = 1;

pythonShell.PythonShell.run('yolo_uvc2.py', options, function(err, results) {
if(err) console.log(err);
else console.log(results);
input = 1;
io.emit('time', input);

});


}

}


if (flag == 1 && parserNumber==0 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) { // 3가지 경우 추가
input1 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag1', input1);

flag = 0;
parserNumber++;
}
else if (flag == 1 && parserNumber==1 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) {
input2 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag2', input1, input2);

flag = 0;
parserNumber++;
}
else if (flag == 1 && parserNumber==2 && setHours[parserNumber]!=null && setMinutes[parserNumber]!=null) {
input3 = String(setHours[parserNumber] + "시" + setMinutes[parserNumber] + "분");
io.emit('flag3', input1, input2, input3);

flag = 0;
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

app.get('/eating',function(req,res){
console.log(req.body);
res.redirect('/');

});
app.get('/morning',function(req,res)      // 버튼 클릭시
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
