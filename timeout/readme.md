### Experiment 3 - Can timers be trusted?
Timers in javascript are notorious for being inaccurate.
The inaccuracy stems from two things: first, browsers update their internal timer only at specific intervals, therefore timeouts can only trigger on these intervals.
This is especially problematic on windows (older windows?) where the polling occurs only every 15ms or so.
The second problem is that javascript is sensitive to background activity, and external tasks may grab the time where a timeout was supposed to fire.

In this experiment the player will trigger a timeout after a predefined period of 50/150/300 ms, and measure the logged duration.
In addition, the same experiment will be repeated in vanilla JavaScript in order to establish if any lag is the result of browser limitations or the player design.
