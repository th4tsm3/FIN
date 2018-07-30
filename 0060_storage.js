/*
store.js

https://github.com/marcuswestin/store.js#user-content-basic-usage

// Store current user
store.set('user', { name:'Marcus' })

// Get current user
store.get('user')

// Remove current user
store.remove('user')

// Clear all keys
store.clearAll()

// Loop over all stored values
store.each(function(value, key) { console.log(key, '==', value)})

store.each(function(value, key) {console.log(key, '==', value)})
*/

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
}

// recalls data (settings or bookmark)
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
}

// recalls FIN bookmark
function overlaywin_restore() {
    debug_out("RESTORE-BOOKMARK",1);
    // TBD occhio alla S
    var form=STORY_STORAGE+'_bookmarks';
    var recalled = recall_data_in_browser(form);
 //TBD   if (){ 
 //   .split('||');
    // TBD che fare per applicare?
    console.log("TBD APPLICARE E VERIFICARE COMANDI APPLICATI",recalled);
    system_popup(UI_MESSAGES.restoreok);
}

// saves FIN bookmark
function overlaywin_savegame() {
    debug_out("SAVE-BOOKMARK",1);
    var form=STORY_STORAGE+'_bookmarks';
    var str = HISTORY.input.join('||');
    store_data_in_browser( form, str );
    // TBD XXXX
    system_popup(UI_MESSAGES.saveok);
}

// saves FIN settings
function overlaywin_savesettings() {
    debug_out("STORE SETTINGS",1);
    var str = [];
    // forming settings name
    var form=STORY_STORAGE+'_settings';
    // gets current settings
    UI_settings['stylesheet']=$("#css_sheet[rel=stylesheet]").attr("href");
    UI_settings['fontsize']=$("body").css("font-size").replace('px','');
    if ( $(realclock).css('display') != 'none' ) {
        UI_settings['showclock']='true';
    }
    else {
        UI_settings['showclock']='false';
    }
    if (screenfull.isFullscreen) {
        UI_settings['fullscreen']='true';
    }
    else {
        UI_settings['fullscreen']='false';
    }
    for (var x in UI_settings) {
        str.push(UI_settings[x]);
    }
    str = str.join('||');
    store_data_in_browser( form, str );
    system_popup( UI_MESSAGES.settingssaved );
}

// recalls FIN settings
function recall_settings() {
    var form=STORY_STORAGE+'_settings';
    // recalls
    var recalled = recall_data_in_browser(form)
    if (recalled) {
        recalled = recalled.split('||');
        var i = 0;
        for (var x in UI_settings) {
            debug_out( x+" >> "+recalled[i],1);
            if (recalled[i]=='true'){
                recalled[i] = true;
            }
            else if (recalled[i]=='false'){
                recalled[i] = false;
            }
            UI_settings[x] = recalled[i];
            i+=1;
        }
    }
    else {
        system_popup(UI_MESSAGES.nosettingssaved);
    }
    // applies settings
    overlaywin_change_stylesheet(UI_settings.stylesheet);
    $("body").css("font-size", UI_settings.fontsize+'px');
    // inputstring must be explicitly targeted (why? TBD)
    $(inputstring).css("font-size", UI_settings.fontsize+'px');
    if ( UI_settings.showclock=='true' && $(realclock).css('display') == 'none' ) {
        $(realclock).show();
    }
    // full screen
    if ( UI_settings.fullscreen && ! screenfull.isFullscreen ) {
        toggleFull();
    }
    setTimeout (function(){
        // word highlighting
        if (UI_settings.wordhighlight) {
            toggle_wordhighlight(true);
        }
        else {
            toggle_wordhighlight(false)
        }
        // audio player
        if (UI_settings.soundplayer) {
            $(audioplayer).fadeIn(UI_FIGURES[7]);
        }
    }, UI_FIGURES[12]);
}

function remove_all_stored_data() {
    debug_out("clear storage");
    store.clearAll();
    system_popup(UI_MESSAGES.removedall);
}
