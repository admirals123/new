


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





DefaultAzureCredential simplifies Azure authentication by trying different methods in order:
 * Environment Variables: Checks for Azure credentials set as environment variables.
 * Managed Identity: Uses the identity assigned to an Azure resource (if running on one).
 * Shared Token Cache:  Looks for credentials in a shared cache (e.g., used by Visual Studio).
 * Interactive Login:  If none of the above work, prompts the user to log in interactively.
This allows your code to work seamlessly in different environments without manual credential configuration.
