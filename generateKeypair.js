const crypto = require('crypto');
const fs = require('fs');

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048
});

const exportablePrivateKey = privateKey.export({
	format: "pem",
	type: "pkcs1"
})



const exportablePublicKey = publicKey.export({
	format: "pem",
	type: "pkcs1"
})

fs.writeFileSync(__dirname + "/privateKey", exportablePrivateKey);
console.log("Exported private key to " + __dirname + "/privateKey\n");


const publicKeyObject = {
	key: exportablePublicKey
};

fs.writeFileSync(__dirname + "/src/assets/publicKey.js", `export default ${JSON.stringify(publicKeyObject)}`);
console.log("Exported private key to " + __dirname + "/src/assets/publicKey.js\n");