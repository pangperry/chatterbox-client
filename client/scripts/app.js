var app = {
  server: 'http://parse.sfm8.hackreactor.com',
  rooms: [],
	// friends: [],
  messages: [],
  toSkip: 0,

  init: function() {
    $.get(`${app.server}/chatterbox/classes/messages`, function(data) {
      app.messages = data.results;
      app.messages.forEach(function(message) {
        message.roomname = message.roomname ? message.roomname : 'lobby';
        if (!app.rooms.includes(message.roomname)) {
          app.rooms.push(message.roomname);
          $('#roomSelector').append(`<option>${message.roomname}</option>`);
        }
        app.renderMessage(message);          
      });
// app.showMessages(data.results.slice(0, 10));
    });
  },
	
  send: function(message) { 
    $.ajax({
		// This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error(`chatterbox: Failed to send message: ${data}`);
      }
    });
  },

  fetch: function(callback) {
    app.server = `${app.server}/chatterbox/classes/messages?limit=${limit}&skip=${app.toSkip}`;
    $.get( `${app.server}`, callback);
  },
	
  clearMessages: function() {
    $('.messageFeed').html('');
  },

  renderMessage: function(message) {
	//	$('.result').append(`<div class="message">${message.text}</div>`);
    var userName = message.username || 'Anonymous';
    var roomName = message.roomname || 'Main';
    var text = message.text;
    var createdAt = message.createdAt;
    $('.messageFeed').append(`<div class="message">${userName}<br>${text}<br>${createdAt}</div>`);   
  },

  renderRoom: function() {
    app.clearMessages();
    app.messages.forEach(function(message) {
      if (message.roomname === $('#roomSelector')[0].value) {
        app.renderMessage(message);
      }
    });
  },
    
};

$(function() {
  app.init();
});










