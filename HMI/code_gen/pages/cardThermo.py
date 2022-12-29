from shared import *
text = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
              //heading
              spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation

text += """
              //entity name
              spstr strCommand.txt,entn.txt,"~",14
              //currentTemp
              spstr strCommand.txt,tCurTemp.txt,"~",15
              //dstTemp
              spstr strCommand.txt,tTmp.txt,"~",16
              covx tTmp.txt,xTempDest1.val,0,0
              xTempDest.val=xTempDest1.val
              //status
              spstr strCommand.txt,tStatus.txt,"~",17
              //minTemp
              spstr strCommand.txt,tTmp.txt,"~",18
              covx tTmp.txt,xTempMin1.val,0,0
              //maxTemp
              spstr strCommand.txt,tTmp.txt,"~",19
              covx tTmp.txt,xTempMax1.val,0,0
              //tempStep
              spstr strCommand.txt,tTmp.txt,"~",20
              covx tTmp.txt,xTempStep1.val,0,0
              //Text tCurTempLbl
              spstr strCommand.txt,tCurTempLbl.txt,"~",21
              //Text tStateLbl
              spstr strCommand.txt,tStateLbl.txt,"~",22
              //Text tCF
              spstr strCommand.txt,tCF.txt,"~",23
              tCF1.txt=tCF.txt
              tCF2.txt=tCF.txt
              //Second Temperature
              spstr strCommand.txt,tTmp.txt,"~",24
              if(tTmp.txt!="")
              {
                covx tTmp.txt,xTempDest2.val,0,0
                vis btUp,0
                vis xTempDest,0
                vis btDown,0
                vis tCF,0
                vis btUp1,1
                vis xTempDest1,1
                vis btDown1,1
                vis tCF1,1
                vis bUp2,1
                vis xTempDest2,1
                vis bDown2,1
                vis tCF2,1
              }
              //Show btDetail
              spstr strCommand.txt,tTmp.txt,"~",25
              if(tTmp.txt=="enable")
              {
                vis btDetail,1
              }else
              {
                vis btDetail,0
              }
"""
print(text)


start = 26
for i in range(1,9):
    idxstart = start + (i-1)*6
    item = f"""
              // get Type
              spstr strCommand.txt,tTmp.txt,"~",{idxstart}
              if(tTmp.txt=="delete"||tTmp.txt=="")
              {{
                vis bEntity{i},0
              }}else
              {{
                // get internal name
                spstr strCommand.txt,entn{i}.txt,"~",{idxstart+1}
                // change icon
                spstr strCommand.txt,bEntity{i}.txt,"~",{idxstart+2}
                vis bEntity{i},1
                // change icon color
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
                covx tTmp.txt,sys0,0,0
                bEntity{i}.pco=sys0
              }}
    """
    print(item)



print("""
            }
""" + sharedfoot
)

