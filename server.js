var express    = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(require('./controllers'));


if(app.get('port')=== 3000)
{
	
	app.listen(app.get('port'),function()
	{
		console.log("app is running in localhost:3000")
	})
}
else
{
	console.log("wasup")
	app.listen(app.get('port'))
}
