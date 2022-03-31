#!/bin/bash
FILES="HMI/US/portrait/diff-ignore/*.txt"
for f in $FILES
do
	echo $f
	perl -0777 -i.bkp -ne '$#ARGV==1 ? $s=s/\n\z//r : $#ARGV==0 ? $r=$_ :
		print s/\Q$s/$r/gr' $f test HMI/US/portrait/n2t-out/cardEntities.txt
	mv $f.bkp $f
	#mv HMI/US/portrait/n2t-out/cardEntities.txt.bkp HMI/US/portrait/n2t-out/cardEntities.txt
done


        
