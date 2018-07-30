
var slowPrinter = {
    timer : -1,
    count : 0,
    activetag : "",
    intag : false,
    fifo  : [],
    add : function(x){
        slowPrinter.count+=x.length;
        for (i in x) {
        //console.log(x[i]);
        slowPrinter.fifo.push(x[i]);
        }
    },
    get : function(){
        var out = slowPrinter.fifo.shift();
        //var out = "";
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
                //slowPrinter.activetag+=slowPrinter.fifo.shift();
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
        var writeto = document.getElementById( placeholder.substr(1) );
        // puts character in DOM element
//        writeto.innerHTML += out;

//        $(previously).html().substr( 0, $(previously).html().lastIndexOf('</') )
        slowPrinter.activetag = writeto.innerHTML.substr ( writeto.innerHTML.lastIndexOf('</') );
//        if (slowPrinter.intag) {
//            writeto.innerHTML = writeto.innerHTML.substr( 0, writeto.innerHTML.lastIndexOf('</') ) + out + slowPrinter.activetag;

        if (slowPrinter.intag && writeto.innerHTML.indexOf('</')>=0) {
            writeto.innerHTML = writeto.innerHTML.substr( 0, writeto.innerHTML.lastIndexOf('</') ) + out + slowPrinter.activetag;
        }
        else {
            writeto.innerHTML += out;
        }
        slowPrinter.activetag = "";

        if ( ! $(upto).visible(true, true) ) {
            $('html,body').scrollTop( $(upto).offset().top );
        }
        if (slowPrinter.fifo.length==0) {
            slowPrinter.stop();
        }
    },
    delay : function(ms) {
                slowPrinter.get();
                slowPrinter.count-=1;
                var l=slowPrinter.fifo.length;
                slowPrinter.timer = setTimeout( function(){
            // recursion
            if (slowPrinter.count>0 && l>0) {
                slowPrinter.delay(ms);
            }
            // at the end
            else {
                slowPrinter.stop();
            }
        },ms);
    },
    stop : function(){
        clearTimeout(slowPrinter.timer);
        // moves output to "previously"
        //$(previously).append( '<p>' + add_custom_html_tags( $(placeholder).html() + slowPrinter.fifo.join('') , DICTIONARY ) + '</p>' );
        $(previously).append( '<br>'+add_custom_html_tags( $(placeholder).html() + slowPrinter.fifo.join('') , DICTIONARY ) );
        $(placeholder).html("");
        slowPrinter.fifo=[];
        slowPrinter.count=0;
        // animated scroll-up effect
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+UI_FIGURES[0]+")" );
        //CRITTER.runner(true);
        FIN_framework.printing= false;
    }
}

