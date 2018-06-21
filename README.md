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


### Results

Results for each experiment can be found in the results folder. 
The results are recorded in a separate csv file for each player (each combination of OS & browser is considered a separate player as well os OpenSesame).
OpenSesame files are always prefixed with `open` such as `open-time.csv`.
Minno files are named according to the browser and the following scheme: `{Browser}-{Browser Version}-{OS}-{timestamp}.csv`.

All measurements have common columns describing the hardware and software used to run the test.
Additional columns describe the measurements of each experiment as described in the documuntation.

Following are the common fields:

Column                  | Description
----------------------- | -----------
Browser                 | The browser name (i.e. Firefox)
Browser Version         | Full browser version (i.e. 50.0)
Short Browser Version   | First section of browser version (i.e. 50)
Engine                  | Javascript engine for this browser (i.e. WebKit)
Engine Version          | JS engine version (i.e. 537.36)
OS                      | Operating system (i.e. Mac OS)
OS Version              | Operating system version (i.e. 10.11.6)

Uniquly, open sesame files hold only the measured columns and not the descriptive columns.
The OpenSesame version that was used was OpenSesame version 2.9.7 on Mac OS V10.11.6

### Analysis
Analysis was preformed using [R statistics](www.r-project.org).
The analysis files can be found in the [analysis](analysis) folder.
