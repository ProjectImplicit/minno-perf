/*
 * This is a sanity check for the player.
 *
 * Just measure the latency between two consecutive keypresses.
 * Any delay at all here is a point of concern because it points to a lack of accuracy in the system clock
 * Response latency should be equal for the first and second keypresses.
 *
 * In order to activate this sketch, load it into your arduino.
 * Use the switch to activatae or deactivate the task.
 * You will see the led go on when the player is sending keystrokes.
 * 
 * The task should send a series of consecutive keypresses of either 'A' or 'B'
 * The measured delay between them should be exactly 100ms
 * ITI is 150ms
 *
 */

#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;

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
          state = WAIT;

          // update delay length
          delayPointer++;
          if (delayPointer >= DELAYS_LENGTH) delayPointer = 0; 
        }
        break;
      case WAIT:
        if (now - startTime >= DELAYS[delayPointer]) {
           Keyboard.write(KEY_SECOND);
           state = LISTEN_HIDE;
        }
        break;
      case LISTEN_HIDE:
        if (analogRead(sensorPin) < THRESHOLD) {                
          hideTime = now;
          delay(100); // let the client bring up the input
          // deltaShow, deltaHide, deltaDisplayed
          Keyboard.print(String(showTime - startTime) + ',' + String(hideTime - showTime) + ',' + String(DELAYS[delayPointer]));
          Keyboard.print('\n'); // println isn't sending CR for some reason
          delay(100);
          state = CALIBRATE;
        }
    }
  
  }

  digitalWrite(LED_BUILTIN, state == CALIBRATE ? LOW : HIGH);
}
