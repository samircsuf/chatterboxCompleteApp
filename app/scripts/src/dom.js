import $ from 'jquery';
import moment from 'moment';
import md5 from 'crypto-js/md5';

function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');//prompt function is built into the browser and returns a string
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formSel, inputSel) {
    this.$form = $(formSel);
    this.$input = $(inputSel);
  }
  init(submitCallback) {
    //form submit handler
    this.$form.submit((event) => {
      event.preventDefault();
      let val = this.$input.val();//retrive value of input
      submitCallback(val);//pass the value to callback
      this.$input.val('');//reset the input value
    });
    this.$form.find('button').on('click', () => this.$form.submit());//submits form when button is clicked
  }
}

export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
  }
  //drawMessage method accepts object as argument
  drawMessage({user: u, timestamp: t, message: m}) {
    let $messageRow = $('<li>', {
      'class': 'message-row'
    });

    if (this.username === u) {
      $messageRow.addClass('me');
    }

    let $message = $('<p>');//stores the message content
    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    }));
    $message.append($('<span>', {
      'class': 'timestamp',
      'data-time': t,
      //text: (new Date(t)).getTime()
      text: moment(t).fromNow()
    }));
    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    }));
    //gravatar message
    let $img = $('<img>', {
      src: createGravatarUrl(u),
      title: u
    });

    $messageRow.append($img);
    //adds $message contents to $message row which is <li> element
    $messageRow.append($message);
    //$(this.listId).append($messageRow);
    //adds one messagerow to the form selector $list => [data-chat="chat-form"]
    this.$list.append($messageRow);
    //adds the message row into the scroll view
    $messageRow.get(0).scrollIntoView();
  }
  init() {
    this.timer = setInterval(() => {
        $('[data-time]').each((idx, element) => {
            let $element = $(element);
            let timestamp = new Date().setTime($element.attr('data-time'));
            let ago = moment(timestamp).fromNow();
            $element.html(ago);
        });
    }, 1000);
  }
}
