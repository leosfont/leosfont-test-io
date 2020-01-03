const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
	res.render('index.html');
});

let users = [];
let messages = [];
let status = JSON.parse(fs.readFileSync('./data/status.json'));

io.on('connection', socket => {
	console.log(`Socket conectado: ${socket.id}`);

	socket.on('registerUser', name => {
		console.log('registerUser', name);
		const findUser = findBySocketID(socket.id);
		console.log(findUser);
		if(!findUser){
			user = {
				socketID : socket.id,
				name,
				status,
			}
	
			users.push(user);
			socket.emit('successRegister', user);
			socket.broadcast.emit('receivedUser', user);
			console.log('Users', users);
		}
	});

	socket.on('disconnect', async function() {
		users = await users.filter(function(user) {
			console.log(user);
			return user.socketID != socket.id;
		});
		socket.broadcast.emit('previousUsers', users);
		console.log('Users', users);
		
	});

	socket.emit('previousUsers', users);
    socket.emit('previousMessages', messages);

	socket.on('sendMessage', message => {
		
		const user = findBySocketID(socket.id);
		var messageObject = {
			name : user.name,
			message,
		}
		messages.push(messageObject);
		socket.broadcast.emit('receivedMessage', messageObject);

		console.log('Messages:', messages)
	});

	//private functions
	function findBySocketID(id){
		var response = users.find(user => user.socketID == id);
		return response;
	}
	
});

server.listen(process.env.PORT || 3333);