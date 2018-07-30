
//-// instruction: graphics/image changer
function img(imgPath){
// TBD
    change_image(imgPath);
    return;
}

//// instruction: inserisce una immagine TBD
function imgOLD(im,pc,SizeAndPlacement) {
    if (typeof(SizeAndPlacement)=="undefined") {
        SizeAndPlacement=30;
    }
    // TBD
    $(previously).append(OUT_IMG_PREV+im+OUT_IMG_MEDI+pc+OUT_IMG_POST);
    //$("#placeholder").append('</br><img src="'+im+'" class="el_fadein '+posizione+'" width="'+pc+'%"/></br>');
}

//// instruction: writes text in the "placeholder" without any effect
function txt(text){
    // paragraph form customization
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txt: "+text+"/", 3);
    // prints without any effect
    $(previously).append( /*'<br>'+*/add_custom_html_tags( text, DICTIONARY ) );
    // animated scroll-up effect
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+UI_FIGURES[0]+")" );
    return;
}

//// instruction: writes text in the "placeholder": slow-printing
function txs(text){
    // paragraph form customization
//    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txs: "+text+"/", 3);
    FIN_framework.printing= true;
    // prints with slow-print

    if(CRAWLER.working) {
        txt(text);
    }
    else {
        slowPrinter.add(text);
        slowPrinter.delay(UI_FIGURES[6]);
    }
        
    /*
    if (typeof(CRAWLER)!="undefined") {
        if(CRAWLER.working) {
            txt(text);
        }
    }
    else {
        slowprinter_add(text);
        slowprinter_delay(UI_FIGURES[6]);
    }
    */
    return;
}

// da rivedere gli altri print:!!! TBD
//// instruction: writes text in the "placeholder": fade-in
function txf(text){
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txf: "+text+"/", 3);
    FIN_framework.printing= true;
        if(CRAWLER.working) {
        txt(text);
    }
    else {
        var ics = add_custom_html_tags( text, DICTIONARY );
        $(placeholder).hide().html( text ).fadeIn( UI_FIGURES[5], function(){
//            $(previously).append(ics);
            $(previously).append('<br>'+ics);
            $(placeholder).html("");
                // animated scroll-up effect
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+UI_FIGURES[0]+")" );
    FIN_framework.printing= false;          

            CRITTER.runner(true);
        });
    }
    return;
}

//// instruction: chapter/story end with text output and link to following (optional)
// TBD
function end(what){

    setTimeout( function(){

        txf('<div style="text-align:center; padding:3em;"><a href="'+what+'.html">'+what+'</a></div>'); //TBD
        
        /*
        shownlinktext = what.split(',')[0];
        nextlink = what.split(',')[1];
        debug_out(shownlinktext+"==>"+nextlink,1);
        if (typeof(nextlink) != "undefined") {
            txf('</br>&nbsp;<a href="'+nextlink+'">'+shownlinktext+'</a></br>');
        }
        else {
            txf('</br>&nbsp;'+shownlinktext+'</br>');
        }
        */
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+UI_FIGURES[0]+")" );
    }, UI_FIGURES[12] ); // << time to avoid messing up with the output stream
}

//// instruction: executes "raw" javascript code (for "count" times) - it's not possible to use " but only '
//function raw(cosa,count) {
function raw(what){
    debug_out(what,1);
    try {
        eval(what);
    }
    catch(err) {
        trigger_error(ERROR_RAW+" "+err.message);
    }            


    /*
    if (typeof(count) == "undefined") {
        count=1;
    }    
    if ( cosa ) {
        debug_out("EXECUTING RAW JS: "+cosa+"/"+count, 2);
        try {
            eval(cosa);
        }
        catch(err) {
            trigger_error(ERROR_RAW+" "+err.message);
        }            
    }
    else {
        trigger_error(ERROR_RAW);
    }
    */
}

//// instruction: replaces synonims to verb objects
function vr0(what){
    // TBD verifiche!!!
//ex: vr0("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_0.syn = ["v_0"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_0.syn.indexOf( wd ) < 0 ) {
            v_0.syn.push( wd );
        }
        if (DICTIONARY.indexOf( wd )<0){
            DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
}
function vr1(what){
    // TBD verifiche!!!
//ex: vr1("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_1.syn = ["v_1"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_1.syn.indexOf( wd ) < 0 ) {
            v_1.syn.push( wd );
        }
        if (DICTIONARY.indexOf( wd )<0){
            DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
}
function vr2(what){
    // TBD verifiche!!!
//ex: vr2("do, doing")
    //var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_2.syn = ["v_2"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_2.syn.indexOf( wd ) < 0 ) {
            v_2.syn.push( wd );
        }
        if (DICTIONARY.indexOf( wd )<0){
            DICTIONARY.push( wd );
        }        
    }
    //TBD: trigger_error();
    return true;
}
function vr3(what){
    // TBD verifiche!!!
//ex: vr3("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_3.syn = ["v_3"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_3.syn.indexOf( wd ) < 0 ) {
            v_3.syn.push( wd );
        }
        if (DICTIONARY.indexOf( wd )<0){
            DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
}

// commute state of an object: open/closed
function com(objn) {
    if ( eval(objn).typ.indexOf("closed") >=0 ) {
        array_remove("closed", eval(objn).typ );
    }
    else {
        eval(objn).typ.push("closed");
    }
}

//
// ## play a sound
//
function pas(soundfile){
    debug_out("PLAY: "+soundfile,1);
    $(LAYOUT.audiofile).attr('src',soundfile);
    if (!UI_settings.soundplayer || $(LAYOUT.audioplayer).css('display')=="none"){

        //$(LAYOUT.audioplayer).fadeIn(UI_FIGURES[7]);
        //UI_settings.soundplayer=true;
        msg(UI_MESSAGES.nomusicplayer);
        $(noaudioicon).fadeIn(UI_FIGURES[7]);
        return;
    }
    try{
        var sound = document.getElementById(LAYOUT.audioplayer.substr(1));
        // loads audio file
        $(LAYOUT.audioplayer)[0].load();
        // starts to play
        sound.play();
        sound.addEventListener('ended',function(){
            debug_out("PLAY-END",2);
            // ...
            // add here the code to auto hide the player on end or obtein other behaviour
        });
    }
    catch(err){
        trigger_error(ERROR_NOTFOUND+'\n'+sound);
    }
}

