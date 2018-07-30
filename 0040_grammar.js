//// stima quanto sono simili due parole passate (in %)
function stima_similitudine(a,b) {
// es: stima_similitudine("bosco","boschetto")
// applica approssimazioni: tronca al minimo della prima e considera il primo evento di ricerca carattere con la funzione standard javascript indexOf per identificare il carattere uguale
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
    // per ogni carattere della stringa a...
    for ( var c in va ) {
        if ( va[c] == vb[c] ) {
            sim += qmax;
        }
        else {
            indb = vb.indexOf( va[c] );              // indice del carattere analogo in b (se c'e`, altrimenti -1)
            if ( indb > 0 ) {                       // (se fosse 0 sarebbe il caso sopra)
                // calculates the proximity value from the relative distance in the two arrays
                sim += qmax / (Math.abs(c-indb)); // (calcolo)
            }                                       // altrimenti non aggiungo nulla a sim
        }
    }
//    console.log("stima_similitudine "+a+" vs "+b,sim); // TBD per verifica funzionamento correttore
    return sim;
} // fine: stima_similitudine

//// tenta di correggere la parola passata come argomento e restituisce la correzione probabile in base a un dizionario
function correttore_parole (paroladacontrollare,dizionario,soglia) {
// es: correttore_parole ("boxco",DICTIONARY);
// TBD: utilizzando per ora la funzione stima_similitudine e appoggiandosi al vettore globale "DICTIONARY"
    // if the word is very short it is returned as it is
    if (paroladacontrollare.length < 4){
        return paroladacontrollare;
    }
    debug_out("correttore_parole "+paroladacontrollare+"/"+soglia,3);
    if (typeof(paroladacontrollare)!="string"){
        trigger_error(ERROR_OBJ);
    }
    paroladacontrollare= paroladacontrollare.trim();
    var correzioneprobabile;
    var similitudine = 0;
    var ultimocalcolo;
    var tmpvect = [];
    // per ogni parola presente nel dizionario...
    dizionario.map(
        function (og) {
            ultimocalcolo = stima_similitudine ( paroladacontrollare , og );
            // considero le similitudini calcolate, soltanto se > di soglia %
            if ( ultimocalcolo > similitudine && ultimocalcolo >= soglia ) {
                correzioneprobabile = og;
                similitudine = ultimocalcolo;
            }
        } );
    return correzioneprobabile; //la parola corretta
}



//// sostituzione sottostringa in una stringa lunga. Mozilla: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
function replaceString(trova, sostituisci, qui) { 
    return qui.split(trova).join(sostituisci);
}
