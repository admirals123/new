using Azure.Identity;
using Azure.Messaging.ServiceBus;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        ServiceBusClient client; // Declare the client variable
        ServiceBusSender sender; // Declare the sender variable

        // TODO: Replace the <NAMESPACE-NAME> placeholder
        string fullyQualifiedNamespace = "<NAMESPACE-NAME>.servicebus.windows.net";

        // Create a new instance of the ManagedIdentityCredential class
        ManagedIdentityCredential managedIdentityCredential = new ManagedIdentityCredential();

        // Create a new instance of ServiceBusClient using ManagedIdentityCredential
        client = new ServiceBusClient(fullyQualifiedNamespace, managedIdentityCredential);

        // Create a new instance of ServiceBusSender
        // TODO: Replace the <QUEUE-NAME> placeholder
        sender = client.CreateSender("<QUEUE-NAME>");

        try
        {
            // Prepare a message
            ServiceBusMessage message = new ServiceBusMessage("Hello, Service Bus!");

            // Send the message to the queue
            await sender.SendMessageAsync(message);

            Console.WriteLine("Message sent successfully!");
        }
        finally
        {
            // Calling DisposeAsync on client types is required to ensure that network
            // resources and other unmanaged objects are properly cleaned up.
            await sender.DisposeAsync();
            await client.DisposeAsync();
        }
    }
}
