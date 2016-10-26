//Declaring global variables
var imageToShare = null;
var current_lat = null;
var current_lng = null;

function getLocation(){
	navigator.geolocation.getCurrentPosition(function(position) {
	      current_lat = position.coords.latitude;
	      current_lng = position.coords.longitude;
	      alert(current_lat + " " + current_lng );
	      if(current_lat==null || current_lat==undefined || current_lng==null || current_lng==undefined)
	      {
	      	alert("Cannot get your current location. Please make sure you have gps and mobile data turned on!");
	      }
	 },function(err) {
		alert("Cannot get your current location!");
	
	  });
}

function getLocationAndLoadStickers(){
		$(".gpsCoordsLoading").show();
	  	navigator.geolocation.getCurrentPosition(function(position) {
	      current_lat = position.coords.latitude;
	      current_lng = position.coords.longitude;
	      //alert(current_lat + " " + current_lng );
	      if(current_lat==null || current_lat==undefined || current_lng==null || current_lng==undefined)
	      {
	      	alert("Cannot get your current location. Please make sure you have gps and mobile data turned on!");
	      }
	      else
	      {
	      	$(".gpsCoordsLoading").hide();
	      	loadStickers(current_lat, current_lng);
	      }
	 },function(err) {
		alert("Cannot get your current location!");
	
	  });
}

function takePicture() {
	var options = {
	  quality: 100,
	  cameraDirection: 1,
	  encodingType: 1,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
	  
	  navigator.camera.getPicture(function(imageURI) {
	  	checkImageRotationAndDisplay(imageURI);
		//loadStickers(42.000, 23.23223);
		//alert(current_lat + " " + current_lng );
	  }, function(err) {
	
		alert("Cannot open your mobile camera!");
	  }, options);
}

function checkImageRotationAndDisplay(imageURI){
		var img = new Image()
	  	img.onload = function(){
        	if(this.width > this.height){
        		rotatePicture(imageURI);
        		//$(".photo").css({"max-width":"none","width":$(".pictureScreen").height(), "height":$(".pictureScreen").width(), "transform": "translateY(-100%) rotate(90deg)", "transform-origin": "left bottom"});
        		//$(".photo").attr("src", imageURI);
        		//makeBodyHeightSameAsPicture();
        		//$("body").height($(".photo").width());
        		//getLocationAndLoadStickers();
        	}
        	else{
        		//$(".photo").css({"max-width":"100%","width":"","height":"","transform":"","transform-origin":""});
        		$(".photo").attr("src", imageURI);
        		makeBodyHeightSameAsPicture();
        		if(current_lat == null)
					getLocationAndLoadStickers();
        	}
    	}
    	img.src = imageURI;
}

function rotatePicture(imageURI)
{
	var canvas = $(".c")[0];
    var ctx = canvas.getContext("2d");
    var cw = canvas.width;
    var ch = canvas.height;
    //194 71
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = imageURI;
    //image.src = "http://tackdev.sinilink.com/media/stickers/IMAG3957.jpg"
    image.onload = function() {
        canvas.width = image.height;
        canvas.height = image.width;
        cw = canvas.width;
        ch = canvas.height;

        ctx.save();

        ctx.translate(cw, ch/cw);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(image, 0, 0); 
        //context.restore();
        //image = null;
        //window.eval("callback('"+canvas.toDataURL()+"')");
        $(".photo").attr("src", canvas.toDataURL());
        makeBodyHeightSameAsPicture();
        if(current_lat == null)
			getLocationAndLoadStickers();
    };
}
/*
function callback(base64data) {
    console.log(base64data);
    //document.getElementsByClassName("img")[0].src = base64data;
}*/

var i = 0;
function loadStickers(lat, lng)
{
	i++;
	//"<img class='loadGif' src='/static/imgs/ajax-loader.gif' />"
		$.ajax({
					url : "http://tackdev.sinilink.com/getStickers/",
					type : 'POST',
					beforeSend : function (){
		              if(i==1) $(".loaderHolder").show();
		            },
					data : {
						lat: lat,
						lng: lng,
						encoded: 1
					},
					success : function(data) {
						hasInternetAccess = true;
						$(".loaderHolder").hide();
						renderStickersOnScreen(data, lat, lng);
						//alert(data[0].fields["image"]);
					},
					error : function(error) {
						if(i==1) alert("Cannot access internet. Please make sure you have mobile data turned on!");
						setTimeout(loadStickers(lat, lng), 500);
						// Log any error.
						console.log("ERROR:", error);
					},
				});
	
}

function renderStickersOnScreen(data, lat, lng)
{
	for (var i=0, len = data.length; i < len; i++) {
	  	//$( ".slides" ).append( "<li><img class='stciker sticker"+i+"' src='http://tackdev.sinilink.com/media/"+ data[i].fields["image"]+"'></li>" );
		$( ".slides" ).append( "<li><img class='sticker sticker"+i+"' src='data:image/png;base64,"+ data[i]+"'></li>" );
	};
	initSliderForStickers();
	
	// center all stickers (set margin-left values)
	var screenWidth = $(window).width();
	$(".sticker").css("max-width", screenWidth);
	$(".stickerHolder img").css("max-width", screenWidth);
	setTimeout(function(){
		for (var i=0, len = data.length; i < len; i++) {
		  	var imageWidth = $(".sticker"+i).width();
		  	var marginLeft = ((screenWidth - imageWidth)/2) + "px";
		  	$(".sticker"+i).css("margin-left", marginLeft);
		};
	}, 200);
	/*var screenWidth = screen.width;	
	(function (ondone) {
	    var index = 0;
	    nextStep();
	
	    function nextStep() {
	        if (index >= data.length) {
	            if (ondone)
	                ondone();
	            return;
	        }
	
	        var i = index++;
	        var image = new Image();
	        image.src = "data:image/png;base64," + data[i];
	        image.onload = function () {
	            //console.log( image.width+", "+image.height);
	            var marginLeft = ((screenWidth - image.width)/2) + "px";
	  			console.log(marginLeft);
	  			$(".sticker"+i).css("margin-left", marginLeft);
	            nextStep();
	        }
	    }
	})();*/
	//get_encoded_stickers(lat, lng);
}

function get_encoded_stickers(lat, lng)
{
	$.ajax({
					url : "http://tackdev.sinilink.com/getStickers/",
					type : 'POST',
					data : {
						lat: lat,
						lng: lng,
						encoded: 1
					},
					success : function(data) {
						replaceStickersSrc(data);
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function replaceStickersSrc(data)
{
	for (var i=0, len = data.length; i < len; i++) {
	  $(".sticker"+i).attr("src", "data:image/png;base64," + data[i]);
	};
	//alert("body: "+$("body").width() +" "+ $("body").height()+" img: "+$(".photo").width()+" "+$(".photo").height());
}

function removeTempSticker(){
	$("#stickerHolder").hide();
}
//$(".photo").css({"max-width":"none","width":$(".pictureScreen").height(), "height":$(".pictureScreen").width(), "transform": "translateY(-100%) rotate(90deg)", "transform-origin": "left bottom"})
//$(".rotatedPhoto").css({"width":$(".pictureScreen").height(), "height":$(".pictureScreen").width(), "transform": "translateY(-100%) rotate(90deg)", "transform-origin": "left bottom"})
function makeBodyHeightSameAsPicture(){
	$("body").height($(".pictureScreen").height());
}

function getImage(){
	$(".goToShare").hide();
	makeBodyHeightSameAsPicture();
	var new_src = $(".flex-active-slide img").attr("src");
	$(".stickerHolder img").css("margin-left",$(".flex-active-slide img").css("margin-left"));
	$(".stickerHolder img").attr("src", new_src);
	html2canvas(document.body, {onrendered:function(canvas){
		//$("#tempImage img").attr("src", canvas.toDataURL("image/png"));
		//$("#tempImage").show();
			imageToShare = canvas.toDataURL("image/png");
			$(".goToShare").show();
			$(".stickerHolder img").attr("src", "");
		}});
}

function initSliderForStickers(data){
	(function(){$('.flexslider').flexslider({
		    animation: "slide",
		    controlNav: false,      
			directionNav: false, 
			slideshow: false,
		  })})(function(){alert("done");})
}