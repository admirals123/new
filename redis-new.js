# Role
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kyverno-cronjob-creator
  namespace: default
rules:
- apiGroups: ["batch"]
  resources: ["cronjobs"]
  verbs: ["create"]

# RoleBinding
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kyverno-cronjob-creator-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: kyverno-background-controller
  namespace: kyverno
roleRef:
  kind: Role
  name: kyverno-cronjob-creator
  apiGroup: rbac.authorization.k8s.io
