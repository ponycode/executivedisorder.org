$( function(){

	console.log("Starting");


	if( XMLHttpRequest.prototype.sendAsBinary === undefined ){
		XMLHttpRequest.prototype.sendAsBinary = function( string ){
			var bytes = Array.prototype.map.call( string, function( c ){
				return c.charCodeAt(0) & 0xff;
			});
			this.send( new Uint8Array( bytes ).buffer );
		};
	}
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var $message = $("#message");
	var $facebookButton = $("#facebookButton");
	
	var text = $message.val();
	
	
	
	var image = new Image();
	image.onload = _renderText;
	image.src = "img/trump1.png";

	
	function wrapText( context, text, x, y, maxWidth, lineHeight ){
		var words = text.split(' ');
		var line = '';

		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	}


	$message.keyup( function(){
		_renderText();
		console.log(text);
	});

	$facebookButton.click( function(){
		console.log("CLICK FACEBOOK BUTTON");
		postCanvasToFacebook2();
	});
	
	function _renderText(){
		var text = $message.val();
		
		var ratio  = Math.min( canvas.width / image.width, canvas.height / image.height );
		var centerShift_x = ( canvas.width - image.width*ratio ) / 2;
		var centerShift_y = ( canvas.height - image.height*ratio ) / 2;

		context.clearRect( 0, 0, canvas.width, canvas.height );
		context.drawImage( image, 0,0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);


		context.font = '20px arial, sans-serif';
		context.fillStyle = 'black';

		context.scale( 1, 2 );

		context.setTransform( 1, -.05, -.12, 1, 0, 0.5 );

		// context.fillRect( 710, 280, 240, 320 );

		wrapText( context, text, 720, 300, 240, 20 );
		// context.fillText( 'No muslims shall enter the country', 500, 500 );
		context.setTransform( 1, 0, 0, 1, 0, 0 );
	}
	
	

	/*
	 Copyright (c) 2011, Daniel Guerrero
	 All rights reserved.
	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:
	 * Redistributions of source code must retain the above copyright
	 notice, this list of conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright
	 notice, this list of conditions and the following disclaimer in the
	 documentation and/or other materials provided with the distribution.
	 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
	 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	/**
	 * Uses the new array typed in javascript to binary base64 encode/decode
	 * at the moment just decodes a binary base64 encoded
	 * into either an ArrayBuffer (decodeArrayBuffer)
	 * or into an Uint8Array (decode)
	 *
	 * References:
	 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
	 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
	 */
	var Base64Binary = {
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		/* will return a  Uint8Array type */
		decodeArrayBuffer: function(input) {
			var bytes = (input.length/4) * 3;
			var ab = new ArrayBuffer(bytes);
			this.decode(input, ab);

			return ab;
		},

		decode: function(input, arrayBuffer) {
			//get last chars to see if are valid
			var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
			var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));

			var bytes = (input.length/4) * 3;
			if (lkey1 == 64) bytes--; //padding chars, so skip
			if (lkey2 == 64) bytes--; //padding chars, so skip

			var uarray;
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			var j = 0;

			if (arrayBuffer)
				uarray = new Uint8Array(arrayBuffer);
			else
				uarray = new Uint8Array(bytes);

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			for (i=0; i<bytes; i+=3) {
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(input.charAt(j++));
				enc2 = this._keyStr.indexOf(input.charAt(j++));
				enc3 = this._keyStr.indexOf(input.charAt(j++));
				enc4 = this._keyStr.indexOf(input.charAt(j++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				uarray[i] = chr1;
				if (enc3 != 64) uarray[i+1] = chr2;
				if (enc4 != 64) uarray[i+2] = chr3;
			}

			return uarray;
		}
	};

	
	/**
	 * FACEBOOK STUFFS
	 */
	window.fbAsyncInit = function(){
		FB.init({
			appId: '873847472718637',
			xfbml: true,
			version: 'v2.8'
		});
		console.log("FACEBOOK LOADED");
		FB.AppEvents.logPageView();
	};

	(function( d, s, id ){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	
	function dataURItoBlob( dataURI ){
		var byteString = atob( dataURI.split(',')[1] );
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: 'image/png' });
	}
	
	function postCanvasToFacebook(){
		var data = canvas.toDataURL("image/png");
		var encodedPng = data.substring( data.indexOf(',') + 1, data.length );
		var decodedPng = Base64Binary.decode( encodedPng );

		var blob = null;
		try {
			blob = dataURItoBlob( data );
		}catch( e ){
			console.log( e );
		}
		
		console.log("POST TO FACEBOOK");
		
		FB.getLoginStatus( function( response ){
			if( response.status === "connected" ){
				console.log("CONNECTED");
				postImageToFacebook( response.authResponse.accessToken, "trump-executive-order.png", "image/png", decodedPng, "testing");
				return;
			}
			
			console.log( "OTHER STATUS", response );
			FB.login( function( response ){
				console.log("CONNECTED AFTER LOGIN 2");
				postImageToFacebook( response.authResponse.accessToken, "trump-executive-order.png", "image/png", decodedPng, "testing");
			}, { scope: "publish_actions" });
		});
	}

	function postCanvasToFacebook2(){
		var data = canvas.toDataURL("image/png");
		var encodedPng = data.substring( data.indexOf(',') + 1, data.length );
		var decodedPng = Base64Binary.decode( encodedPng );

		var blob = null;
		try {
			blob = dataURItoBlob( data );
		}catch( e ){
			console.log( e );
		}

		console.log("POST TO FACEBOOK");

		FB.getLoginStatus( function( response ){
			if( response.status === "connected" ){
				console.log("CONNECTED");
				postImageToFacebook2( response.authResponse.accessToken, "trump-executive-order.png", "image/png", blob, "testing");
				return;
			}

			console.log( "OTHER STATUS", response );
			FB.login( function( response ){
				console.log("CONNECTED AFTER LOGIN 2");
				postImageToFacebook2( response.authResponse.accessToken, "trump-executive-order.png", "image/png", blob, "testing");
			}, { scope: "publish_actions" });
		});
	}

	function postImageToFacebook( authToken, filename, mimeType, imageData, message ){
		// this is the multipart/form-data boundary we'll use
		var boundary = '----ThisIsTheBoundary1234567890';
		// let's encode our image file, which is contained in the var
		var formData = '--' + boundary + '\r\n'
		formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
		formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
		for ( var i = 0; i < imageData.length; ++i )
		{
			formData += String.fromCharCode( imageData[ i ] & 0xff );
		}
		formData += '\r\n';
		formData += '--' + boundary + '\r\n';
		formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
		formData += message + '\r\n'
		formData += '--' + boundary + '--\r\n';

		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
		xhr.onload = xhr.onerror = function() {
			console.log( xhr.responseText );
		};
		xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
		xhr.sendAsBinary( formData );
	}

	function postImageToFacebook2( token, filename, mimeType, imageData, message ){
		var fd = new FormData();
		fd.append( "access_token", token );
		fd.append( "source", imageData );
		fd.append( "no_story", true );

		// Upload image to facebook without story(post to feed)
		$.ajax({
			url: "https://graph.facebook.com/me/photos?access_token=" + token,
			type: "POST",
			data: fd,
			processData: false,
			contentType: false,
			cache: false,
			success: function( data ){
				console.log( "facebook image upload success: ", data );
				
				FB.api( "/" + data.id + "?fields=images", function( response ){
					if( response && !response.error ){
						console.log( "IMAGE DETAILS: ", response.images[0].source );


						FB.ui({
							method: 'feed',
							display: 'popup',
							name: 'Look at the awesome e-card created just for you!',
							link: window.location.href,
							picture: response.images[0].source,
							privacy: 'SELF'
						});
						
						return;
						
						// Create facebook post using image
						// FB.api( "/me/feed", "POST", {
						// 	"message": "",
						// 	"picture": response.images[0].source,
						// 	"link": window.location.href,
						// 	"name": 'Look at the cute panda!',
						// 	"description": message,
						// 	"privacy": {
						// 		value: 'SELF'
						// 	}
						// },
						// function( response ){
						// 	if( response && !response.error ){
						// 		/* handle the result */
						// 		console.log("Posted story to facebook");
						// 		console.log(response);
						// 	}else{
						// 		console.error("Error creating facebook message");
						// 	}
						// });
					}else{
						console.error("Error getting image details");
					}
				});
			},
			error: function( shr, status, data ){
				console.log( "error " + data + " Status " + shr.status );
			},
			complete: function( data ){
				console.log('Post to facebook Complete');
			}
		});
	}

});

