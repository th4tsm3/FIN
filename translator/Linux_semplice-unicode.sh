#!/bin/bash

tmp1="./tEmPoRaRy.file1"
tmp2="./tEmPoRaRy.file2"

sed 's:a`:à:g' $1 > $tmp1
sed 's:e`:è:g' $tmp1 > $tmp2
sed "s:e':é:g" $tmp2 > $tmp1
sed 's:i`:ì:g' $tmp1 > $tmp2
sed 's:o`:ò:g' $tmp2 > $tmp1
sed 's:u`:ù:g' $tmp1 > $tmp2

sed 's:A` :À :g' $tmp2 > $tmp1
sed 's:E` :È :g' $tmp1 > $tmp2
sed "s:E' :É :g" $tmp2 > $tmp1
sed 's:I` :Ì :g' $tmp1 > $tmp2
sed 's:O` :Ò :g' $tmp2 > $tmp1
sed 's:U` :Ù :g' $tmp1 > $2

rm $tmp1
rm $tmp2

#cat $2 | more
echo " # accenti semplici -> unicode"
