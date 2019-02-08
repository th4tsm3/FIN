#!/bin/bash
#
# FIN compiler script
#
# - 2019-01-09
#

# filtro commenti:
# grep -v '^ *//' 

# FIN_DOC=""
# grep '^//' | tr -d '/' | sed 's:^ ::'

# exit in case of error
set -e

SERIAL=`date +"%y%m%d%H%M%S"`
# assembled FIN framework file
FIN="16_fin.js_assembledsource.src"
FINTITLE="01_html_REMARKS-HISTORY.src"
FINSTORY="12_STORY-FILE.src"

OUTDOC="FIN_documentation_"$SERIAL".txt"
#OUTDOC="FIN_documentation_"$SERIAL".md"

FINDIR="./fin"
OUTDIR="./out"
SRCDIR="./src"
# SCRIPTSDIR="./scripts"
TRANSLATOR="./translator"

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

directories=($FINDIR $OUTDIR $SRCDIR $TRANSLATOR )

echo -ne "Checking... "
for ck in ${directories[*]}
do
    directorycheck $ck
done

filecheck $1

#for ck in ${scripts[*]}
#do
#    filecheck $ck
#done

echo -ne "Ok!\n"


# TRANSLATES STORY-INPUT FILE
# traduci.sh input debuglevel outfile


# argument (story-file source to be translated)
if [[ $# -gt 0 ]]
then
#    echo "TRANSLATING: "$1
#    cd translator
    if [[ -z $2 ]]
    then
        DEBUGLEVEL=0
    else
        DEBUGLEVEL=$2
    fi
#    echo "bash traduci.sh $1 $DEBUGLEVEL $SRCDIR/$FINSTORY"
#    exit
    bash traduci.sh $1 $DEBUGLEVEL $SRCDIR/$FINSTORY
else
    echo -e "Story file not found!\nUsage: $0 story-file [debug-level-num]"
    exit 1
fi

#echo "----"; exit

# ...

echo
echo "ASSEMBLING FIN"
# static named output file
cat $FINDIR/*.js > $OUTDIR/$FIN-$SERIAL.js
#echo -e "Produced: $SRCDIR/$FIN"
# uniquely named file for debug
##cat $FINDIR/*.js > $OUTDIR/$FIN-$SERIAL.js
echo -ne "Produced: " && cp -v $OUTDIR/$FIN-$SERIAL.js $SRCDIR/$FIN

# DOCUMENTATION
filecheck $SRCDIR/$FINTITLE

cat $SRCDIR/$FINTITLE > $OUTDIR/$OUTDOC
echo -e "- serial: $SERIAL" >> $OUTDIR/$OUTDOC
# extracts comments from source files
cat $SRCDIR/$FIN | grep '^ *//' | tr -d '/' | sed 's:  *: :g' | sed 's:^ ::' | sed -z 's:\n:\n\n:g' >> $OUTDIR/$OUTDOC
#echo  >> $OUTDIR/$OUTDOC
cat $TRANSLATOR/traduttore_nodejs.js | grep '^ *//' | tr -d '/' | sed 's:  *: :g' | sed 's:^ ::' | sed -z 's:\n:\n\n:g' >> $OUTDIR/$OUTDOC
echo -e "Produced: '$OUTDIR/$OUTDOC'"

# inutile se si produce prima con traduzione
filecheck $SRCDIR/$FINSTORY

# composing STORY-FILE
cat $SRCDIR/*.src > $OUTDIR/$1_$SERIAL.html
echo -e "Produced: '$OUTDIR/$1_$SERIAL.html'"
cp -f $OUTDIR/$1_$SERIAL.html $OUTDIR/$1.html
echo -e "Produced: '$OUTDIR/$1.html'"
### TBD il minificato non funziona
###cat $OUTDIR/$1_$SERIAL.html | sed 's:^ ::' | grep -v '^//' | tr -d '\n' | tr -d '\r' > $OUTDIR/$1_minified.html
echo -e "Produced: '$OUTDIR/$1_minified.html'"


# minificazione: cat ./*.src | grep -v '^ *//' | tr -d '\n' | sed 's:  *: :g'

exit 0

