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
unsigned long endTime;
boolean inProgress = false;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(swichPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  
  // initialize control over the keyboard:
  Keyboard.begin();
}

void loop() {
  if (digitalRead(swichPin) == HIGH) {
    digitalWrite(LED_BUILTIN, HIGH);

    if (!inProgress) {
        Keyboard.press(KEY_FIRST);
        startTime = micros();
        inProgress = true;
        delay(1);
        Keyboard.release(KEY_FIRST);
    }

    if (digitalRead(sensorPin) == HIGH) {
      Keyboard.press(KEY_SECOND);
      endTime = micros();
      delay(1);
      Keyboard.release(KEY_SECOND);      
      delay(400);
      Keyboard.println(endTime - startTime);
      Keyboard.press(KEY_RETURN);
      delay(150);
      Keyboard.releaseAll();
      inProgress = false;
    }
  } else {
    inProgress = false;
    digitalWrite(LED_BUILTIN, LOW); 
  }
}
