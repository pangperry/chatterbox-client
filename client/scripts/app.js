String.prototype.encodeHtml = function() {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#x27',
    '>': '&gt;',
    '/': '&#x2F'
  };
  // return this.replace(/[&<>]/g, function(tag) {
  //   return tagsToReplace[tag] || tag;
  // });
  return this.split('').map(function(char) {
    return tagsToReplace[char] || char;
  });
};

String.prototype.decodeHtml = function() {
  var tagsToReplace = {
    '&amp;': '&',
    '&lt;': '<',
    '"': '&quot;',
    "'": '&#x27',
    '>': '&gt;',
    '/': '&#x2F',
    '&gt;': '>'};
  return this.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};

var app = {
  server: 'http://parse.sfm8.hackreactor.com',
  rooms: [],
  friends: [],
  messages: [],
  messageIds: {}, // HERE testing if storing messages by objectID prevents duplicates
  toSkip: 200,

  init: function() {
    $.get(`${app.server}/chatterbox/classes/messages?limit=20000`, function(data) {
      console.log('done');
      app.messages = data.results;
      app.toSkip = app.messages.length;
      app.messages.forEach(function(message) {
        app.messageIds[message.objectId] = message; // HERE
        message.roomname = message.roomname ? message.roomname : 'lobby';
        if (!app.rooms.includes(message.roomname)) {
          app.rooms.push(message.roomname);
          $('#roomSelect').append(`<option>${message.roomname}</option>`);
        }
      });
      $('#roomSelect').append('<option>Create new room</option>');
      app.showUpto(20);
    });
  },
	
  send: function(message) {
    //debugger;
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message,
      //headers: {'Origin', 'http://parse.sfm8.hackreactor.com'}
      //headers: {"Access-Control-Allow-Headers": "http://parse.sfm8.hackreactor.com"},
      // AccessControlAllowOrigin: '*',
      // AccessControlAllowMethods: 'POST' 'GET',
      //contentType: 'application/json',
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
    app.server = `${app.server}/chatterbox/classes/messages?skip=${app.toSkip}`;
    $.get( `${app.server}`, callback);
  },
	
  clearMessages: function() {
    $('#chats').html('');
  },

  addFriend: function(friend) {
    app.friends.push(friend);
    app.showRoom();
  },

  renderMessage: function(message) { 
    var userName = message.username || 'Anonymous';
    if (userName) {
      userName = userName.encodeHtml();
    } 
    var roomName = message.roomname || 'Main';
    if (roomName) {
      roomName = roomName.encodeHtml();
    }
    var text = message.text;
    if (text) {
      text = text.encodeHtml();
    } 
    var createdAt = message.createdAt;
    if (app.friends.includes(userName)) { 
      $('#chats').prepend(`<div class="message"><a id="friendLink" href="#" onclick="app.addFriend('${userName}')">${userName}</a><br><b>${text}</div>`);   
    } else {
      $('#chats').prepend(`<div class="message"><a id="friendLink" href="#" onclick="app.addFriend('${userName}')">${userName}</a><br>${text}</div>`);   
    }
  },

  renderRoom: function(room) { 
    if (!app.rooms.includes(room)) {
      app.rooms.push(room);
      $('#roomSelect').append(`<option>${room}</option>`);
    }
  },

  getRecent: function(limit = 200) {
    $.get(`${app.server}/chatterbox/classes/messages?limit=${limit}&skip=${app.messages.length - 1}`, function(data) {
      data.results.forEach(function(message) {
        if (!app.messageIds.hasOwnProperty(message.objectId)) { 
          app.messageIds[message.objectId] = message;
          app.messages.push(message);
          app.renderMessage(message);
        }
      });
    });
  },

  showUpto: function(index) {
    for (var idx = app.messages.length - index; idx < app.messages.length; idx++) {
      app.renderMessage(app.messages[idx]); 
    }
  },

  showRoom: function() {
    app.clearMessages();
    app.messages.forEach(function(message) {
      if (message.roomname === $('#roomSelect')[0].value) {
        app.renderMessage(message);
      }
    });
  }
};

$(function() {
  $('username').on('click', function(e) {
    console.log('clicked');
  });
  app.init();
  setInterval(app.getRecent, 3000);
  $('#roomSelect').on('change', function(e) {
    if ($(this).val() === 'Create new room') {
      $('#hiddenRoomField').css({visibility: 'visible'});
    } else {
      $('#hiddenRoomField').css({visibility: 'hidden'});
    }
    app.showRoom();
  });

  

 
  $('#tweet').on('submit', function(e) {
    e.preventDefault();
    var messageObj = {};
    var $form = $(this);
    messageObj.text = $('#text').val(); 
    messageObj.username = window.name;
    messageObj.room = $('#roomSelect')[0].value;
    $('#text').val('');
    if ($('#hiddenRoomField')[0].style.cssText === 'visibility: visible;') {
      messageObj.room = $('#newRoomInput').val();
      app.addRoom(messageObj.room);
      $('#hiddenRoomField').css({visibility: 'hidden'});
    } 
    app.send(messageObj);
    
  });
});










