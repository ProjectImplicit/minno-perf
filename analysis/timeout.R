options(width=260, digits=3) ## Show wide tables

## Add browser specific columns to opensesame files
toOpen <- function(open) merge(open, list( Browser='OpenSesame', Browser.Version='0.27.4', Short.Browser.Version='0.27', Engine=NA, Engine.Version=NA, OS='Ubuntu', OS.Version='16.04'))

###########
# timeout #
###########

# Set data directory.
dir.timeout <- file.path('..','timeout','results')

## Load all browser files
filenames <- list.files(dir.timeout, full.names = TRUE, pattern = '[0-9].csv$')
browser <- do.call('rbind', lapply(filenames, read.csv, header = TRUE,  colClasses = 'character'))

## load and prepare open sesame files
open <- read.csv(file.path(dir.timeout, 'open-timeout.csv'), header = TRUE, colClass = 'character')
open <- toOpen(open)
open <- merge(open, list(Measurement='OpenSesame'))

to <- rbind(browser, open)

to$delay <- as.numeric(to$delay)
to$latency <- as.numeric(to$latency)
to$diff <- to$latency-to$delay

## Now we can start looking at the data.
cat('\nTimeout crosstabs\n')
cat('#################\n\n')
aggregate(diff~delay+Browser+OS+Measurement, to, function(x) c(summary=summary(x), sd=sd(x)))


##################
# timeout-visual #
##################

# Set data directory.
dir.timeout <- file.path('..','timeout','results_visual')

## Load all browser files
filenames <- list.files(dir.timeout, full.names = TRUE, pattern = '[0-9].csv$')
browser <- do.call('rbind', lapply(filenames, read.csv, header = TRUE,  colClasses = 'character'))

## load and prepare open sesame files
open <- read.csv(file.path(dir.timeout, 'open-timeout-visual.csv'), header = TRUE, colClass = 'character')
open <- toOpen(open)
open <- merge(open, list(Measurement='OpenSesame'))
open$measuredto <- open$delay

to <- rbind(browser, open)

to$delay <- as.numeric(to$delay)
to$showlatency <- as.numeric(to$showlatency) / 1000
to$hidelatency <- as.numeric(to$hidelatency) / 1000
to$displaydiff <- to$hidelatency-to$delay

## Now we can start looking at the data.
cat('\nTimeoutvisual react time crosstabs (click -> show)\n')
cat(  '##################################\n\n')
aggregate(showlatency~delay+Browser+OS, to, function(x) c(summary=summary(x), sd=sd(x)))

cat('\nTimeoutvisual display time crosstabs (show->hide)\n')
cat('######################################\n\n')
aggregate(hidelatency~delay+Browser+OS, to, function(x) c(summary=summary(x), sd=sd(x)))
