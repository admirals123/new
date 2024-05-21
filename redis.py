apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: custom-resource-cleanup
spec:
  validationFailureAction: audit
  background: true
  rules:
    - name: cleanup-custom-resources
      match:
        resources:
          kinds:
            - CustomResourceDefinition
      preconditions:
        all:
          - key: "{{request.operation}}"
            operator: Equals
            value: CREATE
      generate:
        kind: CronJob
        name: cleanup-{{request.object.metadata.name}}
        namespace: default
        synchronize: true
        data:
          apiVersion: batch/v1beta1
          kind: CronJob
          metadata:
            name: cleanup-{{request.object.metadata.name}}
          spec:
            schedule: "0 */5 * * *"
            jobTemplate:
              spec:
                template:
                  spec:
                    containers:
                      - name: cleanup
                        image: bitnami/kubectl
                        command:
                          - /bin/sh
                          - -c
                          - |
                            kubectl delete customresourcedefinition {{request.object.metadata.name}}
                    restartPolicy: OnFailure