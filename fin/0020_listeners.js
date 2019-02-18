//
// # listeners definitions
//
// ## listener: document.ready
//
// sets up display, prints "intro" text, etc.
$(document).ready(function() {
    debug_out("document.ready",1);
    var now = new Date;
    FIN_framework.startingtime = now;
    // just for debug intents: adds special purpose interface button
    if (DEBUG > 1) {
        $(FIN_layout.inputwidgets).append(
            '<div style="position: fixed; bottom: 0px; left: 0px; height: 2em; z-index:100;">'+
            '<span class="mybutton" onClick="DEBUGGER_button();">LOGGER</span>'+
            '</div>');
    }
    // step 1:
        if (bootstrap_UI_setup()) {
            // after a certain time removes the "curtain" (fader div) and gives the first output of the story
            setTimeout(function() {
                // interface: keyboard/keyboard-only [options: keyboard, touch, (system), keyboard-only, touch-only]
                if (FIN_framework.UI_INPUT.substr(0,8)=="keyboard"){
                    adjust_for_keyb();
                }
                else {
                // interface: touch/click
                    adjust_for_touch();
                }
                // layout fine tuning setup
                layout_setup();
                // START variable must be defined (basic entry point)
                if (typeof(START)=="undefined") {
                    trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+" START");
                }
                START=basesixtyfourdecode(START);
                // START content is pushed in the critter queue as first element
                CRITTER.chores.push(START);
                // removes the "curtain" (fader) element
                $(FIN_layout.fader).fadeOut(FIN_framework.UI_FIGURES[7] );
            }, FIN_framework.UI_FIGURES[7] );
            $(FIN_layout.inputarea).fadeTo(FIN_framework.UI_FIGURES[5],1);
            if ( $(FIN_layout.imagezonecontainer).css('display') == 'none' && FIXEDIMAGE ) {
                setup_image(FIXEDIMAGE);
            }
        }
        if ( !recall_data_in_browser(FIN_framework.STORY_STORAGE+'_settings') && !recall_data_in_browser(FIN_framework.STORY_STORAGE+'_bookmark') ) {
            overlaywin_change("open");
        }
});

//
// ## listener: mouse-click/touch
//
document.onclick = function (w) {
    debug_out("TOUCH/CLICK: "+w.clientX+'/'+w.clientY+" - "+w.target,4);
    // dynamic interface adjustment for click/tuch or keyboard
    if (w.target.id != FIN_layout.reqtxtinput.substr(1,FIN_layout.reqtxtinput.length) && w.target.id != FIN_layout.inputstring.substr(1,FIN_layout.inputstring.length)) {
        adjust_for_touch();
    }
    // stops slow-print effect if it is running
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // stops the mouse-click/touch from further propagation in the DOM
    w.stopPropagation();
};

//
// ## listener: generic mouse-click/touch
//
// prevents text selection on double-click
document.addEventListener('mousedown', function (event) {
    $("html, body").stop(true,true);
    $(FIN_layout.upto).stop(true,true);
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
    $("html, body").stop(true,true);
    $(FIN_layout.upto).stop(true,true);
    // preventing the first keypress from getting lost when switching from touch interface
    if ( $(FIN_layout.inputstring).css('display')=="none" && key.which<=90 && key.which>=48){
        $(FIN_layout.inputstring).val(key.key);
    }
    //
    // ### key [F5]
    //
    // code 116 key on keyboard (standard for browser-reload page) is locked if not in DEBUG mode.
    if (DEBUG == 0) {
        if (key.which == 116) {
            system_popup(FIN_localization.UI_MESSAGES.keylocked);
            key.preventDefault();
            return;
        }
    }
    //
    // ### key [F1] / [ESC]
    //
    // code 112 / 27 keys on keyboard (standard for "help") calls overlaywin/menu
    if (key.which == 112 || key.which == 27) {
        if ( $(FIN_layout.overlaywin).css('display') == 'none' ) {
            overlaywin_change("open");
        }
        else {
            overlaywin_change("close");
        }
        return;
    }
    //
    // ### key [F4]
    //
    // code 115 key on keyboard opens the secondary output window
    if (key.which == 115) {
        open_secondary_window();
        return;
    }

    // after all key checks gives focus to FIN_layout.inputstring
    $(FIN_layout.inputstring).focus();
    // if FIN_layout.feedback is shown
    if ( $(FIN_layout.feedback).css('display') != 'none' ) {
        $(FIN_layout.feedback).fadeOut(FIN_framework.UI_FIGURES[10]);
        $(FIN_layout.inputwidgets).fadeIn(FIN_framework.UI_FIGURES[10]);
    }
    if (FIN_layout.UI_OVERLAY && ( key.which == 8 || key.which == 46)) {
        overlaywin_change("close");
    }
    // stopping slow-print
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // ignoring ctrl, shift, or other unuseful keys. Codes: 16, 17, 18, 37, 38, 39, 40
    if ( key.which != 16 && key.which != 17 && key.which != 18 && key.which != 37 && key.which != 38 && key.which != 39 && key.which != 40 ) {
        adjust_for_keyb();
    }
    if (FIN_framework.UI_ENABLED) {
        //
        // ### key [ENTER]
        //
        // code 13 launches inserted commands
        if (key.which == 13) {
            debug_out("Pressed ENTER key",3);
            if ( $(FIN_layout.inputstring).val().trim().length > 0 ) {
                command_input_manager( $(FIN_layout.inputstring).val(), "keyboard" );
            }
        }
    }
    else {
        // stops further keypress propagation
        key.preventDefault();
    }
});
