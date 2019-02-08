//
// # Story Translator for FIN
//
/*

PART A

&&  - and/contempor. > ...
$$  - subsequently   > ", "

REGOLE:
nessuno spazio all'inizio riga (confermato?)
keyword (lettera) [spazio] istruzioni [senza mai "a capo"], usare le entities html per a capo, ecc
ci deve essere sempre una istruzione in testa alla riga dopo la keyword
x per terminare la definizione dell'oggetto4
ordine delle keyword e` importante TBD?
i verbi devono sempre avere come 1o sinonimo v_1...ecc!


codifica base64:
If you need to convert to Base64 you could do so using Buffer:
console.log(Buffer.from('Hello World!').toString('base64'));
Reverse (assuming the content you're decoding is a utf8 string):
console.log(Buffer.from(b64Encoded, 'base64').toString());


*/

// keywords: tot = length/2; start: 0 (step+2); last: length-1 

//
// ## translator main object
//
var FIN_translator = {
    // present version
    version : 1,
    valid_instructions : [
// instructions: sss, ppp, ...
// add _ before keyword to be translated for permanent evaluation
        // sss > txs
        'sss','txs(\\"',
        // fff > txf
        'fff','txf(\\"',
        // snd > pas
        'snd','pas(\\"',
        // img > img
        'img','img(\\"',
        // rrr > rem
        'rrr','rem(\\"',
        // eee > end
        'eee','end(\\"',
        // ccc > com
        'ccc','com(\\"',
        // plt > plt
        'plt','plt(\\"',
        // mmm > mov
        'mmm','mov(\\"',
        // jjj > raw
        'jjj','raw(\\"',
        // ### html entities and other signs
        // << > laquo;
        '<<','&laquo;',
        // >> > raquo;
        '>>','&raquo;',
        // ^'" > ldquo;
        "^'",'&ldquo;',
        // '^" > rdquo;
        "'^",'&rdquo;',
        // --' > mdash;
        '--','&mdash;',
        // ]]' > br>
        ']]','<br>',
        // ### verb changers
        // vrb > 'vr0
        'vrb0','vr0(\\"',
        // vrb > 'vr1
        'vrb1','vr1(\\"',
        // vrb > 'vr2
        'vrb2','vr2(\\"',
        // vrb > 'vr3
        'vrb3','vr3(\\"'
    ],
    keywords : {
        remark : "#",
        objstart : "o",
        objend : "x",
        type : "t",
        synonims : "s",
        linkto : "l",
        splitseq : "$$",
        splitand : "&&",
        rawjs : "j",
        start : "start",
        story : "story",
        debug : "debug",
        player : "player",
        focus : "focus"
    },
    // needed keywords: start, player, focus
    needed : 4
};

//
// ## message output manager
//
function printer(arg) {
    console.log(arg);
};

//
// ## preliminary information
//
printer("FIN translator - version "+FIN_translator.version);
//printer(process.argv[2]+" => "+process.argv[3]);

//
// ## Checking arguments: input/output files
//
if (typeof(process.argv[2]) == "undefined" || typeof(process.argv[3]) == "undefined") {
    printer("Usage: "+process.argv[1]+" SOURCE-FILE DESTINATION-FILE");
    printer("No action");
    // exit: error code (1-general error)
    return 1;
};

//
// global variables
//
var fs = require('fs');
var readSource = process.argv[2]; //// <<<<
var contenuti;
var PRE="";
var PREDEBUG="";

//
// ## splits whole input file
//
function whole_splitter(data){
    var tmp1, tmp2;
    // removes carriage returns = \r
    tmp1 = data.replace(/\x0D/g,'');
    // splits on new-lines = \n
    tmp2 = tmp1.split(/\x0A/g);
    data = tmp2;
    return data;
}

//
// ## splinter 1: line basic treatment
//
function splint1(data){
    var countlines = 0;
    var tmp1, tmp2, tmp3=[];
    // for each element in array...
    for (el in data) {
        countlines+=1;
        if (data[el].toString().trim().toLowerCase()=="x"){
            tmp3.push("x");
        }
        else {
            tmp1 = data[el].split(/ (.+)/);
            tmp2 = array_cleanup(tmp1);
            // if there are no more elements it is ignored
            if (el > 0) {
                tmp3.push(tmp2);
            }
        }
    }
    return tmp3;
}

//
// ## array cleaner function
//
function array_cleanup(obj) {
    var newarray = [];
    if (typeof(obj)!=typeof(newarray)){
        return false;
    }
    for (el in obj){
        if ( !(obj[el].trim() == '' || typeof(obj[el]) == "undefined") ){
            newarray.push(obj[el].trim());            
        }
    }
    return newarray;
}

//
// ## total objects counter
//
function count_objs(data){
    var count=0;
    for (item in data){
        if (data[item][0]=="o"){
            count+=1;
        }
    }
    return count;
}

//
// ## substitutor
//
function substituting(str){
    var subst=str.trim();
    for (var i=0; i < FIN_translator.valid_instructions.length; i+=2){
        var replace = FIN_translator.valid_instructions[i]+" ";
        var re = new RegExp(replace,"g");
        subst = subst.replace(re, FIN_translator.valid_instructions[i+1]);
    }
    subst+='\\");';
    return subst;
}

//
// ## filters and converts string-keywords to instructions
//
function string_filtering(str){
    buildnew="";
    var app1=str.split(FIN_translator.keywords.splitseq);
    for (bit in app1){
        var app2=app1[bit].split(FIN_translator.keywords.splitand)
        // more than one instructions
        if (app2.length>1){
            for (it in app2){
                buildnew+=substituting(app2[it].trim());
            }
        }
        // one instruction only
        else {
            buildnew+=substituting(app1[bit].trim());
        }
    }
    return buildnew;
}

//
// ## line parser
//
function parse_line(el, objsc){
    var STREAM="";
    var someproperties=false;
    var firstobject=true;
    for (item in el){
        // remark -> ignored
        if (el[item][0]==FIN_translator.keywords.remark){
            continue;
        }
        // preliminary check:
        if ( !( el[item][0].toLowerCase().trim()== 'l' || el[item][0].toLowerCase().trim()== '3' || el[item][0].toLowerCase().trim()== '2' || el[item][0].toLowerCase().trim()== '1' || el[item][0].toLowerCase().trim()== '0' || el[item][0].toLowerCase().trim()== 'x' || el[item][0].toLowerCase().trim()== 'j' || el[item][0].toLowerCase().trim()== 'o' || el[item][0].toLowerCase().trim()== 't' || el[item][0].toLowerCase().trim()== 's' || el[item][0].toLowerCase().trim()== 'start' || el[item][0].toLowerCase().trim()== 'story' || el[item][0].toLowerCase().trim()== 'debug' || el[item][0].toLowerCase().trim()== 'focus' || el[item][0].toLowerCase().trim()== 'player') || el[item][0].trim()== '#' ){
            // outputs WARNINGS and ERRORS
            printer("WARNING: wrong keyword >> "+el[item][0]+" >> "+el[item][1]);
        }
        if (someproperties && el[item][0].toLowerCase().trim()!=FIN_translator.keywords.objend){
            STREAM+=',';
        }
        // keyword: raw javascript row
        if (el[item][0]==FIN_translator.keywords.rawjs){
            //logger("rem: "+el[item][1]);
            PRE+=el[item][1].trim();
            PREDEBUG+=el[item][1].trim();
        }
        // ### preliminary directives
        if(el[item][0].toLowerCase().trim()==FIN_translator.keywords.start){
            PRE+='var START="'+basesixtyfour( string_filtering( el[item][1] ) )+'";\n';
            PREDEBUG+='var START="'+string_filtering( el[item][1] )+'";\n';
            FIN_translator.needed-=1;
        }
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.story){
            PRE+='var STORY="'+el[item][1].trim()+'";\n';
            PREDEBUG+='var STORY="'+el[item][1].trim()+'";\n';
            FIN_translator.needed-=1;
		}
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.debug){
            // TBD
            //PRE+='var DEBUG='+el[item][1].trim()+';\n';
            PREDEBUG+='var DEBUG='+el[item][1].trim()+';\n';
		}
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.player){
            PRE+='var PLAYER="'+el[item][1].trim()+'";\n';
            PREDEBUG+='var PLAYER="'+el[item][1].trim()+'";\n';
            FIN_translator.needed-=1;
        }
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.focus){
            PRE+='var FOCUS={typ:["focus"],syn:["FOCUS"],lnkTo:["'+el[item][1].trim()+'"]};';
            PREDEBUG+='var FOCUS={typ:["focus"],syn:["FOCUS"],lnkTo:["'+el[item][1].trim()+'"]};';
            FIN_translator.needed-=1;
        }
        // ### object
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.objstart){
        someproperties=false;
            objsc-=1;			
            // for any object except the first
            if( firstobject==false ){
                if (objsc>=0){
				    STREAM+=',';
                }
            }
            // only for the first object
            else {
                firstobject=false;
            }
            // storing OBJECT NAME
            STREAM+='"'+ el[item][1].trim() +'"';
            STREAM+=':{';
        }
        // ### type
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.type){
            if (someproperties==false) {
                someproperties=true;
            }
            STREAM+='"typ":[';
            var vett = el[item][1].split(',');
            for (i in vett){
                // storing TYPES
                STREAM+='"'+vett[i].trim()+'"';
                if (i<vett.length-1){
                    STREAM+=',';
                }
            }
            STREAM+='],';
        }
        // ### synonims
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.synonims){
            if (someproperties==false) {
                someproperties=true;
            }
            STREAM+='"syn":[';
            var vett = el[item][1].split(',');
            for (i in vett){
                // storing SYNONIMS
                STREAM+='"'+vett[i].trim()+'"';
                if (i<vett.length-1){
                    STREAM+=',';
                }            
            }
            STREAM+='],';
        }
        // ### verb 0 / 3
        else if ( !isNaN(el[item][0]) ){
            if (someproperties==false) {
                someproperties=true;
            }
            STREAM+='"v_'+el[item][0]+'":[';
            var subsequents = el[item][1].split(FIN_translator.keywords.splitseq);
            for (i in subsequents){
                // storing VERBS
                STREAM+='"'+ string_filtering( subsequents[i].trim() )+'"';
                if (i<subsequents.length-1){
                    STREAM+=',';
                }
            }
            STREAM+='],';
        }
        // ### links-to
        else if (el[item][0].toLowerCase().trim()==FIN_translator.keywords.linkto){
            if (someproperties==false) {
                someproperties=true;
            }
            STREAM+='"lnkTo":[';
            if (typeof(el[item][1])!="undefined"){
                var vett = el[item][1].split(',');
                for (i in vett){
                    // storing LINKS
                    STREAM+='"'+vett[i].trim()+'"';
                    if (i<vett.length-1){
                        STREAM+=',';
                    }            
                }
            }
            STREAM+=']';
        }
        // ### object end
        else if (el[item][0].trim().toLowerCase()==FIN_translator.keywords.objend){
            if (someproperties==false) {
                STREAM+='},';
                // last object?
                if (STREAM.substr(STREAM.length-1) == ','){
                    STREAM=STREAM.substr(0,STREAM.length-1);
                }
            }
            else {
                STREAM+='}';
            }
            someproperties=false;
        }
        // ### last item adjustment
        if (item == el.length-1 || objsc<=0){
            // last object?
            if (STREAM.substr(STREAM.length-1) == ','){
                STREAM=STREAM.substr(0,STREAM.length-1);
            }
        }
        if (STREAM.substr(STREAM.length-1) == ','){
                STREAM=STREAM.substr(0,STREAM.length-1);
            }    
        }
    if (STREAM.substr(STREAM.length-2) == ',}'){
        STREAM=STREAM.substr(0,STREAM.length-2)+'}';
    }    
	STREAM+='}';
	//return(GENERAL+STREAM);
	return(STREAM);
}

//
// ## base64 endcoding (atob / btoa in browser environment)
//
function basesixtyfour(text){
    try {
        var x = encodeURIComponent(text);
        return Buffer( encodeURIComponent(text) ).toString('base64');
    }
    catch(err){
        printer("ERROR basesixtyfour! ",err);        
    }
}

// ## execute translation
try {
///    printer("");
    contenuti = fs.readFileSync(readSource, "utf8");
    data = whole_splitter(contenuti);
    var out = '{"v_0":{"typ":["verb"],"syn":[],"lnkTo":[],"lnkFr":[],"v_0":[],"v_1":[],"v_2":[],"v_3":[]},"v_1":{"typ":["verb"],"syn":[],"lnkTo":[],"lnkFr":[],"v_0":[],"v_1":[],"v_2":[],"v_3":[]},"v_2":{"typ":["verb"],"syn":[],"lnkTo":[],"lnkFr":[],"v_0":[],"v_1":[],"v_2":[],"v_3":[]},"v_3":{"typ":["verb"],"syn":[],"lnkTo":[],"lnkFr":[],"v_0":[],"v_1":[],"v_2":[],"v_3":[]},'+ parse_line( splint1( data ), count_objs( data ) );

    //
    // ## output-file write: debug version (not base 64 encoded)
    //

//
// ### checks if needed preliminary keywords are present
//
if (FIN_translator.needed != 0) {
    printer("ERROR: Some PRELIMINARY KEYWORDS are missing!");
    printer("The following are mandatory: "+FIN_translator.keywords.story+", "+FIN_translator.keywords.start+", "+FIN_translator.keywords.player+", "+FIN_translator.keywords.focus);
    return 1;
}


    ////printer("WRITING: "+process.argv[3]+"_plaintext");
    fs.writeFileSync(process.argv[3]+"_plaintext", PREDEBUG+'var objectsDefinition='+out, 'utf8');
    printer("");
    printer("WRITTEN: "+process.argv[3]+"_plaintext");
    out = '"'+ basesixtyfour(out) +'";';
    ////console.log( PRE+'objectsDefinition='+out);
    fs.writeFileSync(process.argv[3], PRE+'var objectsDefinition='+out, 'utf8');
    printer("WRITTEN: "+process.argv[3]);
    ////printer("\n"+PRE);
    ////printer("\n"+PREDEBUG);
}
catch (err){
    printer("OUTPUT ERROR! ",err);
    return 1;
}

// process successfully completed
return 0;

/*********************************************************/


// debug printout
function logger(it){
    console.log(callerName() +" >> "+it.toString());
}

function callerName() {
    try {
        var myCallee = arguments.callee;
        var hisCallee = myCallee.caller.arguments.callee;
        var hisCallerName = hisCallee.caller.name;

        if (isNoE(hisCallerName)) {
            var hisCallersFunction = hisCallee.caller.toString();
            if (!isNoE(hisCallersFunction)) {
                hisCallerName = fBetween(hisCallersFunction, "function", "(");
            }
        }
        hisCallerName = trim(hisCallerName);
    }
    catch (ex) {
        hisCallerName = "";
    }

    if (isNoE(hisCallerName)) {
        return "(anonymous)";
    }

    return hisCallerName;
}


function trim(inString) {
    return inString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function getStringValue(inString) {
    if (inString == null || inString == "undefined" || inString == "null" || inString == "[object]" || inString == "[object NodeList]") {
        return "";
    }

    try {
        var tString = new String(inString);
        return tString.toString();
    } catch (e) {
        return "";
    }
}

function fLeft(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(0, theSpot);
    }
    return outText;
}

function fLeftBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(0, theSpot);
    return outText;
}

function fRight(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(theSpot + delim.length, inText.length);
    }
    return outText;
}

function fRightBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(theSpot + delim.length, inText.length);
    return outText;
}

function fBetween(inText, delimLeft, delimRight) {
    return fLeft(fRight(inText, delimLeft), delimRight);
}

function isNoE(obj) {
    return isNullOrEmpty(obj);
}

function isNullOrEmpty(obj) {

    // must test type of base object first
    if (typeof obj == "undefined") {
        return true;
    }

    // immediate
    if (obj == undefined || obj == null) {
        return true;
    }

    // STRING
    return getStringValue(obj) == "";
}
/*********************************************************/


