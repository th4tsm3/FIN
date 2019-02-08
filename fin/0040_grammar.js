//
// # grammar
// 
// ## 2-words-alike?
function stima_similitudine(a,b) {
// ex: stima_similitudine("bosco","boschetto")
    debug_out("stima_similitudine "+a+" vs "+b,3);
    if ( (typeof(a)!="string") || (typeof(b)!="string") )
        return false;
    var indb;
    var sim = 0;
    var va = a.split('');
    var vb = b.split('');
    // compares va and vb end eventually switches them
    if (vb.length > va.length) {
        var switcher = va;
        va = vb;
        vb = switcher;
    }
    var qmax = 100 / va.length;
    // for each character
    for ( var c in va ) {
        if ( va[c] == vb[c] ) {
            sim += qmax;
        }
        else {
            indb = vb.indexOf( va[c] );
            if ( indb > 0 ) {
                // calculates the proximity value from the relative distance in the two arrays
                sim += qmax / (Math.abs(c-indb));
            }
        }
    }
    return sim;
};

//
// ## word-changer
//
// tries to guess the most similar word
function correttore_parole (paroladacontrollare,dizionario,soglia) {
// ex: correttore_parole ("boxco",FIN_framework.DICTIONARY) >> bosco
    // if the word is very short it is returned as it is
    if (paroladacontrollare.length < 4){
        return paroladacontrollare;
    }
    debug_out("correttore_parole "+paroladacontrollare+"/"+soglia,3);
    if (typeof(paroladacontrollare)!="string"){
        trigger_error(FIN_localization.ERROR_OBJ);
    }
    paroladacontrollare= paroladacontrollare.trim();
    var correzioneprobabile;
    var similitudine = 0;
    var ultimocalcolo;
    var tmpvect = [];
    // for each word in the dictionary
    dizionario.map(
        function (og) {
            ultimocalcolo = stima_similitudine ( paroladacontrollare , og );
            // considered only if above the % threshold
            if ( ultimocalcolo > similitudine && ultimocalcolo >= soglia ) {
                correzioneprobabile = og;
                similitudine = ultimocalcolo;
            }
        } );
    // returns the new word
    return correzioneprobabile;
};

// 
// ## substring substitution
//
// Mozilla: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
function replaceString(trova, sostituisci, qui) { 
    return qui.split(trova).join(sostituisci);
};
