// image (<img> tag) fade-out / fade-in effect TBD
function change_image(sourceimg) {
    // displays topgradient if concealed
    if ($(FIN_layout.topgradient).css('display') == 'none') {
        $(FIN_layout.topgradient).fadeIn(FIN_framework.UI_FIGURES[7]*2);
    }
    // fades out old image and fades in the new one
    $(FIN_layout.imagezone).fadeTo( FIN_framework.UI_FIGURES[7], 0.001, function(){

        //
        // NON FUNZIONA PERCHE" il cambio di src riesce sempre, cosa verificarte??? TBD XXXX
        try{
            $(FIN_layout.imagezone).attr("src",sourceimg);
        }
        catch(err){
            debug_out(ERROR_NOTFOUND+" "+sourceimg,1);
            system_popup(ERROR_NOTFOUND+" "+sourceimg);
            debug_out(FIN_localization.ERROR_NOTFOUND+" "+err);
        }
    }).fadeTo(FIN_framework.UI_FIGURES[7], 1);
};

//// setup dynamic image size
function setup_image(verticalfraction){
  	$(FIN_layout.imagezonecontainer).css('display','block');
  	///////TBD bkg img
    if (!$(FIN_layout.imagezonecontainer).css('display')) {
//        $("body").prepend('<div id="imagezonecontainer" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:9;margin-left:auto;margin-right:auto;display:none"/> <img id="imagezone" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:10;margin-left: auto;margin-right: auto;opacity: 1;" src=""></div> </div>');

$("body").prepend('<div id="imagezonecontainer" style="text-align: center;width: 100%;height: 330px;z-index: 9;position: fixed; float: block;top: 0px;"><img id="imagezone" style="max-width: 100%; max-height: 100%; width: auto; height: auto; z-index: 10; margin-left: auto; margin-right: auto; opacity: 1;" src=""/></div>');

        //$(imagezonecontainer).css('background-image','background-image: url("styles/empty.png")');
        //$("body").prepend('<div id="imagezonecontainer" style="max-width:100%; max-height:100%; width:auto; height:auto; z-index:10; margin-left: auto; margin-right: auto; display: none" id="fixedimage"/></div>');
    }
    var verticalpixels = Math.ceil( get_display_size()[0] * verticalfraction );
    debug_out(verticalpixels,2);
    $(FIN_layout.outputarea).css('margin-top',verticalpixels);
    $(FIN_layout.topgradient).css('margin-top',verticalpixels);
    //$(topgradient).css('display','none');
    $(FIN_layout.imagezonecontainer).css('height',verticalpixels);
    $(FIN_layout.imagezonecontainer).css('width','100%');
};

//// drawImageOnCanvas("http://photojournal.jpl.nasa.gov/jpeg/PIA17555.jpg")
// img.src = "http://photojournal.jpl.nasa.gov/jpeg/PIA17555.jpg";drawImage();
// $(imagezonecontainer).css('width').split('px')[0]
// $(imagezonecontainer).css('height').split('px')[0]
//https://stackoverflow.com/questions/10841532/canvas-drawimage-scaling
function drawImageOnCanvas(source){ // TBD
    var canvas = document.getElementById("imagezone");
    var context = canvas.getContext("2d");
     //document.getElementById("myImageToDisplayOnCanvas");
    var imageObj = new Image();
     // "https://panoramacouncil.org/pics/content/header/Panorama_Rouen1431_neu_4c_c-asisi(1).jpg"
        imageObj.src = source;

    imageObj.onload = function() {
    var imgWidth = imageObj.naturalWidth;
    var screenWidth  = canvas.width;
    var scaleX = 1;
    if (imgWidth > screenWidth)
        scaleX = screenWidth/imgWidth;
    var imgHeight = imageObj.naturalHeight;
    var screenHeight = canvas.height;
    var scaleY = 1;
    if (imgHeight > screenHeight)
        scaleY = screenHeight/imgHeight;
    var scale = scaleY;
    if(scaleX < scaleY)
        scale = scaleX;
    if(scale < 1){
        imgHeight = imgHeight*scale;
        imgWidth = imgWidth*scale;          
    }

    canvas.height = imgHeight;
    canvas.width = imgWidth;

//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*20, imgHeight*20);
//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*10, imgHeight*10);
//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*5, imgHeight*5);

    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth, imgHeight);
    }
};
