#!/bin/bash
# rev04
# trasformazione lettere accentate con ' e ` in formato LaTeX.
# da UTF-8
### FUNZIONA ???

ARGNUM=1
# verifica argomenti:
if [ $# -ne $ARGNUM ] || [ $# -gt $ARGNUM ]
# -ne = not equal
# -gt = greater than
# -lt = less than
then
    echo -e "uso: $0 filedatradurre"
    exit
fi

TMP1="./TeMpOrArY-FiLe1.tmp"
TMP2="./TeMpOrArY-FiLe2.tmp"

# Accenti
sed 's:à:a\`:g' $1 > $TMP1
sed 's:è:e\`:g' $TMP1 > $TMP2
sed 's:ì:i\`:g' $TMP2 > $TMP1
sed 's:ò:o\`:g' $TMP1 > $TMP2
sed 's:ù:u\`:g' $TMP2 > $TMP1
sed "s:é\([^a-zA-Z]\):e\'\1:g" $TMP1 > $TMP2
#sed 's:A`:\\`A:g' $TMP2 > $TMP1
#sed 's:E`:\\`E:g' $TMP1 > $TMP2
#sed 's:I`:\\`I:g' $TMP2 > $TMP1
#sed 's:O`:\\`O:g' $TMP1 > $TMP2
#sed 's:U`:\\`U:g' $TMP2 > $TMP1
#sed "s:E'\([^a-zA-Z]\):\\\'E\1:g" $TMP1 > $TMP2

# Pulizia

# apostrofi non semplici e virgolette
sed "s:’:':g" $TMP2 > $TMP1
sed 's:“:":g' $TMP1 > $TMP2
sed 's:”:":g' $TMP2 > $TMP1

# spazi e maiuscole
# e uppercasetransform prima lett. dopo il '.' 
#sed -e 's:  \+: :g'               \
#    -e 's: *\.\([A-Z]\):\. \1:g'  \
#    -e 's:\. \([a-z]\):\. \u\1:g' \
#    -e 's: *,\([A-Za-z]\):, \1:g' \
#    -e 's: *;\([A-Za-z]\):; \1:g' \
#$TMP2 > $TMP1

# virgolettati < > o << >>
#sed -e 's: *<\+ *:\\enquote\{:g' -e 's: *>\+ *:\}:g' $TMP2

cat $TMP1 # output
rm $TMP1
rm $TMP2

#\U Makes all text to the right uppercase.
#\u makes only the first character to the right uppercase.
#\L Makes all text to the right lowercase.
#\l Makes only the first character to the right lower case. (Note #its a lowercase letter L)
