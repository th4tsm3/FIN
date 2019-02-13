//
// # framework: instructions
//

//
// ## instruction: removes an object from scope (does not destroy the object)
//
function rem(objt) {
// ex: rem("casa");
    debug_out(objt,2);
    var ogg = objt.trim().toLowerCase();
//    var undef;
    if (typeof(eval(ogg))=="object"){
        for (var i=0 ; i < eval(ogg).lnkFr.length ; i+=1) {
            // removes lnkTo from any other linked-object
            array_remove( ogg, eval(eval(ogg).lnkFr[i]).lnkTo );
        }
        // deletes lnkFrom of the object itself
        eval(ogg).lnkFr = [];
    }
    else {
        trigger_error(FIN_localization.ERROR_RAW+" typeof >> "+ogg);
    }
    return;
};

//
// ## instruction: object moving
//
function mov(stringofinstr) {
// ex: mov("fungo, cappuccetto_rosso");
    debug_out(stringofinstr,2);
    var splitting = stringofinstr.split(',');
    var ogg = $.trim(splitting[0]).toLowerCase();
    var dove = $.trim(splitting[1]).toLowerCase();
    var undef;
    for (var i=0 ; i < eval(ogg).lnkFr.length ; i+=1) {
        // removes link-to from any element found in link-from of the moved object
        array_remove( ogg, eval(eval(ogg).lnkFr[i]).lnkTo );
    }
    // deletes link-from
    eval(ogg).lnkFr = [];
    if ( !(dove == "" || dove==undef) ) {
        // new connection setup
        connetti(dove, ogg);    
    }
    return;    
};

//
// ## instruction: moves "player" special object => modifies FOCUS link
//
function plt(moveto) {
    debug_out(moveto,2);
    if ( eval(PLAYER.toLowerCase()).typ.indexOf("player") >= 0 ) {
        mov(PLAYER+','+moveto);
        // FOCUS manipulation, following player movement:
        // important: modifies the point of view
        // current point of view is stored in the last position of the FOCUS.lnkTo array => substituted
        FOCUS.lnkTo.pop();
        FOCUS.lnkTo.push( moveto.toLowerCase() );
        debug_out("NEW FOCUS: "+current_focus(),2);
        return;
    }
    else {
        trigger_error(FIN_localization.ERROR_NOPLY);
    }
};

// ## instruction: graphics/image changer
function img(imgPath){
// TBD
    change_image(imgPath);
    return;
};

//// instruction: inserisce una immagine TBD
function imgOLD(im,pc,SizeAndPlacement) {
    if (typeof(SizeAndPlacement)=="undefined") {
        SizeAndPlacement=30;
    }
    // TBD
    $(FIN_layout.previously).append(FIN_localization.OUT_IMG_PREV+im+FIN_localization.OUT_IMG_MEDI+pc+FIN_localization.OUT_IMG_POST);
    //$("#placeholder").append('</br><img src="'+im+'" class="el_fadein '+posizione+'" width="'+pc+'%"/></br>');
};

//// instruction: writes text in the "FIN_layout.placeholder" without any effect
function txt(text){
    // paragraph form customization
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txt: "+text+"/", 3);
    // prints without any effect
    $(FIN_layout.previously).append( '<br>'+add_custom_html_tags( text, FIN_framework.DICTIONARY ) );
    // animated scroll-up effect
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
    return;
};

//
// ### instruction: writes text in the "FIN_layout.placeholder": slow-printing
//
function txs(text){
    // paragraph form customization
//    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txs: "+text+"/", 3);
    FIN_framework.printing= true;
    // prints with slow-print

/*    if(CRAWLER.working) {
        txt(text);
    }
    else {
*/
        //txt('<br>');
        slowPrinter.add(text);
        slowPrinter.delay(FIN_framework.UI_FIGURES[6]);
    /*}*/
        
    /*
    if (typeof(CRAWLER)!="undefined") {
        if(CRAWLER.working) {
            txt(text);
        }
    }
    else {
        slowprinter_add(text);
        slowprinter_delay(FIN_framework.UI_FIGURES[6]);
    }
    */
    return;
};

// da rivedere gli altri print:!!! TBD
//// instruction: writes text in the "FIN_layout.placeholder": fade-in
function txf(text){
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txf: "+text+"/", 3);
    FIN_framework.printing= true;
/*        if(CRAWLER.working) {
        txt(text);
    }

    else {
*/
        var ics = '<br>'+add_custom_html_tags( text, FIN_framework.DICTIONARY );
//  OLD      $(FIN_layout.placeholder).hide().html( text ).fadeIn( FIN_framework.UI_FIGURES[5], function(){
        $(FIN_layout.placeholder).hide().html( '<br>'+text ).fadeIn( FIN_framework.UI_FIGURES[5], function(){
//            $(FIN_layout.previously).append(ics);
            $(FIN_layout.previously).append(ics);
            $(FIN_layout.placeholder).html("");
                // animated scroll-up effect
            CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
            FIN_framework.printing= false;          
            CRITTER.runner(true);
        });
/*    }
*/
    return;
};

//// instruction: chapter/story end with text output and link to following (optional)
// TBD
function end(what){

    setTimeout( function(){

        txf('<div style="text-align:center; padding:3em;"><a href="'+what+'.html">'+what+'</a></div>');
        //TBD
        
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
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
    }, FIN_framework.UI_FIGURES[12] );
    // << time to avoid messing up with the output stream
};

//// instruction: executes "raw" javascript code (for "count" times) - it's not possible to use " but only '
//function raw(cosa,count) {
function raw(what){
    debug_out(what,1);
    try {
        eval(what);
    }
    catch(err) {
        trigger_error(FIN_localization.ERROR_RAW+" "+err.message);
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
            trigger_error(FIN_localization.ERROR_RAW+" "+err.message);
        }            
    }
    else {
        trigger_error(FIN_localization.ERROR_RAW);
    }
    */
};

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
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};
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
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};
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
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }        
    }
    //TBD: trigger_error();
    return true;
};
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
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};

// commute state of an object: open/closed
function com(objn) {
    if ( eval(objn).typ.indexOf("closed") >=0 ) {
        array_remove("closed", eval(objn).typ );
    }
    else {
        eval(objn).typ.push("closed");
    }
};

//
// ## play a sound
//
function pas(soundfile){
    debug_out("PLAY: "+soundfile,1);
    $(FIN_layout.audiofile).attr('src',soundfile);
    if (!FIN_framework.UI_settings.soundplayer || $(FIN_layout.audioplayer).css('display')=="none"){

        //$(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        //FIN_framework.UI_settings.soundplayer=true;
        msg(FIN_localization.UI_MESSAGES.nomusicplayer);
        $(noaudioicon).fadeIn(FIN_framework.UI_FIGURES[7]);
        return;
    }
    try{
        var sound = document.getElementById(FIN_layout.audioplayer.substr(1));
        // loads audio file
        $(FIN_layout.audioplayer)[0].load();
        // starts to play
        sound.play();
        sound.addEventListener('ended',function(){
            debug_out("PLAY-END",2);
            // ...
            // add here the code to auto hide the player on end or obtein other behaviour
        });
    }
    catch(err){
        trigger_error(FIN_localization.ERROR_NOTFOUND+'\n'+sound);
    }
};

