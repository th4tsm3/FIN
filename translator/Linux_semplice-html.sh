#!/bin/bash

sed -e 's:a`:\&agrave;:g' -e 's:e`:\&egrave;:g' -e "s:e':\&eacute;:g" -e 's:i`:\&igrave;:g' -e 's:o`:\&ograve;:g' -e 's:u`:\&ugrave;:g' -e 's:A`:\&Agrave;:g' -e 's:E`:\&Egrave;:g' -e "s:E':\&Eacute;:g" -e 's:I`:\&Igrave;:g' -e 's:O`:\&Ograve;:g' -e 's:U`:\&Ugrave;:g' $1

