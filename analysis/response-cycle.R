options(width=260, digits=3) ## Show wide tables

## Add browser specific columns to opensesame files
toOpen <- function(open) merge(open, list( Browser='OpenSesame', Browser.Version='2.9.7', Short.Browser.Version='2', Engine=NA, Engine.Version=NA, OS='Mac OS', OS.Version='10.11.6'))

###########
# timeout #
###########

# Set data directory.
dir.timeout <- file.path('..','response-cycle','results')

## Load all browser files
filenames <- list.files(dir.timeout, full.names = TRUE, pattern = '[0-9].csv$')
browser <- do.call('rbind', lapply(filenames, read.csv, header = TRUE,  colClasses = 'character'))

## load and prepare open sesame files
open <- read.csv(file.path(dir.timeout, 'open-response.csv'), header = TRUE, colClass = 'character')
open <- toOpen(open)
open <- merge(open, list(Measurement='OpenSesame'))

to <- rbind(browser, open)

to$showlatency <- as.numeric(to$showlatency) / 1000
to$hidelatency <- as.numeric(to$hidelatency) / 1000
to$delay <- as.numeric(to$delay) / 1000
to$diff <- to$hidelatency - to$delay
to$clean.diff <- to$hidelatency - to$delay - to$showlatency

## Now we can start looking at the data.
cat('\nresponse-cycle display time crosstabs\n')
cat(  '#################################\n\n')
aggregate(diff~delay+Browser+OS+Measurement, to, function(x) c(summary=summary(x), sd=sd(x)))

cat('\nresponse-cycle display time crosstabs (clean showlatency)\n')
cat(  '#################################\n\n')
aggregate(clean.diff~delay+Browser+OS+Measurement, to, function(x) c(summary=summary(x), sd=sd(x)))
