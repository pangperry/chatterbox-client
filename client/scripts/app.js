String.prototype.encodeHtml = function() {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return this.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};

String.prototype.decodeHtml = function() {
  var tagsToReplace = {
    '&amp;': '&',
    '&lt;': '<',
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
  toSkip: 200,

  init: function() {
    $.get(`${app.server}/chatterbox/classes/messages`, function(data) {
      console.log('done');
      app.messages = data.results;
      app.toSkip = app.messages.length;
      app.messages.forEach(function(message) {
        message.roomname = message.roomname ? message.roomname : 'lobby';
        if (!app.rooms.includes(message.roomname)) {
          app.rooms.push(message.roomname);
          $('#roomSelector').append(`<option>${message.roomname}</option>`);
        }
      });
      app.showUpto(200);
    });
  },
	
  send: function(message) {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
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
    app.server = `${app.server}/chatterbox/classes/messages?skip=${app.toSkip}`;
    $.get( `${app.server}`, callback);
  },
	
  clearMessages: function() {
    $('.messageFeed').html('');
  },

  addFriend: function(friend) {
    app.friends.push(friend);
  },

  renderMessage: function(message) {
	//	$('.result').append(`<div class="message">${message.text}</div>`);
    var userName = message.username || 'Anonymous';
    if (userName) {
      userName = userName.encodeHtml();
    } 
    var roomName = message.roomname || 'Main';
    var text = message.text;
    if (text) {
      text = text.encodeHtml();
    } 
    var createdAt = message.createdAt;
    if (app.friends.includes(userName)) {
      $('.messageFeed').append(`<div class="message"><a href="#" onclick="app.addFriend('${userName}')">${userName}</a><br><b>${text}</b><br>${createdAt}</div>`);   
    } else {
      $('.messageFeed').append(`<div class="message"><a href="#" onclick="app.addFriend('${userName}')">${userName}</a><br>${text}<br>${createdAt}</div>`);   
    }
  },

  renderRoom: function() {
    app.clearMessages();
    app.messages.forEach(function(message) {
      if (message.roomname === $('#roomSelector')[0].value) {
        app.renderMessage(message);
      }
    });
  },

  getRecent: function(limit = 200) {
    $.get(`${app.server}/chatterbox/classes/messages?limit=${limit}&skip=${app.messages.length}`, function(data) {
      console.log('done');
      app.messages = app.messages.concat(data.results);
    });
  },

  showUpto: function(index) {
    
    for (var midx = 0; midx < app.messages.length; midx++) {
      app.renderMessage(app.messages[midx]);
    }
  }, 


 
    
};

$(function() {
  app.init();
  $('#tweet').on('submit', function(e) {
    e.preventDefault();
    var messageObj = {};
    var $form = $(this);
    messageObj.text = $('#text').val(); 
    messageObj.username = window.name;
    messageObj.room = $('#roomSelector')[0].value;
    $('#text').val('');
    app.send(messageObj);
    
  });

});










