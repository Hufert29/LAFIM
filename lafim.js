import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNfh2FMIbeWBITqn6VQoAqg-BEKMEHshs",
  authDomain: "lafim2901.firebaseapp.com",
  databaseURL: "https://lafim2901-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lafim2901",
  storageBucket: "lafim2901.firebasestorage.app",
  messagingSenderId: "681403087204",
  appId: "1:681403087204:web:3ea89d2eb09d22f710e271",
  measurementId: "G-WKE63G7SV9"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

document.addEventListener('keydown', (event) => {
  if (!messageInput.matches(':focus')) {
    messageInput.focus();
  }
});

const notificationSound = new Audio('lafim.mp3');

const messagesRef = ref(database, 'messages');

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

let userName = prompt("Въведете вашето име: ");
while (!userName) {
  userName = prompt("Моля, въведете валидно име: ");
}

const sendMessage = () => {
  const message = messageInput.value.trim();
  const timestamp = formatTime(new Date()); 

  if (message) {
    push(messagesRef, {
      user: userName,
      text: message,
      time: timestamp
    });
    messageInput.value = ''; 
  }
};

onChildAdded(messagesRef, (snapshot) => {
  const messageData = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const timeElement = document.createElement('span');
  timeElement.textContent = messageData.time;
  timeElement.classList.add('time'); 

  const userElement = document.createElement('span');
  userElement.textContent = messageData.user;
  userElement.classList.add('user'); 

  const messageTextElement = document.createElement('span');
  messageTextElement.textContent = messageData.text;
  messageTextElement.classList.add('text'); 

  if (messageData.user === userName) {
    messageElement.classList.add('my-message');
    messageElement.appendChild(messageTextElement);
    messageElement.appendChild(timeElement);
  } else {
    messageElement.classList.add('other-message');
    messageElement.appendChild(userElement);
    messageTextElement.textContent = ": " + messageTextElement.textContent;
    messageElement.appendChild(messageTextElement);
    messageElement.appendChild(timeElement);
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  notificationSound.play();
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (messageInput.value.trim() === '') {
      event.preventDefault();
      messageInput.value = '';
      messageInput.focus();
    } else {
      sendMessage();
    }
  }
});