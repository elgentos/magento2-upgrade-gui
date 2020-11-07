const fs = require('fs');

if (! fs.existsSync(__dirname + "/privateKey")) {
	console.error("You have not yet generated your private/public keypair. Run the 'electron:keypair' script.");
	return;
}

const prompts = require('prompts');
const crypto = require("crypto");

(async () => {
  const response = await prompts({
    type: 'text',
    name: 'email',
    message: 'Which email address should be used?',
    validate: email => email === '' ? 'Please provide an email' : true,
  });

  const signature = crypto.sign("sha256", Buffer.from(response.email), fs.readFileSync(__dirname + "/privateKey"));

  console.log("Your license key is:\n");
  console.log(signature.toString('base64'));

})();