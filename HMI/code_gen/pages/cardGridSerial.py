from shared import *
head = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
              // command format: entityUpd,heading,navigation,[,type,internalName,iconId,iconColor,displayName,optionalValue]x6
              spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation
print(head)
start = 14
for i in range(1,9):
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

                // way to get force font adjustment
                strlen bEntity{i}.txt,sys0
                //check 2nd last char for ¬
                substr bEntity{i}.txt,tTmp.txt,sys0-2,1
                if(tTmp.txt=="¬")
                {{
                  substr bEntity{i}.txt,tTmp.txt,sys0-1,1
                  covx tTmp.txt,sys1,0,0
                  bEntity{i}.font=sys1
                  substr bEntity{i}.txt,bEntity{i}.txt,0,sys0-2
                }}
                
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


