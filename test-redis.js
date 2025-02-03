apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: my-release
  namespace: my-namespace
spec:
  interval: 5m
  releaseName: my-release
  chart:
    spec:
      chart: ./my-chart # Path to your Helm chart
      sourceRef:
        kind: GitRepository
        name: my-repo
        namespace: my-namespace
        
  values:
    # ... other values

    # Existing Secret Configuration (from your screenshot)
    ns-gwam-crweb-dev-etsext:
      flux:
        enabled: true
        url: ssh://git@github.com/mfc-gwam-tenantops/gitops-crweb-ets-tenant.git
        path: ./clusters/cac-dev
        ref:
          branch: main
        intervals:
          common: 5m
        secret:
          name: flux-deploy-key
          eso:
            enabled: true
            secretStoreName: "gwam-crweb-devcac"
            remoteRefKeyName: flux-deploy-key
            refreshInterval: "1m"
        customRole:
          enabled: true
          kind: ClusterRole
          name: deploy-flux
      namespace:
        create: false
        labels:
          istio-injection: enabled
          azure-key-vault-env-injection: enabled
          kubecost: ready
          costcenter: "6473"
      quotas:
        resourceQuota:
          enabled: true
          limits:
            cpu: "65" # Added quotes for consistency
            memory: 50Gi
          requests:
            cpu: "9" # Added quotes for consistency
            memory: 16Gi
      secret:
        eso:
          azureKeyVault:
            enabled: true
            managedIdentityClientID: 153cb45d-dea9-486a-92cf-4f3a4b4fff3b
            secretStoreName: "gwam-crweb-devcac"
            keyVaultURL: "https://gwam-crweb-devcac.vault.azure.net/"

    # New Extra Secret Configuration (added)
    extraSecretConfig:
      enabled: true # Enable this section if needed
      # You can choose different secret stores here
      # For example, using a generic secret:
      secretName: "my-extra-secret" 
      secretValue: "my-extra-value"
      # Or using Azure Key Vault again with a different store:
      # azureKeyVault:
      #   enabled: true
      #   managedIdentityClientID: <new-client-id>
      #   secretStoreName: "my-new-azure-kv-store" # New store name
      #   keyVaultURL: "https://<new-keyvault-name>.vault.azure.net/" 
      # Or using AWS Secrets Manager:
      # awsSecretsManager:
      #   enabled: true
      #   region: "us-east-1"
      #   secretName: "my-aws-secret"


Key Changes and Explanations:
 * extraSecretConfig Section Added: This new section allows you to configure an additional secret source.  It's placed under the values section of your HelmRelease.
 * Flexibility in Secret Store Type: Inside extraSecretConfig, you have the flexibility to choose which type of secret store you want to use.  I've provided examples for:
   * Generic Secret:  A simple secretName and secretValue for non-sensitive or test data.
   * Azure Key Vault (again): Shows how to configure a different Azure Key Vault store (you'll need a new secretStoreName, managedIdentityClientID, and keyVaultURL).
   * AWS Secrets Manager:  An example of how to configure AWS Secrets Manager.
 * Choose One Configuration:  Important:  You should only uncomment and configure one of the secret store options (generic, Azure, or AWS) within extraSecretConfig at a time, depending on your needs.
 * New SecretStore Definition (If Needed): If you are using a different Azure Key Vault or AWS Secrets Manager, you will need to define a corresponding SecretStore resource in your Kubernetes cluster.  Refer to my previous response for examples of how to define SecretStore resources for Azure and AWS.  The secretStoreName in your Helm values must match the name of a SecretStore resource in your cluster.
 * HelmRelease Structure: The YAML is now structured as a HelmRelease. This is the recommended way to manage Helm chart deployments with Flux.  Make sure you have a GitRepository resource defined for your Helm chart source.
How to Use:
 * Create the SecretStore (if needed): If you are using a new Azure Key Vault or AWS Secrets Manager, create the corresponding SecretStore resource in your Kubernetes cluster.
 * Update Helm Values:  Modify the extraSecretConfig section in the Helm values to match your desired secret store and configuration.
 * Deploy with Flux: Commit the changes to your Git repository, and Flux will automatically deploy or update your Helm release.
Remember to replace placeholder values like <new-client-id>, <new-keyvault-name>, my-aws-secret, etc., with your actual values.  Also, ensure that the necessary permissions are in place for Flux to access the secret stores.

