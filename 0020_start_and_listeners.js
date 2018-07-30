//
// # framework bootstrap and listeners definitions
//

// preliminary instructions
debug_out("FIN STARTUP: "+STORY,1);
// sets page title => story title
document.title=STORY;

//
// ## base sixtyfour decoder
//
function basesixtyfourdecode(what){
    return decodeURIComponent( atob( what ) );
}

//
// ## framework startup at document.ready, sets up display, prints "intro" text, ...
//
$(document).ready(function() {
	debug_out("document.ready",1);
	var now = new Date;
	//var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    FIN_framework.startingtime = now;
    // to be confirmed (debug buttons) TBD
    if (DEBUG > 1) {
        $(inputwidgets).append(
            '<div style="position: fixed; bottom: 0px; left: 0px; height: 2em; z-index:100;">'+
              '<span class="mybutton" onClick="debug_button();">DEBUG</span>'+
              '<span class="mybutton" onClick="ispeziona_allobjects(ALLOBJECTS)">all objs</span>'+
              '<span class="mybutton" onClick="POS()">in-scope</span>'+              
              '<span class="mybutton" onClick="try_button();">solve</span>'+
            '</div>');
    }
    // step 1
        if (bootstrap_UI_setup()) {
        // after a certain time removes the "curtain" (fader div) and gives the first output of the story
            setTimeout(function() {
                if (UI_INPUT=="keyboard"){
                    adjust_for_keyb();
                }
                else {
                    adjust_for_touch();
                }
                layout_setup();
            //    CRITTER.start();
                START=basesixtyfourdecode(START);
                CRITTER.chores.push(START);
                // removes the "curtain" - fader element
                $(fader).fadeOut(UI_FIGURES[7] );
            }, UI_FIGURES[7] );
            $(inputarea).fadeTo(UI_FIGURES[5],1);
            if ( $(imagezonecontainer).css('display') == 'none' && FIXEDIMAGE ) {
                setup_image(FIXEDIMAGE);
            }
        }
        // starting "CRITTER"
//        CRITTER.start();
        if ( !recall_data_in_browser(STORY_STORAGE+'_settings') && !recall_data_in_browser(STORY_STORAGE+'_bookmark') ) {
            overlaywin_change("open");
        }
});




//
// ## listener: mouse-click/touch
//
document.onclick = function (w) {
    debug_out("TOUCH/CLICK: "+w.clientX+'/'+w.clientY+" - "+w.target,4);
    if (w.target.id != "reqtxtinput" && w.target.id != "inputstring") {
        adjust_for_touch();
    }
    // stopping slow-print if it is running
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // stops the mouse-click/touch from further propagation in the DOM
    w.stopPropagation();
}

//
// # prevents text selection on double-click
//
document.addEventListener('mousedown', function (event) {
//    $("html, body").stop(0,0);
    $("html, body").stop(true,true);
    $(upto).stop(true,true);
    if (event.detail > 1) {
        event.preventDefault();
    }
}, false);

//
// ## listener: keyboard-keypress
//
$( document ).keydown(function(key) {
    debug_out("KEYBOARD: "+key.which, 4);
    // stops auto-scrolling animation
//    $("html, body").stop(0,0);
    $("html, body").stop(true,true);
    $(upto).stop(true,true);
    // to prevent the first keypress from getting lost when switching from touch interface
    if ( $(inputstring).css('display')=="none" && key.which<=90 && key.which>=48){
        $(inputstring).val(key.key);
    }
    // [F5] 116 key on keyboard (standard for browser-reload page) is locked if not in DEBUG mode.
    if (DEBUG == 0) {
        if (key.which == 116) {
            system_popup(UI_MESSAGES.keylocked);
            key.preventDefault();
            return;
        }
    }
    // [F1] 112 / [ESC] 27 keys on keyboard (standard for "help") calls overlaywin/menu
    if (key.which == 112 || key.which == 27) {
        if ( $(overlaywin).css('display') == 'none' ) {
            overlaywin_change("open");
        }
        else {
            overlaywin_change("close");
        }
        return;
    }
    // [F4] 115 key on keyboard opens the secondary output window
    if (key.which == 115) {
        open_secondary_window();
        return;
    }
    // gives focus to inputstring
    $(inputstring).focus();
    // if feedback is shown
    if ( $(feedback).css('display') != 'none' ) {
        $(feedback).fadeOut(UI_FIGURES[10]);
        $(inputwidgets).fadeIn(UI_FIGURES[10]);
    }
    if (UI_OVERLAY && ( key.which == 8 || key.which == 46)) {
        overlaywin_change("close");
    }
    // stopping slow-print
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // ignoring ctrl, shift, ...
    if ( key.which != 16 && key.which != 17 && key.which != 18 && key.which != 37 && key.which != 38 && key.which != 39 && key.which != 40 ) {
        adjust_for_keyb();
    }
    if (UI_ENABLED) {
		// [ENTER] 13 launches command
        if (key.which == 13) {
            debug_out("Pressed ENTER key",3);
            if ( $(inputstring).val().trim().length > 0 ) {
                command_input_manager( $(inputstring).val(), "keyboard" );
            }
        }
    }
    else {
        // stops further keypress propagation
        key.preventDefault();
    }
});


