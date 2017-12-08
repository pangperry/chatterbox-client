var app = {
  server: 'http://parse.sfm8.hackreactor.com',

	init: function() {
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

	fetch: function() {
		this.server = `${this.server}/chatterbox/classes/messages`;
		return $.get( `${this.server}`, function(data) {
	});
	// this.server = `${this.server}/chatterbox/classes/messages`; // this is hacky. Figure out what they really want here.
	// var response = $.ajax({
	// 	url: this.server,
	// 	type: 'GET',
	// 	success: function (data) {
	// 		console.log('Fetched', data);
	// 	}, 
	// 	error: function () {
	// 		console.log('Unable to fetch.');
	// 	}
	// });
	// return response
	},
	
	clearMessages: function() {
	},

	renderMessage: function() {
		
	},

	renderRoom: function() {
	},

};









