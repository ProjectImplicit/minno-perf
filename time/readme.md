### Experiment 1: - Javascript timers (a sanity check)

We measure the accuracy of the javascript clock.
Inaccuracies to the clock can be caused either by timer sampling or by background process blocking the browser.
Timer sampling [should]() have a resolution of 4ms (but see [John Resig](http://ejohn.org/blog/accuracy-of-javascript-time/),  [Head player](https://www.headlondon.com/article/the-accuracy-of-javascript-timing) - though I hope it is outdated by now).

In this experiment the arduino keypresses twice with a delay of 100ms.
The player measures the time between the keypresses.
The latency caused by the keypress itself should be canceled between the first and second keypresses.
Variance in the results can be caused by variability either in keypress latency or clock accuracy.

#### results
Results can be found in the [results](./results) folder.

The fields for the csv in this experiment are as follows:

Name            | Source    | Units  | Description
--------------- | --------- | ------ | -----------
Measurement     | player    | String | The name of the measure (minno|vanilla)
latency         | player    | ms     | The measured latency of the delay
