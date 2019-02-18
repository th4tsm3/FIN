//
// # FIN bootstrap
//

// ## preliminary instructions
debug_out("FIN STARTUP: "+STORY+" / BROWSER: "+navigator.userAgent,1);
// sets page title => story title
document.title=STORY;

//
// ## default verbs are linked to the FOCUS
//
FOCUS.lnkTo.unshift("v_0");
FOCUS.lnkTo.unshift("v_1");
FOCUS.lnkTo.unshift("v_2");
FOCUS.lnkTo.unshift("v_3");
// object cloning via jquery method to remember the starting point (for the "story resolver") TBD
var FOCUS_atstart = jQuery.extend(true, {}, FOCUS);
// decoding objectsDefinition content
// TBD bootstrap.js
objectsDefinition=basesixtyfourdecode(objectsDefinition);
// if the type is object it means that JSON has already been recognized
if ( typeof(objectsDefinition) != 'object' ) {
    objectsDefinition=JSON.parse(objectsDefinition);
};
// first loop run: building objects
var it=0;
for ( var ob in objectsDefinition ) {
    it+=1;
    var deffocus=false;
    var og = ob.toLowerCase();
    eval( "var " + og + ' = new fin_object("'+og+'");' );
    // if not present, adds the word to the dictionary
    if (FIN_framework.DICTIONARY.indexOf(og)<0){
        FIN_framework.DICTIONARY.push(og);
    }
};
// checks if default verb objects exist
if ( typeof(v_0)=="undefined" || typeof(v_1)=="undefined" || typeof(v_2)=="undefined" || typeof(v_3)=="undefined") {
    trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+": "+"verb");
};
// second loop run: adding attributes to objects: types, links, synonims, ... 
for ( var o in objectsDefinition ) {
    var og = o.toLowerCase();
    for ( var what in objectsDefinition[og] ) {
        // if the property is not yet defined it is added to the object
        var undef;
        if ( eval(og)[what] === undef ) {
            eval(og)[what]=[];
        }
        debug_out( "ATTRIBUTES: "+og+"/"+what+"/"+objectsDefinition[og][what], 3 );
        for ( var i in objectsDefinition[og][what] ) {
            if ( typeof(objectsDefinition[og][what][i]) == typeof([]) ) {
                var t = objectsDefinition[og][what][i]
            }
            else {
                var t = objectsDefinition[og][what][i].trim();
            }
            debug_out("BUILDING: "+og+" "+what+" "+i+" "+t, 3);
            if ( !what.match(/v_.+/) ) {
                var wd = t.toLowerCase();
            }
            else {
                var wd = t;
            }
            // if the attribute is not present yet, it is added, except for the raw javascipt
            if ( eval(og)[what].indexOf( wd ) < 0 || wd.match(/raw/) ) {
                // type link
                if (what=="lnkTo") {
                    connetti(og,wd);
                }
                // type synonim
                else if (what=="syn") {
                    // DICTONARY building
                    FIN_framework.DICTIONARY.push( wd );
                    eval(og)[what].push( wd );
                }
                // all other attributes
                else {
                    eval(og)[what].push( wd );
                }
            }
        }
    }
};

// setting specific story name identifier (prefix + 6 letters substring + _settings/_bookmark)
FIN_framework.STORY_STORAGE = 'FIN_'+STORY.substr(0,6).replace(/ /g,"_");

