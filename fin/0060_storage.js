//
// # Local Storage management
//
// ## store.js
//
// https://github.com/marcuswestin/store.js#user-content-basic-usage
// stores some data in browser
function store_data_in_browser(thing, content){
    try {
        // stores data via storage.js lib
        store.set(thing, content);
        debug_out("STORED: "+thing+" = "+ recall_data_in_browser(thing) ,1);
    }
    catch (err) {
        trigger_error(ERROR_FATAL);
    }
};

//
// ## recalls data (settings or bookmark)
//
function recall_data_in_browser(thing){
    debug_out(thing,3);
    var x = store.get(thing);
    //if ( typeof(x) != 'undefined' && ( x.split('_')[x.split('_').length-1] == 'settings' || x.split('_')[x.split('_').length-1] == 'bookmark') ) {
    if ( typeof(x) != 'undefined' ) {
        return x;
    }
    else {
        return false;
    }
};

//
// ## recalls FIN bookmark
//
function overlaywin_restore() {
    debug_out("RESTORE-BOOKMARK",1);
    var form=FIN_framework.STORY_STORAGE+'_bookmarks';
    var recalled = recall_data_in_browser(form);
 //TBD   if (){ 
 //   .split('||');
    // TBD che fare per applicare?
    console.log("TBD APPLICARE E VERIFICARE COMANDI APPLICATI",recalled);
    system_popup(FIN_localization.UI_MESSAGES.restoreok);
};

//
// ## saves FIN bookmark
//
function overlaywin_savegame() {
    debug_out("SAVE-BOOKMARK",1);
    var form = FIN_framework.STORY_STORAGE+'_bookmarks';
    var str = FIN_framework.HISTORY.input.join('||');
    store_data_in_browser( form, str );
    // TBD XXXX
    system_popup(FIN_localization.UI_MESSAGES.saveok);
};

//
// ## saves FIN settings
//
function overlaywin_savesettings() {
    debug_out("STORE SETTINGS",1);
    var str = [];
    // forming settings name
    var form=FIN_framework.STORY_STORAGE+'_settings';
    // gets current settings
    FIN_framework.UI_settings['stylesheet']=$("#css_sheet[rel=stylesheet]").attr("href");
    FIN_framework.UI_settings['fontsize']=$("body").css("font-size").replace('px','');
    if ( $(FIN_layout.realclock).css('display') != 'none' ) {
        FIN_framework.UI_settings['showclock']='true';
    }
    else {
        FIN_framework.UI_settings['showclock']='false';
    }
    if (screenfull.isFullscreen) {
        FIN_framework.UI_settings['fullscreen']='true';
    }
    else {
        FIN_framework.UI_settings['fullscreen']='false';
    }
    for (var x in FIN_framework.UI_settings) {
        str.push(FIN_framework.UI_settings[x]);
    }
    str = str.join('||');
    store_data_in_browser( form, str );
    system_popup( FIN_localization.UI_MESSAGES.settingssaved );
};

//
// ## recalls FIN settings
//
function recall_settings() {
    var form=FIN_framework.STORY_STORAGE+'_settings';
    // recalls
    var recalled = recall_data_in_browser(form)
    if (recalled) {
        recalled = recalled.split('||');
        var i = 0;
        for (var x in FIN_framework.UI_settings) {
            debug_out( x+" >> "+recalled[i],1);
            if (recalled[i]=='true'){
                recalled[i] = true;
            }
            else if (recalled[i]=='false'){
                recalled[i] = false;
            }
            FIN_framework.UI_settings[x] = recalled[i];
            i+=1;
        }
    }
    else {
        system_popup(FIN_localization.UI_MESSAGES.nosettingssaved);
    }
    // applies settings
    overlaywin_change_stylesheet(FIN_framework.UI_settings.stylesheet);
    $("body").css("font-size", FIN_framework.UI_settings.fontsize+'px');
    // inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", FIN_framework.UI_settings.fontsize+'px');
    if ( FIN_framework.UI_settings.showclock=='true' && $(FIN_layout.realclock).css('display') == 'none' ) {
        $(FIN_layout.realclock).show();
    }
    // full screen
    if ( FIN_framework.UI_settings.fullscreen && ! screenfull.isFullscreen ) {
        toggleFull();
    }
    setTimeout (function(){
        // word highlighting
        if (FIN_framework.UI_settings.wordhighlight) {
            toggle_wordhighlight(true);
        }
        else {
            toggle_wordhighlight(false)
        }
        // audio player
        if (FIN_framework.UI_settings.soundplayer) {
            $(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        }
    }, FIN_framework.UI_FIGURES[12]);
};

//
// ## deletes all data in browser local storage (not only by FIN)
//
function remove_all_stored_data() {
    debug_out("clear storage");
    store.clearAll();
    system_popup(FIN_localization.UI_MESSAGES.removedall);
};
