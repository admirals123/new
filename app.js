apiVersion: batch/v1
kind: CronJob
metadata:
  name: pipelinerun-cleanup
spec:
  schedule: "0 */12 * * *" # Run every 12 hours
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cleanup
            image: bitnami/kubectl # Use a suitable kubectl image
            args:
            - delete
            - pipelinerun
            - --all
            - --field-selector=metadata.creationTimestamp<$(date -d '12 hours ago' +%Y-%m-%dT%H:%M:%SZ) 
          restartPolicy: OnFailure
