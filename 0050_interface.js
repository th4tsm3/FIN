
// # interface management functions


// system message pseudo pop-up
// qna parameter can be used to inject code to manage question and answer cases, timeout is measured in seconds
// ex: qnacode = '<a onClick="\
//    $(sysmessage).fadeOut(UI_FIGURES[7]);\
//    ">Y</a>/<a onClick="\
//    $(sysmessage).fadeOut(UI_FIGURES[7]);\
//    ">N</a>'
function system_popup(text, qnacode, timeout){
    debug_out(text+" / "+timeout+ " / "+qnacode);
    if (UI_OVERLAY) {
        $(overlaywin).fadeTo(UI_FIGURES[7],UI_FIGURES[4]);
    }
    if (typeof(timeout) == 'undefined' ) {
        // default timeout is 30 seconds
        timeout = 30;
    }
    // if "qna" is "undefined" the window fades away (informative popup)
    if (typeof(qnacode) == 'undefined' ) {
        $(sysmessage).html(text);
        $(sysmessage).fadeIn(UI_FIGURES[7]);
//        $(overlaywin).fadeTo(UI_FIGURES[7],UI_FIGURES[4]);
//        setTimeout('$(sysmessage).fadeOut(UI_FIGURES[7]); if (UI_OVERLAY) { $(overlaywin).fadeTo(UI_FIGURES[7],1); }', UI_FIGURES[12]);
        setTimeout('$(sysmessage).fadeOut(UI_FIGURES[7]); if (UI_OVERLAY) { $(overlaywin).fadeTo(UI_FIGURES[7],1); if (UI_OVERLAY) {$(overlaywin).fadeIn(UI_FIGURES[7]);} }', UI_FIGURES[12]);
    }
    else {
        $(sysmessage).html(text+'<br>'+qnacode);
        $(sysmessage).fadeIn(UI_FIGURES[7]);
        // 30 seconds of absolute timeout to give an answer
//        setTimeout('$(sysmessage).fadeOut(UI_FIGURES[7]); if (UI_OVERLAY) { $(overlaywin).fadeTo(UI_FIGURES[7],1); }',timeout*1000);
        setTimeout('$(sysmessage).fadeOut(UI_FIGURES[7]); if (UI_OVERLAY) { $(overlaywin).fadeTo(UI_FIGURES[7],1); if (UI_OVERLAY) {$(overlaywin).fadeIn(UI_FIGURES[7]);} }', timeout*1000);
    }
}

// asks for activation of full-screen mode via system_popup
function toggleFull(){
    debug_out(DEBUG_TOGGLEFULLSCREEN,1);
    system_popup(UI_MESSAGES.fullscreenrequest,'<a onClick="$(sysmessage).fadeOut(UI_FIGURES[7]);screenfull.request();">'+UI_MESSAGES.yes+'</a>/<a onClick="$(sysmessage).fadeOut(UI_FIGURES[7]);">'+UI_MESSAGES.no+'</a>');
    // default timeout is 30 seconds
}

// toggles word highlighting
        //...CAMBIO TUTTI I TAG
function toggle_wordhighlight(force){
//    return; // TBD
	debug_out("WD-HL change "+force,1);
    // forcing
    if (force==true){
        UI_settings.wordhighlight = true;
//		$("wd").css('background-color', UI_settings.wdcolor );
        $("wd").replaceTagName("wdh");
        return;
    }
    else if (force==false){
        UI_settings.wordhighlight = false;
//    	$("wd").css('background-color','transparent');
        $("wdh").replaceTagName("wd");
        return;
    }
    // toggling value
	if (UI_settings.wordhighlight) {
		UI_settings.wordhighlight = false;
//    	$("wd").css('background-color','transparent');
		//$("wd").css('border-radius','');
        $("wdh").replaceTagName("wd");
		system_popup(UI_MESSAGES.wordhlno);
	}
	else {
	    UI_settings.wordhighlight = true;
        $("wd").replaceTagName("wdh");
//		$("wd").css('background-color', UI_settings.wdcolor );
		//$("wd").css('border-radius', $("wd_set").css('border-radius') );
		system_popup(UI_MESSAGES.wordhlyes);
	}
}

// TBD
function prov(){
    var answ;
    q='<p><span class="mybutton" onClick="answ=true;$(sysmessage).fadeOut('+UI_FIGURES[7]+')">'+UI_YES+'</span>&nbsp;'+'<span class="mybutton" onClick="return false;$(sysmessage).fadeOut('+UI_FIGURES[7]+')">'+UI_NO+'</span></p>';

    askforfullscr( "ciao", function(){if (answ == true)$(sysmessage).fadeOut('+UI_FIGURES[7]+')} );
}

// shows or hides options pseudo-window
function overlaywin_change(todo) {
    // CSS default: display:none;
    debug_out("OVERLAY-request: "+todo,3);
    var arr = get_display_size();
    if (todo=="open"){
        $(outputarea).fadeTo("slow",UI_FIGURES[4]/2);
        $(inputarea).fadeTo("slow",UI_FIGURES[4]/2);
        $(overlaywin).show("slow","swing" );
        // scrolls to the top of the overlaywin contents
        $(overlaywin).animate( { scrollTop: 0 } );
        UI_OVERLAY=true;
    }
    else {
        $(overlaywin).hide("slow","swing");
        $(outputarea).fadeTo("slow",1);
        $(inputarea).fadeTo("slow",1);
        UI_OVERLAY=false;
    }
}

// overlaywin commands: change stylesheet
function overlaywin_change_stylesheet(to) {
    debug_out("STYLESHEET CHANGE-TO: "+to,1);
    // changes stylesheet reference
    $("#css_sheet[rel=stylesheet]").attr("href", to); //.load( function () {//;
    // changes icons style reference
    // white icons
    setTimeout(function(){
    if ( $(".icons_color").css("color") == "rgb(255, 255, 255)" ){
        $(verb_icons).html(verb_buttons.white);
    }
    // black icons
    else if ( $(".icons_color").css("color") == "rgb(0, 0, 0)" ){
        $(verb_icons).html(verb_buttons.black);
    }
    // default (black)
    else {
        $(verb_icons).html(verb_buttons.black);
    }
    //}); //load
    },UI_FIGURES[7]);
}


// gets display info to adapt the elements to the current view
function get_display_size() {
    debug_out("getting display-size info",3);
    var txts = parseFloat($(placeholder).css("font-size"));
    if (document.body.style.fontSize == "") {
        document.body.style.fontSize = txts+"px";
    }
    return [
        parseInt( $(window).height() ),   // 0 returns height of browser viewport
        parseInt( $(window).width() ),    // 1 returns width of browser viewport
        parseInt( $(document).height() ), // 2 returns height of HTML document
        parseInt( $(document).width() ),  // 3 returns width of HTML document
        txts                              // 4 font-size
        ];
}


//// adds custom html tags a(wd or wdh) to the text to recognize word-click/touch
function add_custom_html_tags( text , dizionario ) {
    var raw_split = text.split(/([ '\.])/);
	var got_words = text.split(/\b/);
	var out = "";
	for (i in raw_split) {
		// deletes tags and punctuation for comparison
		var epurated = raw_split[i].replace(/(<\/{0,1}\w*>)/g, "").replace(/[\.,;!\?]/g,"").trim();
		var epuratedLowercased = epurated.toLowerCase();
	    debug_out(raw_split[i]+" // "+epuratedLowercased+" /?/ "+isNullOrEmpty(epurated),3);
		// it's not a word, copy as it is
		if ( isNullOrEmpty(epurated) ) {
			out += raw_split[i];
		}
		else {
			// if it's included in the dictionary, adds the <wd> tag
			if ( dizionario.indexOf(epuratedLowercased) >= 0 ) {
                if (UI_settings.wordhighlight) {
			        out += "<wdh onClick=\'pick_a_word(\""+ epuratedLowercased +"\");\'>"+ raw_split[i] +"</wdh>";
                }
                else {
			        out += "<wd onClick=\'pick_a_word(\""+ epuratedLowercased +"\");\'>"+ raw_split[i] +"</wd>";
                }
			}
			else {
				out += raw_split[i];
			}
		}
	}
    return out;
}

//// adds custom html tags to the text to recognize word-click/touch
function add_custom_html_tagsOLD( text , dizionario ) {
// es: add_custom_html_tags ( "#placeholder" , DICTIONARY )
    // cleans up the text to be checked and splits it word by word
///    var words = text.replace(/[\.,;!\?]/g," ").split(" ");
    var words = text.split(" ");
    var words_testable = text.replace(/(<\/{0,1}\w*>)/g, "").replace(/[\.,;!\?]/g," ").split(" ");
//    var words_testable = text.replace(/(<\/{0,1}\w*>)/g, "").replace(/\'.,;!\?/g, " ").split(" ");
//    var words_testable = text.replace(/(<\/{0,1}\w*>)/g, "").split(/\b/);
    var new_all = "";
    var new_wd;
    // for each word:
    for (var i=0; i < words_testable.length ; i+=1) {
		console.log(">>>>"+words[i]+">>"+words_testable[i]+">>");
       if (!isNullOrEmpty(words_testable[i])) {
        new_wd = words_testable[i].toLowerCase().replace(/[\W]+/g,"");
        // if the (lower-cased) word is in dictionary adds the specific tag, otherwise...
        if ( dizionario.indexOf(new_wd) >= 0 ) {
           new_all += "<wd onClick=\'pick_a_word(\""+new_wd+"\");\'>"+words[i]+"</wd> ";
//            new_all += "<wd onClick=\'pick_a_word(\""+new_wd+"\");\'>"+words_testable[i]+"</wd> ";
			}
        // ... does not add any tag
        else {
            if (!isNullOrEmpty(words[i])) {
            new_all += words[i]+" ";
//            new_all += words_testable[i]+" ";
            }
        }
	   }
    }
    return new_all;
}

//// funzioni dell'interfaccia: gestione icone verbo mouse-onClick
function verb1 () {
    if (UI_ENABLED) {
        var pre = $(inputstring).val();
        // invio il comando v_1 insieme al contenuto preacquisito della stringa input
        command_input_manager( v_1.syn[0]+" "+ pre.toLowerCase() , "touch");
    }
}
function verb2 () {
    if (UI_ENABLED) {
        var pre = $(inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_2.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
}
function verb3 () {
    if (UI_ENABLED) {
        var pre = $(inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_3.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
}


//// realclock show or hide TBD inutile
//function show_realclock(n) {
function toggle_realclock() {
    if ( $(realclock).css('display') != 'none' ) {
        $(realclock).hide();
        system_popup( UI_STR.clockno );
    }
    else {
        $(realclock).show();
        system_popup( UI_STR.clockyes );
    }
}


// TBD-TBC
function right_UI_button() {
    adjust_for_keyb();
    // resets text in right UI button
    $(reqtxtinput).html( UI_TXTIN );
    // resets text in input string space
    $( inputstring ).val("");
}

//// funzioni dell'interfaccia: pulisci comandi
//// cleans up input space
function clr() {
    if (UI_ENABLED) {
        $(inputstring).val("");
//        $(reqtxtinput).html(UI_TXTIN);
        $(reqtxtinput).fadeOut(UI_FIGURES[3], function(){ $(this).text(UI_TXTIN).fadeIn(UI_FIGURES[3]); });
    }
}

//// visualizzazione nella stringa temporanea di feedback (effetti via jquery)
function msg(text) {
    debug_out(text,2);
//    $(inputwidgets).css({ opacity: UI_FIGURES[4] });
    $(inputwidgets).fadeTo("slow", UI_FIGURES[4]); // css({ opacity: UI_FIGURES[4] });
//    $(inputwidgets).fadeOut("slow","swing");
    // aggiorna il messaggio e anima il fade-in
    $(feedback).html(text.replace(/_/g," ")).fadeIn(UI_FIGURES[7]);
    // dopo x millisecondi esegue il fade-out
    //setTimeout('$(feedback).fadeOut('+UI_FIGURES[7]+'); $(inputwidgets).fadeIn("slow","swing");', UI_FIGURES[8] );
    setTimeout('$(feedback).fadeOut('+UI_FIGURES[7]+'); $(inputwidgets).fadeTo("slow", 1);', UI_FIGURES[8] );
//    setTimeout('$(feedback).fadeOut('+UI_FIGURES[7]+'); $(inputwidgets)fadeTo("slow", 1) .css({opacity: 1});', UI_FIGURES[8] );

    //$(feedback).css({ opacity:1 });

}

//// aggiorna l'orologio (va invocata con il setInterval("clock_update()",1000); )
function clock_update() {
    var clk = new Date();
    var h = clk.getHours();
    var m = clk.getMinutes();
    var s = clk.getSeconds();
    if (m < 10) {
        m="0"+m.toString();
    }
    if (s < 10) {
        s="0"+s.toString();
    }
    $(realclock).html( h+":"+m );
    if (!FIN_framework.printing && CRITTER.chores.length>0) {
        CRITTER.runner(true);
    }
//    document.getElementById("CLOCK").innerHTML = h+":"+m; //+"."+s;
}


//-// identifies click/touch on a word in the text stream (works with tags it's not a listener!)
function pick_a_word(arg) {
    if (UI_ENABLED) {
        debug_out("CLICKED/TOUCHED WORD: "+arg.toLowerCase(),4);
//        console.log("HERE",arg);
        $(verb_icons).fadeTo(UI_FIGURES[3], 1.0);
        // applies graphic effects and shows word in "inputarea"
        $(verb_icons).fadeTo(UI_FIGURES[3], 1.0);
        $(inputwidgets).fadeOut(UI_FIGURES[3], function(){
            $(reqtxtinput).text(arg);//.fadeIn(10);
            $(this).fadeIn(UI_FIGURES[3]);
        });
        //adjust_for_touch();
        var pre = $(inputstring).val().toLowerCase();
        if ( ! pre.match(arg.toLowerCase()) ) {
            $(inputstring).val( pre + " " + arg);
            $(verb_icons).fadeTo(UI_FIGURES[3], 1); //1, function() { $(this).fadeTo(500, 1.0); });
        }
        // on 2nd click, v_1 interaction is fired as default
        else {
            command_input_manager( v_1.syn[1]+" "+ pre.toLowerCase() );
        }
    }
}

// adjusts UI for the keyboard input
function adjust_for_keyb() {
    debug_out("ADJUST UI FOR KEYBOARD, "+UI_INPUT,3);
    if (UI_INPUT=="keyboard") {
        return;
    }
    // hide icons & show inputstring
    $(reqtxtinput).show("slow","swing");
    $(verb_icons).hide("slow","swing");
    $(verb_icons).fadeTo("slow", UI_FIGURES[4]);
    $(inputstring).show("slow","swing");
//    if ( $(inputstring).width() > ... TBD
    // porta il focus su inputstring
//    $(inputstring).focus();
    //display_setup();
    UI_INPUT="keyboard";
}

// adjusts UI for the touch input
function adjust_for_touch(){
    debug_out("ADJUST UI FOR TOUCH, "+UI_INPUT,3);
    if (UI_INPUT=="touch") {
        return;
    }    
    $(reqtxtinput).show("slow","swing");
    $(verb_icons).show("slow","swing");
    $(inputstring).hide("slow","swing");
    UI_INPUT="touch";
}

// font set increase
function font_increase(){
    var size = $("body").css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) + 1;
    $("body").css("font-size",newSize+'px');
    // inputstring must be explicitly targeted (why? TBD)
    $(inputstring).css("font-size", newSize+'px');
    return;
}

// font set decrease
function font_decrease(){
    var size = $(placeholder).css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) - 1;
    $("body").css("font-size",newSize+'px');
    // inputstring must be explicitly targeted (why? TBD)
    $(inputstring).css("font-size", newSize+'px');
    return;
}

// adds bookmarks to the overlaywin interface TBD
/*
function show_bookmarks() {
    var bms = recall_bookmarks(STORY);
    if (bms!="" || typeof(bms)=='undefined' ) {
        for (i in bms) {
            var b = bms[i].substring(0,bms[i].indexOf('='));
            debug_out("BOOKMARK: "+b,1);
            /// stub YYY sbagliato! va verificata l'esistenza differentemente
            if ( $( '#'+b ).length <= 0) {
                // setting button for bookmark removal <<<< XXXXX TBD
                $(configuration).append('<span id="'+b+'" style="display:none;" class="mybutton" onClick="remove_cookie(\''+b+'\')">'+UI_REMOVESETTINGS);//+': '+b+'</span>');
                $("#"+b).show("slow","swing");
            }
        }
    }
}
*/

// sets content of the overlaywin with some visual effects
function set_overlay_content(what){
    $(overlay_content).fadeOut(UI_FIGURES[10], function(){
    $(overlay_content).html(what);
    $(overlay_content).fadeIn(UI_FIGURES[10]);
    });
}

// cleans all the output areas
function outputarea_cleanup() {
    $(previously).html('');
    $(placeholder).html('');
}

// initial UI building and tuning
function bootstrap_UI_setup() {
//    outputarea_cleanup();
    // clock start, setting update interval (ms)
    var realclock=setInterval("clock_update()",UI_FIGURES[9]);
    // setting overlaywin tab denominations
    $(overlay_a).html(UI_TABHLP);
    $(overlay_b).html(UI_TABSET);
    $(overlay_c).html(UI_TABABT);
    // default overlay content:
    $(overlay_content).html( MENU_HELP );
    $(overlay_a).addClass('atab');
    // put default message on "reqtxtinput"
    $(reqtxtinput).html(UI_TXTIN); /// QUIQUIQUI TBD
    // takes cookie-stored settings if available and overwrites standard "UI_settings"    
    recall_settings();
    // TBD parametrizzare questo 2.2 altezza default img al bootstrap
    // bottom margin for the output stream
    //$(separator).css('margin-bottom', $(inputarea).outerHeight()*2.2 );
        // default initial input type
//    adjust_for_keyb();
//    layout_setup();

    /*
    if (DEBUG > 0) {
//        $(fader).fadeOut(UI_FIGURES[2]);
        $(inputarea).fadeIn(UI_FIGURES[2]);
    }
    else {
//        $(fader).fadeOut(UI_FIGURES[12], function(){
            $(inputarea).fadeIn(UI_FIGURES[7]);
            // asks confirmation for going fullscreen if set previously (cookie)
            if (UI_settings['fullscreen']=="true") {
                console.log("Go fullscreen?");         ///TBD
                system_popup( UI_MESSAGES.fullscreenrequest+UI_ASKYN, true); // TBD
    //        screenfull.request();
            }
//        });
    }*/
    return true;
}

// wraps all dynamic setups of the graphical layout
function layout_setup() {
    $(inputstring).css("width", parseInt($(previously).css('width'))*4/5+"px" );
    if (typeof(FIXEDIMAGE)!="undefined") {
        if (FIXEDIMAGE>0){
            setup_image(FIXEDIMAGE);
        }
    }
    // fine tuning lower stop-point for the output stream
    $(separator).css('margin-bottom', parseInt($(inputarea).outerHeight()) * UI_settings.marginfactor + 'px' );

}

//
// ** sound player
//
function play_sound(soundobject) {
// html must contain:
// <embed src="piece.wav" autostart="false" width="0" height="0" id="sound1" enablejavascript="true" enablejavascript="true"/>

    if (typeof(soundobject)=="string"){ // TBDXXXX
        // sound data is base64 encoded
        var sound = new Audio("data:audio/wav;base64,"+soundobject);  
    }
    else {
        var sound = document.getElementById(soundobject);
    }
    try{
        sound.Play();
    }
    catch(err){
        trigger_error(ERROR_NOTFOUND+'\n'+sound);
    }
}

//
// ## toggles audioplayer html5 standard interface visualization
//
function toggle_audioplayer(){
    debug_out("AUDIO");
    if (!UI_settings.soundplayer){
        UI_settings.soundplayer=true;
        $(LAYOUT.audioplayer).fadeIn(UI_FIGURES[7]);
        system_popup(UI_STR.playeryes);
        $(noaudioicon).fadeOut(UI_FIGURES[7]);
        $(LAYOUT.audioplayer)[0].load();
    }
    else {
        UI_settings.soundplayer=false;
        $(LAYOUT.audioplayer).fadeOut(UI_FIGURES[7]);
        system_popup(UI_STR.playerno);
        $(noaudioicon).fadeOut(UI_FIGURES[7]);
    }
}


// when the user sets a new size for the browser window (listener)
$(window).resize(function () {
    debug_out("BROWSER-WINDOW-RESIZED: "+get_display_size(),4);
    var dt = 'setTimeout(function(){layout_setup();},1000);';
    if ( CRITTER.chores.indexOf(dt) < 0 ) {
//        system_popup(UI_RESIZINGWIN);
        CRITTER.chores.push(dt);
    }
});

