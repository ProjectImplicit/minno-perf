### Experiment 3 - Can timers be trusted?
Timers in javascript are notorious for being inaccurate.
The inaccuracy stems from two things: first, browsers update their internal timer only at [specific intervals](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified),
therefore timeouts can only trigger on these intervals .
This is especially problematic on windows (older windows?) where the polling occurs only every 15ms or so.
The second problem is that javascript is sensitive to background activity,
and external tasks may grab the time where a timeout was supposed to fire.

# experiment 1
This experiment lets a player measure its own timeout latency.
In this experiment the player will trigger a timeout after a predefined period of 50/150/300 ms, and measure the logged duration.
In addition to testing minno, the same experiment will be repeated in vanilla JavaScript. 
This is done in order to establish if lag is the result of browser limitations or the player design.

The fields for the csv in this experiment are as follows:

Name            | Source    | Units  | Description
--------------- | --------- | ------ | -----------
Measurement     | player    | String | The name of the measure (minno|vanilla)
delay           | player    | ms     | The length of the timeout as set in the player
latency         | player    | ms     | The measured latency of the delay

The results can be found in the [results1 folder](./results1)
The `Measurement` field does not exist in the [opensesame file](./results1/open-timeout.csv).
