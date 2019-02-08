
var sourcefile = 'story.src';

var PART_1='<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="icon" href="data:image/x-icon;base64,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"><title>FIN graphs</title></head><body><div class="mermaid">\n';
var PART_2='</div><script src="graphlibs/mermaid.min.js"></script><script>mermaid.initialize({startOnLoad:true});</script></body></html>';

var fs = require('fs');
var readSource = sourcefile; //// <<<<
/** Using the readFile API - Asynchronous */
//https://www.google.com/url?q=https://nodejs.org/api/fs.html%23fs_fs_readfilesync_path_options&sa=D&source=hangouts&ust=1522933246762000&usg=AFQjCNHDDoTeISrRIKxX5PHsieD1ATfAdA

//fs.readFileSync(readSource, "utf8"); // << versione sincrona!

fs.readFile(readSource, "utf8", function(err, wholedata){
    if ( err ){
        throw err;
    }
    // 1: splits lines
    var head = wholedata.split('--HEADER--')[0];
    var data = wholedata.split('--HEADER--')[1];

    data = whole_splitter(data);
    objects_num = count_objs(data);

    // OUTPUT
    
    var out = parse_line( splint1( data ), count_objs( data ) );

    console.log(PART_1);
    console.log(out);
    console.log(PART_2);

});
/*********************************************************************/

// splits whole input file
function whole_splitter(data){
    var tmp1, tmp2;
//    console.log("SPLITTER");
    // removes \r
    tmp1 = data.replace(/\x0D/g,'');
    // splits on \n
    tmp2 = tmp1.split(/\x0A/g);
    data = tmp2;
    return data;
}

// splinter 1: line basic treatment
function splint1(data){
    var tmp1, tmp2, tmp3=[];
//    console.log("SPLINT1");
    // for each element in array...
    for (el in data) {
        //console.log(el,">",data[el],typeof(data[el]));
        if (data[el].toString().trim().toLowerCase()=="x"){
            tmp3.push("x");
        }
        else {
        //console.log(el,">>>",data[el],typeof(data[el]));

            tmp1 = data[el].split(/ (.+)/);
            tmp2 = array_cleanup(tmp1);
            // if there are no more elements it is ignored
            if (el > 0) {
                //logger(el+" >> "+tmp2);
                tmp3.push(tmp2);
            }
        }
    }
    return tmp3;
}

// array cleaner function 
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

// debug printout
function logger(it){
    console.log(callerName() +" >> "+it.toString());
}

// total objects counter
function count_objs(data){
    var count=0;
    for (item in data){
    // object
        if (data[item][0]=="o"){
            count+=1;
        }
    }
    return count;
}

function substituting(str){
    var subst=str.trim();
///no:    var pattern = //g ;
    for (var i=0; i < valid_instructions.length; i+=2){
        var replace = valid_instructions[i]+" ";
        var re = new RegExp(replace,"g");
  //      console.log('\n',replace,'\n');
//       console.log(">>",subst,'>>',re,">",valid_instructions[i],valid_instructions[i+1]);
        subst = subst.replace(re, valid_instructions[i+1]);
//       console.log('<<',subst,'\n');
    }
    subst+='\\");';
    //console.log(">>>",subst.trim());
    //return str.trim().replace(/ppp/g,'plt(\\"').replace(/sss/,'txs(\\"').replace(/fff/,'txf(\\"').replace(/rrr/,'raw(\\"')+'\\");';
    //
//        console.log('\n',subst,'\n');
    return subst;
}

// filters and converts string-keywords to instructions
function string_filtering(str){
    
    buildnew="";
    var app1=str.split('$$');
    for (bit in app1){
        //console.log( app1[bit].trim() );
        var app2=app1[bit].split('&&')
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

// instructions translator
function translate_instructions(str){
    
    return ;
}

// line parser
function parse_line(el, objsc){
    var STREAM="";
    var someproperties=false;
    var firstobject=true;
    var objn;
    for (item in el){
//        if (someproperties && el[item][0].toLowerCase().trim()!='x'){
//            STREAM+=',';
//        }
        //////////////////////////
        // remark -> ignored
	if (el[item][0]=="#"){
            ;
        }
        //////////////////////////
        // object
        else if (el[item][0].toLowerCase().trim()=="o"){
        someproperties=false;
            objsc-=1;			
            // for any object except the first
            if( firstobject==false ){
                //if (objsc>=0){
		    //STREAM+=' |NONFIRST|\n';
                //}
;
            }
            // only for the first object
            else {
                firstobject=false;
//NO COSI` STREAM+="graph OG_"+objsc+';\n';
STREAM+="graph LR\n";
            }
            // storing OBJECT NAME
            objn = el[item][1].trim();
            //STREAM+= objn;
            //STREAM+=':{';
        }
/*
        //////////////////////////
        // verb 0 / 3
        else if ( !isNaN(el[item][0]) ){
            if (someproperties==false) {
                someproperties=true;
            }
            STREAM+='"v_'+el[item][0]+'":[';
            var subsequents = el[item][1].split('$$');
            for (i in subsequents){
                // storing VERBS
                STREAM+='"'+ string_filtering( subsequents[i].trim() )+'"';
                if (i<subsequents.length-1){
                    STREAM+=',';
                }
            }
            STREAM+='],';
        }
*/
        //////////////////////////
        // links-to
        else if (el[item][0].toLowerCase().trim()=="l"){
            if (someproperties==false) {
                someproperties=true;
            }
            //STREAM+='-->';
            if (typeof(el[item][1])!="undefined"){
                var vett = el[item][1].split(',');
                for (i in vett){
                    // storing LINKS
                    //STREAM+=vett[i].trim();
                    //if (i<vett.length-1){
                    //    STREAM+=',';
                    //}            
                // build here
                STREAM += objn +"-->"+vett[i].trim()+";\n";
                }
            }
            ////////STREAM+=']XXX}';
            //STREAM+=']';
        }

        //////////////////////////
        // . << object end
        else if (el[item][0].trim().toLowerCase()=="x"){
            if (someproperties==false) {
                STREAM+='\n';
                // last object?
                if (STREAM.substr(STREAM.length-1) == '\nPROP: '){
                    STREAM=STREAM.substr(0,STREAM.length-1);
                }
            }
            else {
                STREAM+='\n';
            }
            someproperties=false;
            // last object?
           // if (STREAM.substr(STREAM.length-1) == ','){
            //    STREAM=STREAM.substr(0,STREAM.length-1);
            //}
            //STREAM+="}";
        }

        // last item adjustment
        if (item == el.length-1 || objsc<=0){
        //if (objsc<=0){
            // last object?
            if (STREAM.substr(STREAM.length-1) == ','){
                STREAM=STREAM.substr(0,STREAM.length-1);
            }
        //STREAM+='}';
        }
//        console.log(">>",STREAM);
            if (STREAM.substr(STREAM.length-1) == ','){
                STREAM=STREAM.substr(0,STREAM.length-1);
            }    
                // last object?
	}
	
	    //if (STREAM.substr(STREAM.length-2) == ',}'){
            //    STREAM=STREAM.substr(0,STREAM.length-2)+'}';
            //}    
                // last object?
                
	//STREAM+='\nEND';
	return(STREAM);
}

/*********************************************************/
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

