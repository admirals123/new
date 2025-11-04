SELECT average(cpuUsedCores) AS 'Avg CPU Usage (cores)',
       average(memoryUsedBytes) / 1073741824 AS 'Avg Memory Usage (GiB)'
FROM K8sContainerSample
WHERE clusterName = 'your-dev-cluster-name'
FACET podName, containerName
SINCE 7 days ago