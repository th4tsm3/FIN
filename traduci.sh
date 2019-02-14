#!/bin/bash

# exit in case of errors
set -e

# setup:
#DATAdiOGGI=`date +20%y%m%d`
ARGNUM=3
TMP="./story.tmp"
OUT=$3
SCRIPTSDIR="./translator"

# verifica argomenti:
if [ $# -ne $ARGNUM ] || [ $# -gt $ARGNUM ]
# -ne = not equal
# -gt = greater than
# -lt = less than
then
    echo "uso: $0 story-file debuglevelnum fileout"
    exit 1
fi

#GRP="./graph.html"

#echo "uso: $0 file debuglevelnum"
echo "TRANSLATING: $1 -> $TMP -> $OUT"
#cp -iv $1 ./story.txt
bash $SCRIPTSDIR/Linux_semplice-unicode.sh $1 $TMP

echo "CALLING: nodejs $SCRIPTSDIR/traduttore_nodejs.js $TMP $OUT"
echo
# calls nodejs translator
nodejs $SCRIPTSDIR/traduttore_nodejs.js $TMP $OUT
### INUTILE IL CHECK, la chiamata a node va a buon fine, usare process.exitCode = 1 ... ??? TBD
#if [[ $? -gt 0 ]]
#then
#    exit 1
#fi

# debug = 0 -> prod version
echo "var DEBUG=$2;" > $TMP
if [[ $2 -eq 0 ]]
then
    cat "$OUT" >> $TMP
else
    cat "$OUT"_plaintext >> $TMP
fi
mv $TMP $OUT

#echo "GRAPHING: $1 >> $GRP"
#nodejs traduttore_graph_nodejs.js > $GRP
#firefox ./graph.html ../story.html &

exit 0
