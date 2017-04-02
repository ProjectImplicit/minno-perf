#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;
const int led = 13;

const int KEY_FIRST = 65; // A
const int KEY_SECOND = 66; // B

unsigned long startTime;
unsigned long showTime;
unsigned long hideTime;

const int THRESHOLD = 50;
const int DELAYS_LENGTH = 2;
const unsigned long int DELAYS[] = {100000, 110000}; // 100ms the delay between keypresses
unsigned long int delayPointer = 9999; // high enough that it will automatically loop back down to 0

// machine states
const int CALIBRATE = 0;
const int LISTEN_SHOW = 1;
const int WAIT = 2;
const int LISTEN_HIDE = 3;
unsigned int state = CALIBRATE;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(swichPin, INPUT);
  pinMode(led, OUTPUT);
  
  // initialize control over the keyboard:
  Keyboard.begin();
}

void slowPrint(char chr, int wait){
  Keyboard.press(chr);
  delay(wait);
  Keyboard.releaseAll();
  delay(wait);      
}

void slowPrintLn(String str){  
  const int lngth = str.length();
  for (int i=0; i <= lngth; i++){
    slowPrint(str[i], 100);
  }
  slowPrint('\n', 1000);
}

void loop() {  
  if (digitalRead(swichPin) == LOW) {
    state = CALIBRATE;
  } else {
    unsigned long now = micros();
    switch (state) {
      case CALIBRATE:
        Keyboard.write(KEY_FIRST);
        startTime = now;
        state = LISTEN_SHOW;
        break;
      case LISTEN_SHOW:
        if (analogRead(sensorPin) > THRESHOLD) {
          showTime = now;
          state = WAIT;

          // update delay length
          delayPointer++;
          if (delayPointer >= DELAYS_LENGTH) delayPointer = 0; 
        }
        break;
      case WAIT:
        if (now - showTime >= DELAYS[delayPointer]) {
           Keyboard.write(KEY_SECOND);
           state = LISTEN_HIDE;
        }
        break;
      case LISTEN_HIDE:
        if (analogRead(sensorPin) < THRESHOLD) {                
          hideTime = now;
          delay(100); // let the client bring up the input
          // deltaShow, deltaHide, deltaDisplayed
          slowPrintLn(String(showTime - startTime) + ',' + String(hideTime - showTime) + ',' + String(DELAYS[delayPointer]));
          //Keyboard.print('\n'); // println isn't sending CR for some reason
          state = CALIBRATE;
        }
    }
  
  }

  digitalWrite(led, state == CALIBRATE ? LOW : HIGH);
}
