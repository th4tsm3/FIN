//
// # Special effects: text slow-print
//
var slowPrinter = {
    timer : -1,
    count : 0,
    activetag : "",
    // flag to manage html tags
    intag : false,
    fifo  : [],
    // adds text to be printed to the buffer
    add : function(x){
        slowPrinter.count+=x.length;
        for (i in x) {
        slowPrinter.fifo.push(x[i]);
        }
    },
    // gets characters to be printed out of the buffer
    get : function(){
        var out = slowPrinter.fifo.shift();
        debug_out("SLOW-PRINT: "+slowPrinter.count.toString()+" "+out+" ... "+slowPrinter.fifo[0],4);
        if (out=='<') {
            if ( slowPrinter.fifo[0] =='/') {
                slowPrinter.intag = false;
            }
            // ignoring in case of <br> only TBD: non gestisce correttamente tutti i tag
            else if (slowPrinter.fifo[0]=='b' && slowPrinter.fifo[1]=='r'){
                out+=slowPrinter.fifo.shift();
                out+=slowPrinter.fifo.shift();
            }
            else {
                slowPrinter.intag = true;
            }
            while( slowPrinter.fifo[0]!='>' ) {
                out+=slowPrinter.fifo.shift();
            }
            if (slowPrinter.fifo[0]=='>') {
                out+=slowPrinter.fifo.shift();
            }
        }
        //else if (out=='&' && slowPrinter.fifo[0]!=' ') {
        else if (out=='&' && slowPrinter.fifo[0]!=' ') {
            while( slowPrinter.fifo[0]!=';' ) {
                out+=slowPrinter.fifo.shift();
            }
            if (slowPrinter.fifo[0]==';') {
                out+=slowPrinter.fifo.shift();
            }
        }
        var writeto = document.getElementById( FIN_layout.placeholder.substr(1) );
        slowPrinter.activetag = writeto.innerHTML.substr ( writeto.innerHTML.lastIndexOf('</') );
        if (slowPrinter.intag && writeto.innerHTML.indexOf('</')>=0) {
            writeto.innerHTML = writeto.innerHTML.substr( 0, writeto.innerHTML.lastIndexOf('</') ) + out + slowPrinter.activetag;
        }
        else {
            writeto.innerHTML += out;
        }
        slowPrinter.activetag = "";
        // manages scrolling effect
        if ( ! $(upto).visible(true, true) ) {
            $('html,body').scrollTop( $(upto).offset().top );
        }
        if (slowPrinter.fifo.length==0) {
            slowPrinter.stop();
        }
    },
    // delay time between two characters
    delay : function(ms) {
                slowPrinter.get();
                slowPrinter.count-=1;
                var l=slowPrinter.fifo.length;
                slowPrinter.timer = setTimeout( function(){
            // recursion: there is still text to be printed
            if (slowPrinter.count>0 && l>0) {
                slowPrinter.delay(ms);
            }
            // at the end, it stops
            else {
                slowPrinter.stop();
            }
        },ms);
    },
    // operations to be executed at the end:
    stop : function(){
        clearTimeout(slowPrinter.timer);
        // moves printed text to to "previously" area
        $(FIN_layout.previously).append( add_custom_html_tags( $(FIN_layout.placeholder).html() + slowPrinter.fifo.join('') , FIN_framework.DICTIONARY )+'<br>' );
        $(FIN_layout.placeholder).html("");
        slowPrinter.fifo=[];
        slowPrinter.count=0;
        // animated scroll-up effect
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
        FIN_framework.printing= false;
    }
};
