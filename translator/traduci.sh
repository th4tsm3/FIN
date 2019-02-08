#!/bin/bash

# setup:
#DATAdiOGGI=`date +20%y%m%d`
ARGNUM=3

# verifica argomenti:
if [ $# -ne $ARGNUM ] || [ $# -gt $ARGNUM ]
# -ne = not equal
# -gt = greater than
# -lt = less than
then
    echo "uso: $0 file debuglevelnum fileout"
    exit 1
fi

GRP="./graph.html"
TMP="./story.src"
OUT=$3

echo "uso: $0 file debuglevelnum"
echo "TRANSLATING: $1 >> $TMP >> $OUT"

#cp -iv $1 ./story.txt

bash ./Linux_semplice-unicode.sh $1 $TMP


echo "traduttore in node default files:"
echo " < story.src ( $TMP )"
echo " >> tempout.tmp"
nodejs traduttore_nodejs.js # >> tempout.tmp
#echo "var DEBUG=$2;" > story.fin

echo "story.fin PRODUCED!"
mv -iv ./tempout.tmp $OUT

echo "GRAPHING: $1 >> $GRP"
nodejs traduttore_graph_nodejs.js > $GRP
#firefox ./graph.html ../story.html &

exit 0
