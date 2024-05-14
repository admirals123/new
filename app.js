apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kyverno-cleanup-pods-binding
subjects:
- kind: ServiceAccount
  name: kyverno-cleanup-controller # Replace with your actual service account name
  namespace: kyverno
roleRef:
  kind: ClusterRole
  name: kyverno-cleanup-pods
  apiGroup: rbac.authorization.k8s.io
