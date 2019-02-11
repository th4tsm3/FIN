# FIN - Framework for Interactive Fiction

### Alessandro Peretti

- 2018-05 -> v01 - Goldfish

- serial: 190211194153


# global objects definitions





## debug status



if DEBUG variable is not defined it is forced to '0' -> debug mode off

verbosity levels: 0 (off=production), 1-minimum, up to 5-maximum



## main FIN object: framework



version build

Flag to be raised when FIN is printing on-screen

feedback message enabling

understandable words dictionary: FIN_framework.DICTIONARY

consecutively failed inputs: global > FIN_framework.INPUT_FAILED

time (turns) counter: global > FIN_framework.TIMELINE

interface default settings

user-framework interaction history trackers: HISTORY raw, input, done

all the generated objects are listed here: FIN_framework.ALLOBJECTS

specific story name identifier (prefix + 6 letters substring + _settings_bookmark): STORY_STORAGE

default input method (for the UI startup): keyboard, touch, (system)

when set to "false" locks interface input methods (after fatal error for example)



## UI timings and other figures



0 scrolling delay

1 word correction %

2 max char length of input string

3 fading time for verb icons

4 non-active UI object opacity

5 text fade-in effect delay

6 ms delay for putchar in slow-print

7 ms delay for message fade-in & fade-out

8 ms delay for message to be shown 

9 ms delay for updating the real clock

10 ms fading for feedback & inputwidgets when interrupted (quick)

11 ms for the CRITTER to execute its chores

12 ms for very slow messages



## layout object



main page html structure and related definitions:

image zone (up) if present (see global variable)

0 #imagezonecontainer

0 #imagezone

0 #main_div

1 #outputarea

2 #previously

2 #placeholder

2 #separator

2 #upto

1 #inputarea

2 #feedback

3 #inputwidgets

4 #menu

4 #inputstring

4 #verb_icons

4 #reqtxtinput

4 #CLOCK

1 #topgradient

1 #sysmessage

1 #overlaywin

2 #tabcont

3 #overlaywin_a, b, c

3 #overlay_content

4 #closeoverlay

1 #fader

1 #noaudioicon

1 #audioplayer

2 #audiofile

placeholder text for reqtxtinput

pseudo-window state



## basic FIN object constructor



function fin_object(nome)

object type:

object -> generic

player -> only one per story, ... TBD

focus -> identifies the point of view (to calculate objects in scope)

verb -> special objects that are used to trigger actions

closed -> a "closed" object stops scope propagation 

synonims

points to...

is pointed from...

connected verbs: type 0 automatically triggered

connected verbs: type 1 superficial interaction

connected verbs: type 2 light interaction

connected verbs: type 3 heavy interaction

first synonym is equal to object name (automatically pushed-in the synonims array by the object constructor)

each generated object is stored in the global array: FIN_framework.ALLOBJECTS



# CRITTER



The CRITTER manages sequential instructions execution

staus flags

if has some instructions in its queue, executes them one by one

commands queue to be executed



# The StoryWalker looks for all the possible playing paths





## StoryWalker critters constructor



initial focus object and objects array are mandatory, id is optional (default value is 0, which forces a new id definition)





## StoryWalker constructor





StoryWalkers collection with methods is added to the FIN_framework object



StoryWalker-id is a unique number: 0000--9999

function define_id() 



## fuzzy decision maker: throws a die



parameter resembles the number of possibilities among we have to choose

function take_decision(possibilities) 

possibilities enumeration starts from 0, so the return value is reduced by 1



## deep copy



returns a deep copy of a json object

function deep_copy(what)

make a deep copy of an object

debug

function walkers()



# listeners definitions



## listener: document.ready



sets up display, prints "intro" text, etc.

just for debug intents: adds special purpose interface button

step 1:

after a certain time removes the "curtain" (fader div) and gives the first output of the story

layout fine tuning setup

START variable must be defined (basic entry point)

START content is pushed in the critter queue as first element

removes the "curtain" (fader) element



## listener: mouse-clicktouch



dynamic interface adjustment for clicktuch or keyboard

stops slow-print effect if it is running

stops the mouse-clicktouch from further propagation in the DOM



## listener: generic mouse-clicktouch



prevents text selection on double-click



## listener: keyboard-keypress



stops auto-scrolling animation

preventing the first keypress from getting lost when switching from touch interface



### key [F5]



code 116 key on keyboard (standard for browser-reload page) is locked if not in DEBUG mode.



### key [F1] [ESC]



code 112 27 keys on keyboard (standard for "help") calls overlaywinmenu



### key [F4]



code 115 key on keyboard opens the secondary output window

after all key checks gives focus to FIN_layout.inputstring

if FIN_layout.feedback is shown

stopping slow-print

ignoring ctrl, shift, or other unuseful keys. Codes: 16, 17, 18, 37, 38, 39, 40



### key [ENTER]



code 13 launches inserted commands

stops further keypress propagation



# Special effects: text slow-print



flag to manage html tags

adds text to be printed to the buffer

gets characters to be printed out of the buffer

ignoring in case of <br> only TBD: non gestisce correttamente tutti i tag

else if (out=='&' && slowPrinter.fifo[0]!=' ') 

manages scrolling effect

delay time between two characters

recursion: there is still text to be printed

at the end, it stops

operations to be executed at the end:

moves printed text to to "previously" area

animated scroll-up effect



# framework management functions





## programmed instructions executioner



verb = verb type

whatobj = target objects (array)

whatactions = actions extracted from object

function execute_instructions(verb,whatobj,whatactions) 

timeline counter is incremented anytime a significative input is recognized

function myReplace(str, group1, group2) 

'||' is used as a separator

function(elem)



## instruction: removes an object from scope (does not destroy the object)



function rem(objt) 

ex: rem("casa");

removes lnkTo from any other linked-object

deletes lnkFrom of the object itself



## instruction: object moving



function mov(stringofinstr) 

ex: mov("fungo, cappuccetto_rosso");

removes link-to from any element found in link-from of the moved object

deletes link-from

new connection link-fromlink-to setup



## instruction: moves "player" special object



function plt(moveto) 

FOCUS special object manipulation, following player movement:

important: modifies the point of view!

current point of view is stored in the last position of the FOCUS.lnkTo array => substituted

FOCUS.lnkTo[FOCUS.lnkTo.length-1],2);



## find object-name (string)



function object_name(di) 

returns object name (first synonim)



## removes "undefined" elements from an array



function elimina_indefiniti(vettore) 

returns cleaned up array



## removes multiple instances (uniq)



function elimina_elementi_ripetuti(array) 

note: 'index', not 'indexOf'

returns cleaned up array



## in-scope objects list



builds the list of the objects currently in-scope

function inscope_objs_list(oggetto) 

ex: console.log(inscope_objs_list( FOCUS ) );

checks if it's a "focus" type special object

function cercatrailink(og) 

looks inside only if the object has not been evaluated yet

in-scope search goes on through linked objects only if starting object is not any of the following types: sit, verb, closed

returns in-scope objects list as an array of strings (object names)



## synonim to object



looks for a word among synonims inside an array of objects

function sinonimo_to_oggetto (parola,vettore) 

returns the corresponding object



## framework error signal



stops with custom message when a FIN framework error occurs

function trigger_error(message) 

stops UI input

alert(FIN_localization.ERROR_FATAL+": "+message+"\nUI: "+FIN_framework.UI_ENABLED);

throws fatal javascript error



## elements comparison



function confronta(un,du) 

ex: confronta(oggettoa, oggettob)

returns "true" or "false"



## verifies link-to presence in an object



function verifica_lnkTo(oggetto, parola) 

ex: verifica_links(oggetto, "casa")

returns "true" or "false"



## verifies link-from presence in an object



function verifica_lnkFr(oggetto, parola) 

ex: verifica_links(oggetto, "casa")

returns "true" or "false"



## defines a link from an object to another



function connetti(da,a) 

ex: connetti("cestino","fungo")

set up link-TO

set up link-FROM

returns "true" if everything worked as expected



## removes an element from an array



function array_remove(element,array) 

returns the purged array or false if it fails



## base sixtyfour decoder



function basesixtyfourdecode(what)

return it as is if we are in debug mode

decodes the array (also converting URI characters) and returns the plain-text version

CLEANED UP UP TO HERE



## story reset function



resets all object links and actions to what stated in the story file at the beginning

function fin_story_reset()

FOCUS = FOCUS_atstart;

console.log("CLEANING");

reset FIN_framework.HISTORY variables

FIN_framework.HISTORY_RAW = [];

console.log( " OBJ-ATTRIBUTES REWRITE: "+og+""+what+""+objectsDefinition[og][what], eval(og)[what] );

console.log( og, what, element[i] );



## automatic execution of in-scope objects v_0 content



function autoexec_v0s()

for repetition prefix '_' the instruction is injected again



## main interpreter function: from instruction to object-action



function command_input_manager(stringa,chiamante) 

function parse_input_text( stringa , focus ) 

records command history

STEP 1: looks for exact correspondance of composite words

converts " " -> "__" (doubles to avoid confusing "v_..." 

first loop looks for composite words

"#" is used as a placeholder for a composite word

STEP 2: corrects the wrong words

function (og) 

STEP 3: loop to find verb and object

var objs = [];

"wk" contains the inputstring corrected and splitted in an array of words

composite words TBDTBC

after correction: text rebuild

looks for the corresponding object

looks for the corresponding object

generic single words

if it's a verb

if it's a different type of object

>> now objs contains the object and found_verb the verb group

verb icons "disabled"

verifies maximum input length

pre-parsing: splitting multiple instructions

check if there is any grammatical separator: , . ;

the identified objects are stored here

default action: in case no verbs have been found -> v_1

STEP 5: looks for actions linked to the verb for each identified object

takes out the instruction from the object if it's not a special one _...

instructions execution

reset of fail-counter

executes recognized instructions considering the verb identified

cleans-up input space

TBD stub

evaluates in-scope objects and executes all v_0 instructions

input not understood by the framework

caller? keyboard touch system

periodic instructions (v0 verbs)



## wrapper to retrieve current focus object name



ex: current_focus()

function current_focus()



# grammar



## 2-words-alike?

function stima_similitudine(a,b) 

ex: stima_similitudine("bosco","boschetto")

compares va and vb end eventually switches them

for each character

calculates the proximity value from the relative distance in the two arrays



## word-changer



tries to guess the most similar word

function correttore_parole (paroladacontrollare,dizionario,soglia) 

ex: correttore_parole ("boxco",FIN_framework.DICTIONARY) >> bosco

if the word is very short it is returned as it is

for each word in the dictionary

function (og) 

considered only if above the % threshold

returns the new word



## substring substitution



Mozilla: https:developer.mozilla.orgen-USdocsWebJavaScriptReferenceGlobal_ObjectsStringsubstring

function replaceString(trova, sostituisci, qui) 



# interface management functions



## system message pseudo pop-up



"qna" parameter can be used to inject code to manage question and answer cases, timeout is measured in seconds

ex: qnacode = '<a onClick="\

$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\

">Y<a><a onClick="\

$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\

">N<a>'

timeout [sec]

function system_popup(text, qnacode, timeout)

if already present (only one popup at a time can be present)

default timeout is 30 seconds

if "qna" is "undefined" the window fades away (informative popup)

ridondanza? TBD setTimeout('if $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) $(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', FIN_framework.UI_FIGURES[12]*2);



## full-screen questioning



asks for activation of full-screen mode via system_popup (fullscreen requires user interaction)

function toggleFull()



## word highlighting



toggles word-highlighting or forces it to onoff (truefalse)

function toggle_wordhighlight(force)

forcing

toggling



## shows or hides options pseudo-window



function overlaywin_change(todo) 

scrolls to the top of the overlaywin contents

Adds FIN version information to the overlay window (operates only at the 2nd opening)



## overlaywin commands: change stylesheet



function overlaywin_change_stylesheet(to) 

changes stylesheet reference

timeout set for DOM loadstartup synchronization

selected stylesheet effective load check, based on the presence of a tag-style with the same basename of the stylesheet file in the .styles directory

system popup to inform of the stylesheet load failure

changes icons style reference

white icons

black icons

default (black)



## gets display info to adapt the elements to the current view



function get_display_size() 

0 returns height of browser viewport

1 returns width of browser viewport

2 returns height of HTML document

3 returns width of HTML document

4 font-size



## adds custom html tags a(wd or wdh) to the text to recognize word-clicktouch



function add_custom_html_tags( text , dizionario ) 

deletes tags and punctuation for comparison

it's not a word, copy as it is

if it's included in the dictionary, adds the <wd> tag



## input-icons: verbs



### verbs group 1



function verb1 () 

invio il comando v_1 insieme al contenuto preacquisito della stringa input



### verbs group 2



function verb2 () 

se era gia` stato indicato un verbo pulisco e aggiungo il nuovo



### verbs group 3



function verb3 () 

se era gia` stato indicato un verbo pulisco e aggiungo il nuovo



## realclock show or hide



function toggle_realclock() 

TBD-TBC

function right_UI_button() 

resets text in right UI button

resets text in input string space



## cleans up input space



function clr() 



## feedback string visualization



function msg(text) 



## real-clock updater



function clock_update() 



## identifies clicktouch on a word in the text stream (works with tags)



function pick_a_word(arg) 

applies graphic effects and shows word in "FIN_layout.inputarea"

on 2nd click, v_1 interaction is fired as default



## adjusts UI for the keyboard input



function adjust_for_keyb() 

hides icons & show FIN_layout.inputstring



## adjusts UI for the touch input



function adjust_for_touch()



## font set increase



function font_increase()

FIN_layout.inputstring must be explicitly targeted (why? TBD)



## font set decrease



function font_decrease()

FIN_layout.inputstring must be explicitly targeted (why? TBD)



## sets content of the overlaywin with some visual effects



function set_overlay_content(what)



## cleans all the output areas



function outputarea_cleanup() 



## initial UI building and tuning



function bootstrap_UI_setup() 

clock start, setting update interval (ms)

setting overlaywin tab denominations

default overlay content:

setting default tab: a, or b, or c 

put default message on "FIN_layout.reqtxtinput"

takes cookie-stored settings if available and overwrites standard "FIN_framework.UI_settings" 



## wraps all dynamic setups of the graphical layout



function layout_setup() 

fine tuning lower stop-point for the output stream



## get all defined CSS selectors



useful to implement checks on css rules definition

function getAllCssSelectors() 



## sound play manager



function play_sound(soundobject) 

html must contain:

<embed src="piece.wav" autostart="false" width="0" height="0" id="sound1" enablejavascript="true" enablejavascript="true">

if sound data is base64 encoded



## toggles audioplayer html5 standard interface visualization



function toggle_audioplayer()



## overlaywin tab switcher



function overlay_tab(what)

1 = CONFIG

2 = ABOUT

0 = HELP

Store current user

Get current user

Remove current user

Clear all keys

Loop over all stored values

stores some data in browser

function store_data_in_browser(thing, content)

stores data via storage.js lib

recalls data (settings or bookmark)

function recall_data_in_browser(thing)

if ( typeof(x) != 'undefined' && ( x.split('_')[x.split('_').length-1] == 'settings' || x.split('_')[x.split('_').length-1] == 'bookmark') ) 

recalls FIN bookmark

function overlaywin_restore() 

TBD if () 

.split('||');

TBD che fare per applicare?

saves FIN bookmark

function overlaywin_savegame() 

TBD XXXX

saves FIN settings

function overlaywin_savesettings() 

forming settings name

gets current settings

recalls FIN settings

function recall_settings() 

recalls

applies settings

inputstring must be explicitly targeted (why? TBD)

full screen

word highlighting

audio player

function remove_all_stored_data() 



# framework: instructions





## instruction: removes an object from scope (does not destroy the object)



function rem(objt) 

ex: rem("casa");

removes lnkTo from any other linked-object

deletes lnkFrom of the object itself



## instruction: object moving



function mov(stringofinstr) 

ex: mov("fungo, cappuccetto_rosso");

removes link-to from any element found in link-from of the moved object

deletes link-from

new connection setup



## instruction: moves "player" special object => modifies FOCUS link



function plt(moveto) 

FOCUS manipulation, following player movement:

important: modifies the point of view

current point of view is stored in the last position of the FOCUS.lnkTo array => substituted

## instruction: graphicsimage changer

function img(imgPath)

TBD

instruction: inserisce una immagine TBD

function imgOLD(im,pc,SizeAndPlacement) 

TBD

$("#placeholder").append('<br><img src="'+im+'" class="el_fadein '+posizione+'" width="'+pc+'%"><br>');

instruction: writes text in the "FIN_layout.placeholder" without any effect

function txt(text)

paragraph form customization

TBD text = "<p>" + text + "<p>";

text = "<br>" + text;

prints without any effect

animated scroll-up effect



### instruction: writes text in the "FIN_layout.placeholder": slow-printing



function txs(text)

paragraph form customization

text = "<p>" + text + "<p>";

text = "<br>" + text;

prints with slow-print

txt('<br>');

da rivedere gli altri print:!!! TBD

instruction: writes text in the "FIN_layout.placeholder": fade-in

function txf(text)

TBD text = "<p>" + text + "<p>";

text = "<br>" + text;

OLD $(FIN_layout.placeholder).hide().html( text ).fadeIn( FIN_framework.UI_FIGURES[5], function()

$(FIN_layout.previously).append(ics);

animated scroll-up effect

instruction: chapterstory end with text output and link to following (optional)

TBD

function end(what)

TBD

<< time to avoid messing up with the output stream

instruction: executes "raw" javascript code (for "count" times) - it's not possible to use " but only '

function raw(cosa,count) 

function raw(what)

instruction: replaces synonims to verb objects

function vr0(what)

TBD verifiche!!!

ex: vr0("do, doing")

var newarray=[];

the first synonim must be the v_...

newarray.push(toput[el].toLowerCase().trim());

TBD: trigger_error();

function vr1(what)

TBD verifiche!!!

ex: vr1("do, doing")

var newarray=[];

the first synonim must be the v_...

newarray.push(toput[el].toLowerCase().trim());

TBD: trigger_error();

function vr2(what)

TBD verifiche!!!

ex: vr2("do, doing")

var newarray=[];

the first synonim must be the v_...

newarray.push(toput[el].toLowerCase().trim());

TBD: trigger_error();

function vr3(what)

TBD verifiche!!!

ex: vr3("do, doing")

var newarray=[];

the first synonim must be the v_...

newarray.push(toput[el].toLowerCase().trim());

TBD: trigger_error();

commute state of an object: openclosed

function com(objn) 



## play a sound



function pas(soundfile)

$(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);

FIN_framework.UI_settings.soundplayer=true;

loads audio file

starts to play

...

add here the code to auto hide the player on end or obtein other behaviour

# debugger functions

TBD prova

function prova() 

TBD document.onclick.stopPropagation();

pulsante TRY

function try_button() 

TBD



## Special button for DEBUG purposes



function DEBUGGER_button() 

raw("PROVAAAA");

debug snippet frpom the web

from: http:jsfiddle.netbladnmanEhUm3 TBD

function callerName() 

function trim(inString) 

function getStringValue(inString) 

function fLeft(inText, delim) 

function fLeftBack(inText, delim) 

function fRight(inText, delim) 

function fRightBack(inText, delim) 

function fBetween(inText, delimLeft, delimRight) 

function isNoE(obj) 

function isNullOrEmpty(obj) 

must test type of base object first

immediate

STRING



## opens a secondary window to output log files etc



function open_secondary_window()

the browser has allowed the opening

+'<div><body><html>'); << tags to be closed... TBD

the browser has blocked it

writes a line of text in the secondary window (SecondaryWindow)

function write_in_secondary_window(what)

TBD

prints debug information if DEBUG global variable is set >0 (see DEBUG) to the console

function debug_out(it,verbosity)

to_stream('<br><i style="font-size: 9pt;">'+it+'<i><br>');

funzione che scrive nella finestra di stream di testo TBD

ora non usata

function to_stream(what) 

$(popupwin.document.body).append(what);

WATCH per un oggetto

function ispeziona_oggetto(ogg) 

ispeziona tutti gli oggetti definiti

function ispeziona_allobjects(vettogg) 

if ( vettogg[i].typ.indexOf("verb") >=0 ) 

debug_out( vettogg[i].syn[0],1 );

debug_out( vettogg[i].lnkTo,1 );

}

inspection of the in-scope objects

function ispeziona_scope (oggpart) 

ispeziona_oggetto(eval(objs[i]));

ispeziona_allobjects(objs);

inspection of current verbs synonims

function ispeziona_verbi() 

POSIZIONE PLAYER TBD

function POS() 

image (<img> tag) fade-out fade-in effect TBD

function change_image(sourceimg) 

displays topgradient if concealed

fades out old image and fades in the new one



NON FUNZIONA PERCHE" il cambio di src riesce sempre, cosa verificarte??? TBD XXXX

setup dynamic image size

function setup_image(verticalfraction)

$("body").prepend('<div id="imagezonecontainer" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:9;margin-left:auto;margin-right:auto;display:none"> <img id="imagezone" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:10;margin-left: auto;margin-right: auto;opacity: 1;" src=""><div> <div>');

$(imagezonecontainer).css('background-image','background-image: url("stylesempty.png")');

$("body").prepend('<div id="imagezonecontainer" style="max-width:100%; max-height:100%; width:auto; height:auto; z-index:10; margin-left: auto; margin-right: auto; display: none" id="fixedimage"><div>');

$(topgradient).css('display','none');

drawImageOnCanvas("http:photojournal.jpl.nasa.govjpegPIA17555.jpg")

img.src = "http:photojournal.jpl.nasa.govjpegPIA17555.jpg";drawImage();

$(imagezonecontainer).css('width').split('px')[0]

$(imagezonecontainer).css('height').split('px')[0]

https:stackoverflow.comquestions10841532canvas-drawimage-scaling

function drawImageOnCanvas(source) TBD

document.getElementById("myImageToDisplayOnCanvas");

"https:panoramacouncil.orgpicscontentheaderPanorama_Rouen1431_neu_4c_c-asisi(1).jpg"

context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*20, imgHeight*20);

context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*10, imgHeight*10);

context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*5, imgHeight*5);

- verb synonims substitutor TBD USATO?

es: verb_substitution("1, fare") >> v_1.syn = ["disfare"] >> ["fare"]

function verb_substitution(what) 

the first is the number that identifies the verb group (it is removed)

adds verb and trims content

trimming and forcing lowercase before loading in the verb object



# FIN bootstrap



## preliminary instructions

sets page title => story title



## default verbs are linked to the FOCUS



object cloning via jquery method to remember the starting point (for the "story resolver") TBD

decoding objectsDefinition content

TBD bootstrap.js

if the type is object it means that JSON has already been recognized

first loop run: building objects

if not present, adds the word to the dictionary

checks if default verb objects exist

second loop run: adding attributes to objects: types, links, synonims, ... 

if the property is not yet defined it is added to the object

if the attribute is not present yet, it is added, except for the raw javascipt

type link

type synonim

DICTONARY building

all other attributes

setting specific story name identifier (prefix + 6 letters substring + _settings_bookmark)

function clean_up_array(array) 

function checkOR(names) 

names is translated to an array

function checkAND(names) 

names is translated to an array



# Story Translator for FIN



rev. 2019-02-11

keywords: tot = length2; start: 0 (step+2); last: length-1 



## translator main object



present version

instructions: sss, ppp, ...

add _ before keyword to be translated for permanent evaluation

sss > txs

fff > txf

snd > pas

img > img

rrr > rem

eee > end

ccc > com

plt > plt

mmm > mov

jjj > raw

### html entities and other signs

<< > laquo;

>> > raquo;

^'" > ldquo;

'^" > rdquo;

--' > mdash;

]]' > br>

### verb changers

vrb0 > 'vr0

vrb1 > 'vr1

vrb2 > 'vr2

vrb3 > 'vr3

keywords:

# <- remark

e <- element-start

x <- element-end

...

verbs keywords:

0 <- group 0

1 <- group 1

2 <- group 2

3 <- group 3

needed keywords: start, player, focus



## takes out values list from a dictionary





## message output manager





## preliminary information



printer(process.argv[2]+" => "+process.argv[3]);



## Checking arguments: inputoutput files



exit: error code (1-general error)



global variables





## splits whole input file



removes carriage returns = \r

splits on new-lines = \n



## splinter 1: line basic treatment



for each element in array...

if there are no more elements it is ignored



## array cleaner function





## total objects counter





## substitutor





## filters and converts string-keywords to instructions



more than one instructions

one instruction only

applies default instruction if no valid keyword is present at the beginning of the converted string



## line parser



console.log(item, el[item][0]);

remark -> ignored

preliminary check:

adding verb groups for the validity check

outputs WARNINGS and ERRORS

keyword: raw javascript row

logger("rem: "+el[item][1]);

### preliminary directives

TBD

PRE+='var DEBUG='+el[item][1].trim()+';\n';

### object

for any object except the first

only for the first object

storing OBJECT NAME

### type

storing TYPES

### synonims

storing SYNONIMS

### verb 0 3 (actually translates ANY number)

storing VERBS INSTRUCTIONS

### links-to

storing LINKS

### object end

last object?

### last item adjustment

last object?



## base64 endcoding (atob btoa in browser environment)



## execute translation

printer("");



## output-file write: debug version (not base 64 encoded)





### checks if needed preliminary keywords are present



printer("WRITING: "+process.argv[3]+"_plaintext");

console.log( PRE+'objectsDefinition='+out);

printer("\n"+PRE);

printer("\n"+PREDEBUG);

process successfully completed

debug printout

must test type of base object first

immediate

STRING

