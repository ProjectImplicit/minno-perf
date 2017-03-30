options(width=260, digits=3) ## Show wide tables

## Add browser specific columns to opensesame files
toOpen <- function(open) merge(open, list( Browser='OpenSesame', Browser.Version='2.9.7', Short.Browser.Version='2', Engine=NA, Engine.Version=NA, OS='Mac OS', OS.Version='10.11.6'))

###########
# timeout #
###########

# Set data directory.
dir.timeout <- file.path('..','time','results')

## Load all browser files
filenames <- list.files(dir.timeout, full.names = TRUE, pattern = '[0-9].csv$')
browser <- do.call('rbind', lapply(filenames, read.csv, header = TRUE,  colClasses = 'character'))

## load and prepare open sesame files
open <- read.csv(file.path(dir.timeout, 'open-time.csv'), header = TRUE, colClass = 'character')
open <- toOpen(open)
open <- merge(open, list(Measurement='OpenSesame'))

to <- rbind(browser, open)

to$latency <- as.numeric(to$latency)

## Now we can start looking at the data.
cat('\nTime crosstabs\n')
cat(  '##############\n\n')
aggregate(latency~Browser+Measurement, to, function(x) c(summary=summary(x), sd=sd(x)))
