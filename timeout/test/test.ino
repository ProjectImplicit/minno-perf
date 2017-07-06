#include "Keyboard.h"

const int swichPin = 4;
const int sensorPin = 0;

const int KEY_FIRST = 65; // A

unsigned long startTime;
unsigned long endTime;

const int THRESHOLD = 700;

// machine states
const int CALIBRATE = 0;
const int ON = 1;
const int OFF = 2;
unsigned int state = CALIBRATE;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(swichPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  
  Serial.begin(9600);
}


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
    //int val = analogRead(sensorPin);
    int val = averageRead();
    //Serial.println((val > 15 ? "ON - " : "OFF - ") + String(val));
    Serial.println(val);
  }

  digitalWrite(LED_BUILTIN, state == CALIBRATE ? LOW : HIGH);
}
