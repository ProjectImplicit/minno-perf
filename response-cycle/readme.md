## Response times

We use the arduino to keypress twice, once to setup the experiment, the second a set time (`delay`) after stimulus presentation.
The player displays a stimulus at the first keypress, and hides it at the second keypress.
The arduino measures the time it takes from the initial keypress to the display of the stimulus (`showlatency`).
It also measures the time from the moment the stimulus was displayed to the moment it is hidden (`hidelatency`).
The player measures the time between keypressed (`playerlatency`).

![diagram](./response1.png)

The arrows in the diagram represent the various measures as described in the following table:

Name            | Source    | Units | Description
--------------- | --------- | ----- | -----------
showlatency     | arduino   | us    | The latency between the first keypress and the appearance of the stimulus.
hidelatency     | arduino   | us    | The latency between the appearance of the stimulus and its dissapearance.
delay           | arduino   | us    | The delay from stimulus display to the second keypress as set for this trial.
playerlatency   | player    | ms    | The latency between the first and second keypress.

The results can be found in the [results](./results) folder.
The files are each a csv file with the content of the result of a single browser.
The results for OpenSesame can be found in [open-response.csv](./results/open-response.csv).

Notably, we needed a version of the arduino script with some additional delay to deal with the slowness of OpenSessame.
