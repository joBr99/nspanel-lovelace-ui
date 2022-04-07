from shared import *
text = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
              //heading
              spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation

text += """
              //entity name
              spstr strCommand.txt,entn.txt,"~",3
              //currentTemp
              spstr strCommand.txt,tTmp.txt,"~",4
              covx tTmp.txt,xTempCurr.val,0,0
              //dstTemp
              spstr strCommand.txt,tTmp.txt,"~",5
              covx tTmp.txt,xTempDest.val,0,0
              //status
              spstr strCommand.txt,tStatus.txt,"~",6
              //minTemp
              spstr strCommand.txt,tTmp.txt,"~",7
              covx tTmp.txt,xTempMin.val,0,0
              //maxTemp
              spstr strCommand.txt,tTmp.txt,"~",8
              covx tTmp.txt,xTempMax.val,0,0
              //tempStep
              spstr strCommand.txt,tTmp.txt,"~",9
              covx tTmp.txt,xTempStep.val,0,0
              // disable all buttons
              vis bt0,0
              vis bt1,0
              vis bt2,0
              vis bt3,0
              vis bt4,0
              vis bt5,0
              vis bt6,0
              vis bt7,0
              vis bt8,0
"""

start = 10
for i in range(0,9):
    idxstart = start + i*4
    text += f"""
              //bt{i}
              spstr strCommand.txt,bt{i}.txt,"~",{idxstart}
              if(bt{i}.txt!="")
              {{
                // set text color on active state
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+1}
                covx tTmp.txt,bt{i}.pco2,0,0
                // set state
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+2}
                covx tTmp.txt,bt{i}.val,0,0
                // save action
                spstr strCommand.txt,va{i}.txt,"~",{idxstart+3}
                //enable
                vis bt{i},1
              }}"""

text += """
            }
""" + sharedfoot
print(text)

