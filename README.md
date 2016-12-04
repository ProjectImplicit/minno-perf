# minno-perf
Performance test for minno

This repository holds the tests for minno response time player.
Test require an arduino controler. And infrastructure to run minno scripts as well as open-sessame scripts.
You can find the plans to the arduino controlore in the [hardware](hardware) folder.

Experiments each have a folder of its own.

Folder                      | Description
-------                     | -----------
[time](time)                | A sanity test just to see how accurate the browser clock is.
[frame-rate](frame-rate)    | Figure out the measuring errors caused by screen frame rate.
[timeout](timeout)          | Test accuracy of timeouts
