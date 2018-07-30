//
// # global objects definitions
//
// debug message activation must be set with 'var DEBUG=number' in the story-file
// debug verbosity levels: 0-no, 1-base, 2-medium, 3-verbose, 4-complete 
if (typeof(DEBUG)=="undefined"){
    var DEBUG=0;
}

// consecutively failed inputs
var INPUT_FAILED=0;

// time (turns) counter
var TIMELINE = 0;

// WORD HIGHLIGHTING
var WORDHIGHLIGHT=true;

// feedback message
var FEEDBACK_MESSAGE=true;

// settings data structure: suffix: '_settings'
var UI_settings = {
    "stylesheet" : "styles/style_bright.css",
    "wordhighlight" : true,
    "fontsize" : 14,
    "showclock" : false,
    "fullscreen" : false,
    "marginfactor" : 2.1,
    "soundplayer" : false
}

// main page html structure and related definitions:
// image zone (up) if present (see global variable)
// #imagezonecontainer
var imagezonecontainer="#imagezonecontainer";
//  #imagezone
var imagezone="#imagezone";
//0 #main_div
var main_div="#main_div"
//1   #outputarea
//2     #previously
var previously="#previously";
//2     #placeholder
var placeholder="#placeholder";
//2     #separator
var separator="#separator";
//2     #upto
var upto="#upto";
//1   #inputarea
var inputarea="#inputarea";
//2     #feedback
var feedback="#feedback";
//3       #inputwidgets
var inputwidgets="#inputwidgets";
//4         #menu
//4         #inputstring
var inputstring="#inputstring";
//4         #verb_icons
var verb_icons="#verb_icons";
//4         #reqtxtinput
var reqtxtinput="#reqtxtinput";
//4         #CLOCK
var realclock="#CLOCK";
//1   #topgradient
//1   #sysmessage
var sysmessage="#sysmessage";
//1   #overlaywin
//2     #tabcont
var overlaywin="#overlaywin";
//3       #overlay_a, b, c
var overlaywin_a="#overlaywin_a";
var overlaywin_b="#overlaywin_b";
var configuration="#configuration";
var overlaywin_c="#overlaywin_c";
//3       #overlay_content
var overlay_content="#overlay_content";
//4         #closeoverlay
var closeoverlay="#closeoverlay";
//1   #fader
var fader="#fader";
//1   #noaudioicon
var noaudioicon="#noaudioicon";

var LAYOUT = {
//1   #audioplayer
    audioplayer : "#audioplayer",
//2     #audiofile
    audiofile : "#audiofile"
}
// specific story name identifier (prefix + 6 letters substring + _settings/_bookmark)
var STORY_STORAGE='FIN_'+STORY.substr(0,6).replace(/ /g,"_");

// default input method (for the UI startup)
var UI_INPUT="keyboard";//keyboard";

// understandable words dictionary
var DICTIONARY = [];

// all the generated objects are listed here
var ALLOBJECTS = [];

// user-framework interaction history trackers
var HISTORY = {
    raw : [],
    input : [],
    done : []
}

// when set to "false" locks interface input methods (after fatal error for example)
var UI_ENABLED = true;

// pseudo-window state
var UI_OVERLAY = false;

// placeholder text for reqtxtinput
var UI_TXTIN = "...";

// yes/no input dialogue definition
var UI_ASKYN =  '<p><span class="mybutton" onClick="$(sysmessage).fadeOut('+UI_FIGURES[7]+')">'+UI_MESSAGES.yes+'</span>&nbsp;'+
                '<span class="mybutton" onClick="$(sysmessage).fadeOut('+UI_FIGURES[7]+')">'+UI_MESSAGES.no+'</span></p>';

// subtitle definition (opens a <p>)
UI_SUBTIT = '<p style="letter-spacing: 0.35em; border: 1px solid; margin-bottom:0.5em; text-align: center;">';

// help-menu building (default)
var MENU_HELP = '<span id="configuration">'+UI_SUBTIT+UI_MENUHLP+'</p>'+
UI_OVERLAY_HELP_CONTENT+
'</br><span class="mybutton highlighted" id="closeoverlay" onClick="overlaywin_change(\'close\')">'+UI_CLOSEOVERLAYTXT+'</span></br>';

// configuration-menu building
var MENU_CONFIG = '<span id="configuration">'+
UI_SUBTIT+UI_MENUCFG+'</p>'+
UI_STRSTYLES+'</br>'+
'<table>'+
'<tr> <th> <span class="mybutton" onClick="overlaywin_change_stylesheet(\''+UI_STYLEAL+'\')">'+UI_STYLEAN+'</span> </th> <th>'+UI_STYLEAD+'</th> </tr>'+
'<tr> <th> <span class="mybutton" onClick="overlaywin_change_stylesheet(\''+UI_STYLEBL+'\')">'+UI_STYLEBN+'</span> </th> <th>'+UI_STYLEBD+'</th> </tr>'+
'<tr> <th> <span class="mybutton" onClick="overlaywin_change_stylesheet(\''+UI_STYLECL+'\')">'+UI_STYLECN+'</span> </th> <th>'+UI_STYLECD+'</th> </tr>'+
'</table>'+
UI_FONTSIZE+
'<table>'+
'<tr> <th>'+'<span class="mybutton" onClick="font_increase()">'+UI_FONTSIZEI+'</th> <th>'+'</span>&nbsp;<span class="mybutton" onclick="font_decrease()">'+UI_FONTSIZED+'</span></th> </tr>'+
'</table>'+
UI_OTHSETTINGS+
'<table>'+
'<tr> <th> <span class="mybutton" onClick="toggleFull()">'+UI_FULLSCREEN+'</span> </th>'+'</tr>'+
'<tr> <th> <span class="mybutton" onClick="toggle_realclock()">'+UI_STR.clock+"</span> </th>"+'</tr>'+
'<tr> <th> <span class="mybutton" onClick="toggle_wordhighlight()">'+UI_STR.wordhighlight+"</span> </th>"+'</tr>'+
'<tr> <th> <span class="mybutton" onClick="toggle_audioplayer()">'+UI_STR.audioplayer+"</span> </th>"+'</tr>'+
'<tr> <th> <span id="savesettings" class="mybutton highlighted" style="margin:0.5em" onClick="overlaywin_savesettings()">'+UI_SAVESETBUTTON+'</span> </th>'+'</tr>'+
'</table>'+
UI_SUBTIT+UI_CONTROLS+'</p>'+
'<table>'+
'<tr> <th> <span id="savegame"    class="mybutton" onClick="overlaywin_savegame()">'+UI_MESSAGES.save+'</span></th> </tr>'+
'<tr> <th> <span id="restoregame" class="mybutton" onClick="overlaywin_restore()" >'+UI_MESSAGES.restore+'</span></th> </tr>'+
'<tr> <th> <span class="mybutton" onClick="remove_all_stored_data()">'+UI_MESSAGES.removeallstoreddata+'</span> </th> </tr>'+
'<tr> <th> <span class="mybutton" onClick="open_secondary_window()">'+UI_MESSAGES.auxtextout+'</span> </th> </tr>'+
'</table>'+
'</br><span class="mybutton highlighted" id="closeoverlay" onClick="overlaywin_change(\'close\')">'+UI_CLOSEOVERLAYTXT+'</span></br>';

// about-menu
var MENU_ABOUT = UI_OVERLAY_ABOUT_CONTENT+
'</br><span class="mybutton highlighted" id="closeoverlay" onClick="overlaywin_change(\'close\')">'+UI_CLOSEOVERLAYTXT+'</span></br>';

// FIN-verb groups list TBD da integrare nel resto del codice
var FIN_framework = {
    printing : false,
    verbs_attr : ['v_0','v_1','v_2','v_3'],
    startingtime : ""
}

//
// ## basic FIN object constructor
//
function fin_object(nome){
    this.typ = ["object"];
    this.syn = [];
    // points to...
    this.lnkTo = [];
    // is pointed from...
    this.lnkFr = [];
    this.v_0 = [];
    this.v_1 = [];
    this.v_2 = [];
    this.v_3 = [];
    // first synonym is equal to object name (pushed-in by the object constructor)
    this.syn.push(nome.toString()); 
    // each generated object is stored in the global array
    ALLOBJECTS.push(this);
}

