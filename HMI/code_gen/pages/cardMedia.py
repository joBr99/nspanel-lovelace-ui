from shared import *
head = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
              // command format: entityUpd,heading,navigation,[,type,internalName,iconId,iconColor,displayName,optionalValue]x6
              spstr strCommand.txt,tHeading.txt,"~",1                            
""" + navigation
print(head)
print("""
              //entity name
              spstr strCommand.txt,entn.txt,"~",3
              //title
              spstr strCommand.txt,tTitle.txt,"~",4
              //title farbe
              spstr strCommand.txt,tTmp.txt,"~",5
              if(tTmp.txt!="")
              {
                covx tTmp.txt,tTitle.pco,0,0
              }
              //author
              spstr strCommand.txt,tAuthor.txt,"~",6
              //author farbe
              spstr strCommand.txt,tTmp.txt,"~",7
              if(tTmp.txt!="")
              {
                covx tTmp.txt,tAuthor.pco,0,0
              }
              //volume
              spstr strCommand.txt,tTmp.txt,"~",8
              covx tTmp.txt,sys0,0,0
              hVolume.val=sys0
              //icon
              spstr strCommand.txt,tPlayPause.txt,"~",9
              // on off button
              spstr strCommand.txt,tTmp.txt,"~",10
              if(tTmp.txt=="disable")
              {
                vis t5,0
              }else
              {
                vis t5,1
                covx tTmp.txt,t5.pco,0,0
              }
              // shuffel btn
              spstr strCommand.txt,tTmp.txt,"~",11
              if(tTmp.txt=="disable")
              {
                vis tShuffle,0
              }else
              {
                vis tShuffle,1
                tShuffle.txt=tTmp.txt
              }
""")


start = 12
for i in range(1,7):
    idxstart = start + (i-1)*6
    item = f"""
              // get Type
              spstr strCommand.txt,type{i}.txt,"~",{idxstart}
              // get internal name
              spstr strCommand.txt,entn{i}.txt,"~",{idxstart+1}
              if(type{i}.txt=="delete"||type{i}.txt=="")
              {{
                vis tEntity{i},0
                vis bEntity{i},0
              }}else
              {{
                // change icon
                spstr strCommand.txt,bEntity{i}.txt,"~",{idxstart+2}
                vis bEntity{i},1
                // change icon color
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
                covx tTmp.txt,sys0,0,0
                bEntity{i}.pco=sys0
                // set name
                spstr strCommand.txt,tEntity{i}.txt,"~",{idxstart+4}
                vis tEntity{i},1
              }}
"""
    print(item)
foot = """
            }
""" + sharedfoot
print(foot)


