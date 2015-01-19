  var handler = StripeCheckout.configure({
    key: 'pk_live_8ftaqUCg4JwMMzw0NK6xl3H2',
    image: '/radius/img/appicon128.png',
    token: function(token) { // Use the token to create the charge with a server-side script. You can access the token ID with `token.id`
    	submitToken(token);
    }
  });

  document.getElementById('stripeButton').addEventListener('click', function(e) { // Open Checkout with further options
    handler.open({
      name: 'Add Card',
      description: 'Your card will NOT be charged',
      panelLabel:'SUBMIT CARD',
      allowRememberMe: false,
      amount: 0000
    });
    e.preventDefault();
  });
  
  document.getElementById('changeCard').addEventListener('click', function(e) { // Open Checkout with further options
	    handler.open({
	      name: 'Change Card',
	      description: 'Your card will NOT be charged',
	      panelLabel:'SUBMIT CARD',
	      allowRememberMe: false,
	      amount: 0000
	    });
	    e.preventDefault();
	  });
  
  
  function submitToken(token){
	  console.log('SUBMIT TOKEN '+token.id);
	  
	  var http = new XMLHttpRequest();
	  var url = "/stripe/card";
	  var params = "stripeToken="+token.id+"&app=radius";
	  http.open("POST", url, true);

	  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  
	  // notice that the event handler is on xhr and not xhr.upload
	  http.addEventListener('readystatechange', function(e) {
	      if( this.readyState === 4 ) { // the transfer has completed and the server closed the connection.
			  console.log('UPLOAD COMPLETE:');
			  location.reload();
	      }
	  });

	  
	  var response = http.send(params);
  }
  
  
  
  /* http://stackoverflow.com/questions/15418608/xmlhttprequest-level-2-determinate-if-upload-finished
   * 
   var xhr = new XMLHttpRequest();

    // ...
    // do stuff with xhr
    // ...

    xhr.upload.addEventListener('loadstart', function(e) {
      // When the request starts.
    });
    xhr.upload.addEventListener('progress', function(e) {
      // While sending and loading data.
    });
    xhr.upload.addEventListener('load', function(e) {
      // When the request has *successfully* completed.
      // Even if the server hasn't responded that it finished.
    });
    xhr.upload.addEventListener('loadend', function(e) {
      // When the request has completed (either in success or failure).
      // Just like 'load', even if the server hasn't 
      // responded that it finished processing the request.
    });
    xhr.upload.addEventListener('error', function(e) {
      // When the request has failed.
    });
    xhr.upload.addEventListener('abort', function(e) {
      // When the request has been aborted. 
      // For instance, by invoking the abort() method.
    });
    xhr.upload.addEventListener('timeout', function(e) {
      // When the author specified timeout has passed 
      // before the request could complete.
    });

    // notice that the event handler is on xhr and not xhr.upload
    xhr.addEventListener('readystatechange', function(e) {
      if( this.readyState === 4 ) {
        // the transfer has completed and the server closed the connection.
      }
    });
    
       * 
       * 
   */
