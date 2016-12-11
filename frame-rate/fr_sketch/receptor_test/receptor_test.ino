/*
   This is a sanity check for the player.

   Just measure the latency between two consecutive keypresses.
   Any delay at all here is a point of concern because it points to a lack of accuracy in the system clock
   Response latency should be equal for the first and second keypresses.

   In order to activate this sketch, load it into your arduino.
   Use the switch to activatae or deactivate the task.
   You will see the led go on when the player is sending keystrokes.

   The task should send a series of consecutive keypresses of either 'A' or 'B'
   The measured delay between them should be exactly 100ms
   ITI is 150ms

*/

const int sensorPin = 0;
int val = 0;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
//  Serial.println(analogRead(sensorPin)); //Write the value of the photoresistor to the serial monitor.
//  delay(100); //short delay for faster response to light.

  val = digitalRead(sensorPin);
  digitalWrite(LED_BUILTIN, val);
}
