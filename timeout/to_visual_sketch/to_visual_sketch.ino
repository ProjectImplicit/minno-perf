#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;

const int KEY_FIRST = 65; // A

unsigned long startTime;
unsigned long showTime;
unsigned long hideTime;

const int THRESHOLD = 50;

// machine states
const int CALIBRATE = 0;
const int LISTEN_SHOW = 1;
const int LISTEN_HIDE = 2;
unsigned int state = CALIBRATE;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(swichPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  
  // initialize control over the keyboard:
  Keyboard.begin();
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
          delayMicroseconds(500);
          if (analogRead(sensorPin) > THRESHOLD) { // make sure that this stimulus is solid
            state = LISTEN_HIDE;
          }
        }
        break;
      case LISTEN_HIDE:
        if (analogRead(sensorPin) < THRESHOLD) {                
          hideTime = now;
          delay(100); // let the client bring up the input
          // deltaShow, deltaHide, deltaDisplayed
          Keyboard.print(String(showTime - startTime) + ',' + String(hideTime - showTime));
          Keyboard.print('\n'); // println isn't sending CR for some reason
          delay(100);
          state = CALIBRATE;
        }
    }
  }

  digitalWrite(LED_BUILTIN, state == CALIBRATE ? LOW : HIGH);
}
