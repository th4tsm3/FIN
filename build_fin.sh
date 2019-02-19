#!/bin/bash
#
SCRIPT="FIN compiler script"
#
# - 2019-02-18
#

echo $SCRIPT

# exit in case of error
set -e

SERIAL=`date +"%y%m%d%H%M%S"`
# assembled FIN framework file
FIN="16_fin.js_assembledsource.src"
FINTITLE="01_html_REMARKS-HISTORY.src"
FINSTORY="12_STORY-FILE.src"
OUTFILE="fin.html"
OUTDOC="FIN_documentation.md"

# needed directories:
FINDIR="./fin"
OUTDIR="./out"
DOCDIR="./doc"
SRCDIR="./src"
TRANSLATOR="./translator"
directories=($FINDIR $OUTDIR $DOCDIR $SRCDIR $TRANSLATOR)

# needed files:
FINTRANSL="traduttore_nodejs.js"
TRADUCISCRIPT="traduci.sh"
neededfiles=($TRANSLATOR/$FINTRANSL $TRANSLATOR/$TRADUCISCRIPT)

function directorycheck() {
    if [[ ! -d $1 ]]
    then
        echo "ERROR: $1 directory is missing!"
        exit 1
    fi
}

function filecheck() {
    if [[ ! -f $1 ]]
    then
        echo "ERROR: $1 file is missing!"
        exit 1
    fi
}


############# check #######################################
echo -ne " # checking needed files... "
for ck in ${directories[*]}
do
    directorycheck $ck
done

echo -ne "story-file? "
filecheck $1
echo -ne "Ok! "

echo -ne "Other needed files? "
for ck in ${neededfiles[*]}
do
    filecheck $ck
done
###########################################################


############ translation ##################################
echo -e " # translating story-file"
if [[ $# -gt 0 ]]
then
    if [[ -z $2 ]]
    then
        DEBUGLEVEL=0
    else
        DEBUGLEVEL=$2
    fi
    bash $TRADUCISCRIPT $1 $DEBUGLEVEL $SRCDIR/$FINSTORY
else
    echo -e "Story file not found!\nUsage: $0 story-file [debug-level-num]"
    exit 1
fi
###########################################################


############## assemble ###################################
echo -e " # assembling FIN $SERIAL from sources"
echo -e "//"                           > $SRCDIR/$FIN
echo -e "// FIN-serial: "$SERIAL      >> $SRCDIR/$FIN
echo -e "//"                          >> $SRCDIR/$FIN
cat $FINDIR/*.js                      >> $SRCDIR/$FIN

echo -e " # produced: $SRCDIR/$FIN"
###########################################################


################ build story ##############################
echo -ne " # building story-file... "
cat $SRCDIR/*.src > $OUTDIR/$OUTFILE
echo -ne "$OUTDIR/$OUTFILE\n"
###########################################################


################## documentation ##########################
#cat $OUTDIR/$OUTFILE | grep '^ *//' | tr -d '/' | sed 's:  *: :g' | sed 's:^ ::' | sed -z 's:\n:\n\n:g' > $DOCDIR/$OUTDOC
cat $OUTDIR/$OUTFILE | grep '^ *//' | tr -d '/'         > $DOCDIR/$OUTDOC
echo -en "\n\n----\n\n"                                >> $DOCDIR/$OUTDOC
cat $TRANSLATOR/$FINTRANSL | grep '^ *//' | tr -d '/'  >> $DOCDIR/$OUTDOC
###########################################################
echo "DONE!"
exit 0

# filtro commenti:
# grep -v '^ *//' 
# FIN_DOC=""
# grep '^//' | tr -d '/' | sed 's:^ ::'

### TBD il minificato non funziona
###cat $OUTDIR/$1_$SERIAL.html | sed 's:^ ::' | grep -v '^//' | tr -d '\n' | tr -d '\r' > $OUTDIR/$1_minified.html
#echo -e "Produced: '$OUTDIR/$1_minified.html'"


# minificazione: cat ./*.src | grep -v '^ *//' | tr -d '\n' | sed 's:  *: :g'



