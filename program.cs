using System;
using Azure.Identity;
using Azure.Messaging.ServiceBus;

namespace ManagedIdentityExample
{
    class Program
    {
        static void Main(string[] args)
        {
            // 1. Create a ServiceBusClient using the DefaultAzureCredential
            DefaultAzureCredential credential = new DefaultAzureCredential();
            string serviceBusConnectionString = "Endpoint=sb://<your-service-bus-namespace>.servicebus.windows.net/;EntityPath=<your-queue-name>";
            ServiceBusClient client = new ServiceBusClient(serviceBusConnectionString, credential);

            // 2. Create a sender or receiver using the client
            ServiceBusSender sender = client.CreateSender("<your-queue-name>");

            // 3. Send a message using the sender
            string messageBody = "Hello from managed identity!";
            ServiceBusMessage message = new ServiceBusMessage(messageBody);
            sender.SendMessageAsync(message);
            Console.WriteLine($"Sent message: {messageBody}");

            // 4. Close the client and sender to clean up resources
            sender.Close
