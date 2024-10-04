SELECT average(queueSize) FROM SyntheticCheck WHERE monitorName = 'Your Monitor Name' FACET locationLabel SINCE 1 hour AGO
