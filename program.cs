// The Service Bus client types are safe to cache and use as a singleton for the lifetime
// of the application, which is best practice when messages are being published or read
// regularly.
//
// Set the transport type to AmqpWebSockets so that the ServiceBusClient uses port 443. 
// If you use the default AmqpTcp, make sure that ports 5671 and 5672 are open.

// TODO: Replace the <NAMESPACE-NAME> placeholder
var clientOptions = new ServiceBusClientOptions()
{
    TransportType = ServiceBusTransportType.AmqpWebSockets
};

// Replace "<NAMESPACE-NAME>" with your Service Bus namespace name
string fullyQualifiedNamespace = "<NAMESPACE-NAME>.servicebus.windows.net";

// Create a new instance of the ManagedIdentityCredential class
ManagedIdentityCredential managedIdentityCredential = new ManagedIdentityCredential();

// Create a new instance of ServiceBusClient using ManagedIdentityCredential
client = new ServiceBusClient(fullyQualifiedNamespace, managedIdentityCredential, clientOptions);

// create a processor that we can use to process the messages
// TODO: Replace the <QUEUE-NAME> placeholder
processor = client.CreateProcessor("<QUEUE-NAME>", new ServiceBusProcessorOptions());

try
{
    // add handler to process messages
    processor.ProcessMessageAsync += MessageHandler;

    // add handler to process any errors
    processor.ProcessErrorAsync += ErrorHandler;

    // start processing 
    await processor.StartProcessingAsync();

    Console.WriteLine("Wait for a minute and then press any key to end the processing");
    Console.ReadKey();

    // stop processing 
    Console.WriteLine("\nStopping the receiver...");
    await processor.StopProcessingAsync();
    Console.WriteLine("Stopped receiving messages");
}
finally
{
    // Calling DisposeAsync on client types is required to ensure that network
    // resources and other unmanaged objects are properly cleaned up.
    await processor.DisposeAsync();
    await client.DisposeAsync();
}
