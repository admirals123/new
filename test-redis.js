FROM Metric
SELECT average(vpa_%.value)
FACET namespace, podName, containerName, metricName
WHERE namespace IS NOT NULL
TIMESERIES
