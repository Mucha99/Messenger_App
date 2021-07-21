const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on("newUser", ({ author, content }) => addMessage(author, content));
socket.on("userLeft", ({ author, content }) => addMessage(author, content));

const select = {
    loginForm: document.getElementById('welcome-form'),
    messagesSection: document.getElementById('messages-section'),
    messagesList: document.getElementById('messages-list'),
    addMessageForm: document.getElementById('add-messages-form'),
    userNameInput: document.getElementById('username'),
    messageContentInput: document.getElementById('message-content'),
};

let userName;

const login = function(event) {
    event.preventDefault();
    if(select.userNameInput.value){
        userName = select.userNameInput.value;
        select.loginForm.classList.remove('show');
        select.messagesSection.classList.add('show');
        socket.emit('join', {name: userName, id: socket.id});
    } else {
        alert('Login error... Try again!');
    }
}

function addMessage (author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) {
        message.classList.add('message--self');   
    }
    message.innerHTML = `
        <h3 class="message__author">${userName === author ? 'You' : author }</h3>
        <div class="message__content">
            ${content}
        </div>
    `;
    select.messagesList.appendChild(message);
}

const sendMessage = function(event) {
    event.preventDefault();
    if(select.messageContentInput.value) {
        addMessage(userName, select.messageContentInput.value);
        socket.emit('message', { author: userName, content: select.messageContentInput.value})
        select.messageContentInput.value = '';
    } else {
        alert('Try again!')
    }
}

select.loginForm.addEventListener('submit', login);
select.addMessageForm.addEventListener('submit', sendMessage);