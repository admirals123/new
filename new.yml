using System;
using Azure.Messaging.ServiceBus;

public class ConnectToASBWithManagedIdentity
{
    // Replace with your Service Bus namespace endpoint
    private static readonly string fullyQualifiedNamespace = "<your-service-bus-namespace>.servicebus.windows.net";

    public static async Task Main(string[] args)
    {
        // Use DefaultAzureCredential to acquire token from managed identity
        var credential = new DefaultAzureCredential();

        // Create a Service Bus client using the credential and namespace endpoint
        var serviceBusClient = new ServiceBusClient(fullyQualifiedNamespace, credential);

        // You can now use the serviceBusClient to send or receive messages

        Console.WriteLine("Connected to Azure Service Bus using managed identity!");

        // Close the connection
        await serviceBusClient.DisposeAsync();
    }
}
