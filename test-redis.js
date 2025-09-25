apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  namespace: ns-gwam-vonne-dev
spec:
  containers:
  - name: test-container
    image: caksprodaccacr.azurecr.io/ns-gwam-dotnet-sb-helloworld:d19f713ae31b375285dca7f1196c74d2b3f6c-882b37772-138  # Replace with your approved registry
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "200m"
        memory: "256Mi"
    volumeMounts:
    - name: pvc-volume
      mountPath: "/mnt/data"  # Adjust this path as needed
  volumes:
  - name: pvc-volume
    persistentVolumeClaim:
      claimName: your-pvc-name  # Replace with your actual PVC name
  restartPolicy: Always