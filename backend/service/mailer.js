const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({username: 'api', key: 'key-bab3c0bfe4dc34d4bf164ec0c2dff4c8-6df690bb-300a7481'});
  
  mg.messages.create('sandbox-123.mailgun.org', {
  	from: "Excited User <mailgun@sandbox9c9b44e8d6bd48659b87be9396841422.mailgun.org>",
  	to: ["huzaifanaseer03@gmail.com"],
  	subject: "Hello",
  	text: "Testing some Mailgun awesomeness!",
  	html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.log(err)); // logs any error