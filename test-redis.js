apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: azurekeyvaultsecrets.spv.no
spec:
  group: spv.no
  versions:
    - name: v2beta1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                vaultName:
                  type: string
                secretName:
                  type: string
                tenantId:
                  type: string
              required:
                - vaultName
                - secretName
                - tenantId
  scope: Namespaced
  names:
    plural: azurekeyvaultsecrets
    singular: azurekeyvaultsecret
    kind: AzureKeyVaultSecret
    shortNames:
      - akvs