const opcua = require("node-opcua");

// Server URL
const endpointUrl = "opc.tcp://localhost:4334/UA/NodeServer";

// Maak client aan
const client = opcua.OPCUAClient.create({
    endpointMustExist: false
});

let theSession;

async function main() {
    try {
        // Verbind met de server
        await client.connect(endpointUrl);
        console.log("Verbonden met OPC UA Server");

        // Maak sessie aan
        theSession = await client.createSession();
        console.log("Sessie aangemaakt");

        // Lees waarde van de variabele
        const dataValue = await theSession.read({
            nodeId: "ns=1;s=MyVariable",
            attributeId: opcua.AttributeIds.Value
        });

        console.log("Waarde van MyVariable:", dataValue.value.value);

        // Sluit sessie en verbinding
        await theSession.close();
        await client.disconnect();
        console.log("Verbinding gesloten");
    } catch (err) {
        console.log("Fout:", err);
    }
}

main();