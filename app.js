using Azure.Identity;
using Azure.Messaging.ServiceBus;

namespace AsbManagedIdentityDemo
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Replace with your actual Service Bus namespace
            string serviceBusNamespace = "your-service-bus-namespace.servicebus.windows.net";
            string queueName = "your-queue-name";

            // Create a ServiceBusClient using DefaultAzureCredential for managed identity
            var credential = new DefaultAzureCredential();
            var client = new ServiceBusClient(serviceBusNamespace, credential);

            // Create a sender
            var sender = client.CreateSender(queueName);

            // Send a message
            string messageBody = "Hello, Azure Service Bus!";
            var message = new ServiceBusMessage(messageBody);
            await sender.SendMessageAsync(message);

            Console.WriteLine("Message sent!");

            // Close the client
            await client.DisposeAsync();
        }
    }
}
