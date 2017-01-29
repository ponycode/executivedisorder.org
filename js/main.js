$( function(){

	console.log("Starting");

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	var image = new Image();
	image.onload = function(){
		
		var ratio  = Math.min( canvas.width / image.width, canvas.height / image.height );
		var centerShift_x = ( canvas.width - image.width*ratio ) / 2;
		var centerShift_y = ( canvas.height - image.height*ratio ) / 2;
		
		context.clearRect( 0, 0, canvas.width, canvas.height );
		context.drawImage( image, 0,0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);


		context.font = '20px arial, sans-serif';
		context.fillStyle = 'black';
		context.setTransform( 1, 0.2, 0, 1, 0, 0 );

		wrapText( context, 'No muslims shall enter the country', 500, 500, 200, 20 );
		// context.fillText( 'No muslims shall enter the country', 500, 500 );
		context.setTransform( 1, 0, 0, 1, 0, 0 );
		
		// context.font = "80pt Calibri";
		// context.fillText( "My TEXT!", 20, 20 );
		
	};
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
	
});
