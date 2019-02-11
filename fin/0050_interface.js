//
// # interface management functions
//
// ## system message pseudo pop-up
//
// "qna" parameter can be used to inject code to manage question and answer cases, timeout is measured in seconds
// ex: qnacode = '<a onClick="\
//    $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\
//    ">Y</a>/<a onClick="\
//    $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\
//    ">N</a>'
// timeout [sec]
function system_popup(text, qnacode, timeout){
    debug_out(text+" / "+timeout+ " / "+qnacode, 2);
    // if already present (only one popup at a time can be present)
    if ($(FIN_layout.sysmessage).css('display')!='none'){
        $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[2]);
        setTimeout( function (){'system_popup('+text+','+qnacode+', '+timeout+')', FIN_framework.UI_FIGURES[2]} );
    }
    if (FIN_layout.UI_OVERLAY) {
        $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],FIN_framework.UI_FIGURES[4]);
    }
    if (typeof(timeout) == 'undefined' ) {
        // default timeout is 30 seconds
        timeout = 30;
    }
    // if "qna" is "undefined" the window fades away (informative popup)
    if (typeof(qnacode) == 'undefined' ) {
        $(FIN_layout.sysmessage).html(text);
        $(FIN_layout.sysmessage).fadeIn(FIN_framework.UI_FIGURES[7]);
        setTimeout('$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', FIN_framework.UI_FIGURES[12]);
        // ridondanza? TBD setTimeout('if $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', FIN_framework.UI_FIGURES[12]*2);
    }
    else {
        $(FIN_layout.sysmessage).html(text+'<br>'+qnacode);
        $(FIN_layout.sysmessage).fadeIn(FIN_framework.UI_FIGURES[7]);
        setTimeout('$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', timeout*1000);
    }
};

//
// ## full-screen questioning
//
// asks for activation of full-screen mode via system_popup (fullscreen requires user interaction)
function toggleFull(){
    debug_out("FULLSCREEN",1);
    system_popup(FIN_localization.UI_MESSAGES.fullscreenrequest,'<a onClick="$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);screenfull.request();">'+FIN_localization.UI_MESSAGES.yes+'</a>/<a onClick="$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);">'+FIN_localization.UI_MESSAGES.no+'</a>');
};

//
// ## word highlighting
//
// toggles word-highlighting or forces it to on/off (true/false)
function toggle_wordhighlight(force){
    debug_out("WD-HL change "+force,1);
    // forcing
    if (force==true){
        FIN_framework.UI_settings.wordhighlight = true;
        $("wd").replaceTagName("wdh");
        return;
    }
    else if (force==false){
        FIN_framework.UI_settings.wordhighlight = false;
        $("wdh").replaceTagName("wd");
        return;
    }
    // toggling
    if (FIN_framework.UI_settings.wordhighlight) {
        FIN_framework.UI_settings.wordhighlight = false;
        $("wdh").replaceTagName("wd");
        system_popup(FIN_localization.UI_MESSAGES.wordhlno);
    }
    else {
        FIN_framework.UI_settings.wordhighlight = true;
        $("wd").replaceTagName("wdh");
        system_popup(FIN_localization.UI_MESSAGES.wordhlyes);
    }
};

//
// ## shows or hides options pseudo-window
//
function overlaywin_change(todo) {
    debug_out("OVERLAY-request: "+todo,3);
    var arr = get_display_size();
    if (todo=="open"){
        $(FIN_layout.outputarea).fadeTo("slow",FIN_framework.UI_FIGURES[4]/2);
        $(FIN_layout.inputarea).fadeTo("slow",FIN_framework.UI_FIGURES[4]/2);
        $(FIN_layout.overlaywin).show("slow","swing" );
        // scrolls to the top of the overlaywin contents
        $(FIN_layout.overlaywin).animate( { scrollTop: 0 } );
        FIN_layout.UI_OVERLAY=true;
    }
    else {
        $(FIN_layout.overlaywin).hide("slow","swing");
        $(FIN_layout.outputarea).fadeTo("slow",1);
        $(FIN_layout.inputarea).fadeTo("slow",1);
        FIN_layout.UI_OVERLAY=false;
    }
    // Adds FIN version information to the overlay window (operates only at the 2nd opening)
    $("#FINVERSION").html(FIN_framework.version);
};

//
// ## overlaywin commands: change stylesheet
//
function overlaywin_change_stylesheet(to) {
    debug_out("STYLESHEET CHANGE-TO: "+to,1);
    // changes stylesheet reference
    $("#css_sheet[rel=stylesheet]").attr("href", to);
    // timeout set for DOM load/startup synchronization
    setTimeout(function(){
        // selected stylesheet effective load check, based on the presence of a tag-style with the same basename of the stylesheet file in the ./styles/ directory
        try{
            var selectors_list = getAllCssSelectors();
            var tmp = to.split('.')[0];
            tmp = tmp.split('/')[tmp.split('/').length-1];
            if ( selectors_list.indexOf(tmp) >= 0 ) {
                debug_out("stylesheet found");
            }
        }
        catch (ERR) {
            debug_out("stylesheet not found");
            // system popup to inform of the stylesheet load failure
            system_popup( to+" <- "+FIN_localization.ERROR_NOTFOUND);
            debug_out("default-style"+ERR, 1);
        }
        // changes icons style reference
        // white icons
        if ( $(".icons_color").css("color") == "rgb(255, 255, 255)" ){
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.white);
        }
        // black icons
        else if ( $(".icons_color").css("color") == "rgb(0, 0, 0)" ){
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.black);
        }
        // default (black)
        else {
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.black);
        }
    },FIN_framework.UI_FIGURES[7]);
};

//
// ## gets display info to adapt the elements to the current view
//
function get_display_size() {
    debug_out("getting display-size info",3);
    var txts = parseFloat($(FIN_layout.placeholder).css("font-size"));
    if (document.body.style.fontSize == "") {
        document.body.style.fontSize = txts+"px";
    }
    return [
        // 0 returns height of browser viewport
        parseInt( $(window).height() ),
        // 1 returns width of browser viewport
        parseInt( $(window).width() ),
        // 2 returns height of HTML document
        parseInt( $(document).height() ),
        // 3 returns width of HTML document
        parseInt( $(document).width() ),
        // 4 font-size
        txts
        ];
};

//
// ## adds custom html tags a(wd or wdh) to the text to recognize word-click/touch
//
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
                if (FIN_framework.UI_settings.wordhighlight) {
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
};

//
// ## input-icons: verbs
//
// ### verbs group 1
//
function verb1 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // invio il comando v_1 insieme al contenuto preacquisito della stringa input
        command_input_manager( v_1.syn[0]+" "+ pre.toLowerCase() , "touch");
    }
};
//
// ### verbs group 2
//
function verb2 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_2.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
};
//
// ### verbs group 3
//
function verb3 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_3.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
};

//
// ## realclock show or hide
//
function toggle_realclock() {
    if ( $(FIN_layout.realclock).css('display') != 'none' ) {
        $(FIN_layout.realclock).hide();
        system_popup( FIN_localization.UI_STR.clockno );
    }
    else {
        $(FIN_layout.realclock).show();
        system_popup( FIN_localization.UI_STR.clockyes );
    }
};

// TBD-TBC
function right_UI_button() {
    adjust_for_keyb();
    // resets text in right UI button
    $(FIN_layout.reqtxtinput).html(FIN_layout.UI_TXTIN);
    // resets text in input string space
    $(FIN_layout.inputstring).val("");
};



//
// ## cleans up input space
//
function clr() {
    if (FIN_framework.UI_ENABLED) {
        $(FIN_layout.inputstring).val("");
        $(FIN_layout.reqtxtinput).fadeOut(FIN_framework.UI_FIGURES[3], function(){ $(this).text(FIN_layout.UI_TXTIN).fadeIn(FIN_framework.UI_FIGURES[3]); });
    }
};

//
// ## feedback string visualization
//
function msg(text) {
    debug_out(text,2);
    $(FIN_layout.inputwidgets).fadeTo("slow", FIN_framework.UI_FIGURES[4]);
    $(FIN_layout.feedback).html(text.replace(/_/g," ")).fadeIn(FIN_framework.UI_FIGURES[7]);
    setTimeout('$(FIN_layout.feedback).fadeOut('+FIN_framework.UI_FIGURES[7]+'); $(FIN_layout.inputwidgets).fadeTo("slow", 1);', FIN_framework.UI_FIGURES[8] );
};

//
// ## real-clock updater
//
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
    $(FIN_layout.realclock).html( h+":"+m );
    if (!FIN_framework.printing && CRITTER.chores.length>0) {
        CRITTER.runner(true);
    }
};

//
// ## identifies click/touch on a word in the text stream (works with tags)
//
function pick_a_word(arg) {
    if (FIN_framework.UI_ENABLED) {
        debug_out("CLICKED/TOUCHED WORD: "+arg.toLowerCase(),4);
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1.0);
        // applies graphic effects and shows word in "FIN_layout.inputarea"
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1.0);
        $(FIN_layout.inputwidgets).fadeOut(FIN_framework.UI_FIGURES[3], function(){
            $(FIN_layout.reqtxtinput).text(arg);
            $(this).fadeIn(FIN_framework.UI_FIGURES[3]);
        });
        var pre = $(FIN_layout.inputstring).val().toLowerCase();
        if ( ! pre.match(arg.toLowerCase()) ) {
            $(FIN_layout.inputstring).val( pre + " " + arg);
            $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1);
        }
        // on 2nd click, v_1 interaction is fired as default
        else {
            command_input_manager( v_1.syn[1]+" "+ pre.toLowerCase() );
        }
    }
};

//
// ## adjusts UI for the keyboard input
//
function adjust_for_keyb() {
    debug_out("ADJUST UI FOR KEYBOARD, "+FIN_framework.UI_INPUT,3);
    if (FIN_framework.UI_INPUT=="keyboard") {
        return;
    }
    // hides icons & show FIN_layout.inputstring
    $(FIN_layout.reqtxtinput).show("slow","swing");
    $(FIN_layout.verb_icons).hide("slow","swing");
    $(FIN_layout.verb_icons).fadeTo("slow", FIN_framework.UI_FIGURES[4]);
    $(FIN_layout.inputstring).show("slow","swing");
    FIN_framework.UI_INPUT="keyboard";
};

//
// ## adjusts UI for the touch input
//
function adjust_for_touch(){
    debug_out("ADJUST UI FOR TOUCH, "+FIN_framework.UI_INPUT,3);
    if (FIN_framework.UI_INPUT=="touch") {
        return;
    }
    $(FIN_layout.reqtxtinput).show("slow","swing");
    $(FIN_layout.verb_icons).show("slow","swing");
    $(FIN_layout.inputstring).hide("slow","swing");
    FIN_framework.UI_INPUT="touch";
};

//
// ## font set increase
//
function font_increase(){
    var size = $("body").css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) + 1;
    $("body").css("font-size",newSize+'px');
    // FIN_layout.inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", newSize+'px');
    return;
};

//
// ## font set decrease
//
function font_decrease(){
    var size = $(FIN_layout.placeholder).css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) - 1;
    $("body").css("font-size",newSize+'px');
    // FIN_layout.inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", newSize+'px');
    return;
};

//
// ## sets content of the overlaywin with some visual effects
//
function set_overlay_content(what){
    $(FIN_layout.overlay_content).fadeOut(FIN_framework.UI_FIGURES[10], function(){
    $(FIN_layout.overlay_content).html(what);
    $(FIN_layout.overlay_content).fadeIn(FIN_framework.UI_FIGURES[10]);
    });
};

//
// ## cleans all the output areas
//
function outputarea_cleanup() {
    $(FIN_layout.previously).html('');
    $(FIN_layout.placeholder).html('');
};

//
// ## initial UI building and tuning
//
function bootstrap_UI_setup() {
    // clock start, setting update interval (ms)
    FIN_layout.realclock_interval=setInterval("clock_update()",FIN_framework.UI_FIGURES[9]);
    // setting overlaywin tab denominations
    $(FIN_layout.overlay_a).html(FIN_localization.UI_TABHLP);
    $(FIN_layout.overlay_b).html(FIN_localization.UI_TABSET);
    $(FIN_layout.overlay_c).html(FIN_localization_2.UI_TABABT);
    // default overlay content:
    $(FIN_layout.overlay_content).html( FIN_localization_3.MENU_HELP );
    // setting default tab: a, or b, or c 
    $(FIN_layout.overlay_a).addClass('atab');
    // put default message on "FIN_layout.reqtxtinput"
    $(FIN_layout.reqtxtinput).html(FIN_layout.UI_TXTIN);
    // takes cookie-stored settings if available and overwrites standard "FIN_framework.UI_settings"    
    recall_settings();
    return true;
};

//
// ## wraps all dynamic setups of the graphical layout
//
function layout_setup() {
    $(FIN_layout.inputstring).css("width", parseInt($(FIN_layout.previously).css('width'))*4/5+"px" );
    if (typeof(FIXEDIMAGE)!="undefined") {
        if (FIXEDIMAGE>0){
            setup_image(FIXEDIMAGE);
        }
    }
    // fine tuning lower stop-point for the output stream
    $(FIN_layout.separator).css('margin-bottom', parseInt($(FIN_layout.inputarea).outerHeight()) * FIN_framework.UI_settings.marginfactor + 'px' );

};

//
// ## get all defined CSS selectors
//
// useful to implement checks on css rules definition
function getAllCssSelectors() {
    var ret = [];
    for(var i = 0; i < document.styleSheets.length; i++) {
        var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
        for(var x in rules) {
            if(typeof rules[x].selectorText == 'string') ret.push(rules[x].selectorText);
        }
    }
    return ret;
};

//
// ## sound play manager
//
function play_sound(soundobject) {
// html must contain:
// <embed src="piece.wav" autostart="false" width="0" height="0" id="sound1" enablejavascript="true" enablejavascript="true"/>
    if (typeof(soundobject)=="string"){
        // if sound data is base64 encoded
        var sound = new Audio("data:audio/wav;base64,"+soundobject);  
    }
    else {
        var sound = document.getElementById(soundobject);
    }
    try{
        sound.Play();
    }
    catch(err){
        trigger_error(FIN_localization.ERROR_NOTFOUND+'\n'+sound);
    }
};

//
// ## toggles audioplayer html5 standard interface visualization
//
function toggle_audioplayer(){
    debug_out("AUDIO");
    if (!FIN_framework.UI_settings.soundplayer){
        FIN_framework.UI_settings.soundplayer=true;
        $(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        system_popup(FIN_localization.UI_STR.playeryes);
        $(FIN_layout.noaudioicon).fadeOut(FIN_framework.UI_FIGURES[7]);
        $(FIN_layout.audioplayer)[0].load();
    }
    else {
        FIN_framework.UI_settings.soundplayer=false;
        $(FIN_layout.audioplayer).fadeOut(FIN_framework.UI_FIGURES[7]);
        system_popup(FIN_localization.UI_STR.playerno);
        $(FIN_layout.noaudioicon).fadeOut(FIN_framework.UI_FIGURES[7]);
    }
};

//
// ## overlaywin tab switcher
//
function overlay_tab(what){
    // 1 = CONFIG
    if (what == 1){
        set_overlay_content( FIN_localization_3.MENU_CONFIG );
        $(FIN_layout.overlay_b).addClass('atab');
        $(FIN_layout.overlay_a).removeClass('atab');
        $(FIN_layout.overlay_c).removeClass('atab');
    }
    // 2 = ABOUT
    else if (what ==2){
        set_overlay_content( FIN_localization_3.MENU_ABOUT );
        $(FIN_layout.overlay_c).addClass('atab');
        $(FIN_layout.overlay_a).removeClass('atab');
        $(FIN_layout.overlay_b).removeClass('atab');
    }
    // 0 = HELP
    else {   
        set_overlay_content( FIN_localization_3.MENU_HELP );
        $(FIN_layout.overlay_a).addClass('atab');
        $(FIN_layout.overlay_b).removeClass('atab');
        $(FIN_layout.overlay_c).removeClass('atab');
    }
};
