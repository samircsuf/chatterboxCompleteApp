import socket from './ws-client';
import { UserStore } from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  userStore.set(username);
}

class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    //console.log('Hello ES6!');
    socket.init('ws://localhost:3001');
    //open a socket and send a message
    socket.registerOpenHandler(() => {
      //manual msg transmission
      //let message = new ChatMessage({ message: 'pow!' });
      //socket.sendMessage(message.serialize());
      //msg transmission via chatForm
      this.chatForm.init((data) => {
        let message = new ChatMessage(data);
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });
    //receive message from socket server and display it on console
    socket.registerMessageHandler((data) => {
      console.log(data);
      let message = new ChatMessage(data);
      this.chatList.drawMessage(message.serialize());//draws the serialize message into browser
    });
  }
}
//class with default and optional values
class ChatMessage {
  constructor({message: m, user: u = username, timestamp: t = (new Date()).getTime()}) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }
  serialize(){
    return { user: this.user, message: this.message, timestamp: this.timestamp };
  }
}

//new ChatApp();
//explicitly export the pieces of your module you want others to use
export default ChatApp;
