var socket = io('http://localhost:3333');

var app = new Vue({
    el: '#app',
    data: {
        user: [],
        users: [],
        messages: [],
        registerName: '',
        message: '',
    },
    methods: {
        register: function (event){
            var name = this.registerName;
            if(name){
                socket.emit('registerUser', name);
            }
        },
        renderUser: function (user) {
            this.users.push(user); 
            console.log('this.users', this.users);
        },
        renderMessage: function (message) {
            this.messages.push(message); 
        },
        sendMessage: function () {
            var message = this.message;
        
            if(message.length){
        
                var messageObject = {
                    name : this.user.name,
                    message,
                };
        
                this.renderMessage(messageObject);
                socket.emit('sendMessage', message);

                this.message = '';
            }
        }

    }
});

socket.on('successRegister', (user) => {
    app.user = user;
    app.renderUser(user);
    console.log('successRegister', user);
});

socket.on('previousUsers', (users) => {
    app.users = users;
});

socket.on('receivedUser', (user) => {
    app.renderUser(user);
});

socket.on('previousMessages', (messages) => {
    app.messages = messages;
});

socket.on('receivedMessage', (message) => {
    app.renderMessage(message);
});