#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;

const int KEY_FIRST = 65; // A
const int KEY_SECOND = 66; // B

unsigned long startTime;
unsigned long showTime;
unsigned long hideTime;

const int THRESHOLD = 700;
const int DELAYS_LENGTH = 2;
const unsigned long int DELAYS[] = {300000, 700000}; // the delay from seeing the stim to response
unsigned int delayPointer = 99; // high enough that it will automatically loop back down to 0

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

void slowPrint(char chr, int wait){
  Keyboard.press(chr);
  delay(wait);
  Keyboard.releaseAll();
  delay(wait);      
}

void slowPrintLn(String str){  
  const int lngth = str.length();
  for (int i=0; i <= lngth; i++){
    slowPrint(str[i], 5);
  }
  slowPrint('\n', 200);
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
          state = WAIT;

          // update delay length
          delayPointer++;
          if (delayPointer >= DELAYS_LENGTH) delayPointer = 0; 
        }
        break;
      case WAIT:
        if (now >= showTime + DELAYS[delayPointer]) {
           Keyboard.write(KEY_SECOND);
           state = LISTEN_HIDE;
        }
        break;
      case LISTEN_HIDE:
        if (averageRead() < THRESHOLD) {
          hideTime = now;
          delay(100); // let the client bring up the input
          slowPrintLn(String(showTime - startTime) + ',' + String(hideTime - showTime));
          state = CALIBRATE;
        }
    }  
  }

  digitalWrite(LED_BUILTIN, state == CALIBRATE ? LOW : HIGH);
}
