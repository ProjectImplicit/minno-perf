#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;

const int KEY_FIRST = 65; // A

unsigned long startTime;
unsigned long showTime;
unsigned long hideTime;

const int THRESHOLD = 8;

// machine states
const int CALIBRATE = 0;
const int LISTEN_SHOW = 1;
const int LISTEN_HIDE = 2;
unsigned int state = CALIBRATE;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(swichPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  
  Keyboard.begin();
}

/*
 * Apparently screens change intensity quite a lot when they are lit
 * This is what we've found represents a reliable change in read.
 * It takes about 1.5ms to run, but this is a price we must accept...
 */
int averageRead(){
  const int ROUNDS = 15;
  int sum = 0;
  for (int i = 0; i<ROUNDS;i++) sum += analogRead(sensorPin);
  return (int) sum / ROUNDS;
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
        if (averageRead() > THRESHOLD) {
          showTime = now;          
          state = LISTEN_HIDE;          
        }
        break;
      case LISTEN_HIDE:
        if (averageRead() < THRESHOLD) {
          hideTime = now;
          delay(120); // let the client bring up the input
          Keyboard.print(String(showTime - startTime) + ',' + String(hideTime - showTime));
          Keyboard.print('\n'); // println isn't sending CR for some reason
          delay(120);
          state = CALIBRATE;
        }
    }
  }

  digitalWrite(LED_BUILTIN, state == CALIBRATE ? LOW : HIGH);
}
