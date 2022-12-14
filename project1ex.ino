const unsigned int potPin = 10;

#include <Servo.h>  //
Servo myservo;  //
int pos = 0;    // 서보각도 저장값
int flag = 0;
int BUZZER = 10;

String  inputString    = "";
boolean stringComplete = false;

void setup() {
  Serial.begin(9600);
  inputString.reserve(10);
  pinMode(BUZZER,OUTPUT);
  myservo.attach(9);  // 9번핀 서보연결
}

void loop() {
  unsigned int adcVal = analogRead(potPin);

  Serial.print("flag : ");   Serial.println(flag);

  if(stringComplete) 
  {
    if(inputString.substring(0,4) == "time")
    {
      if (inputString.substring(4,5) == "9"){
          for (pos = 0; pos <= 180; pos += 1) { 
           myservo.write(pos);                   
           delay(5);                           
          }
  
          delay(1000);  
          myservo.write(0);                                    
      }
      else if (inputString.substring(4,5) == "8") {
          tone(BUZZER,262);
          delay(1000);  
          noTone(BUZZER);

      }
        
   }
    Serial.println(inputString);
    inputString = "";
    stringComplete = false;
  }
  delay(1000);
}

void serialEvent() {
  while (Serial.available() > 0) {
    char inChar = Serial.read();
    inputString = inputString + inChar;
    if(inChar == '\n') stringComplete = true;
  }
}
