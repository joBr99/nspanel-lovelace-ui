from shared import *
head = sharedhead + """
            if(tInstruction.txt=="wake")
            {
              click tc0,1
            }
            if(tInstruction.txt=="dimmode")
            {
              // get value
              spstr strCommand.txt,tTmp.txt,"~",1
              covx tTmp.txt,dimValue,0,0
              dim=dimValue
              // get value normal
              spstr strCommand.txt,tTmp.txt,"~",2
              covx tTmp.txt,dimValueNormal,0,0
              // get background color
              spstr strCommand.txt,tTmp.txt,"~",3
              if(tTmp.txt!="")
              {
                covx tTmp.txt,defaultBcoColor,0,0
              }
              // get font color
              spstr strCommand.txt,tTmp.txt,"~",4
              if(tTmp.txt!="")
              {
                covx tTmp.txt,defaultFontColor,0,0
              }
            }
            if(tInstruction.txt=="time")
            {
              click m0,1
              //get set time to global variable
              spstr strCommand.txt,pageIcons.vaTime.txt,"~",1
              spstr pageIcons.vaTime.txt,tTime.txt,"?",0
              spstr pageIcons.vaTime.txt,tAMPM.txt,"?",1
              if(tAMPM.txt=="")
              {
                vis tAMPM,0
              }
              spstr strCommand.txt,tTimeAdd.txt,"~",2
              ref tIcon1
              ref tIcon2
            }
            if(tInstruction.txt=="date")
            {
              //get set date to global variable
              spstr strCommand.txt,pageIcons.vaDate.txt,"~",1
              tDate.txt=pageIcons.vaDate.txt
            }
            if(tInstruction.txt=="statusUpdate")
            {
              //statusIcon1
              spstr strCommand.txt,tIcon1.txt,"~",1
              spstr strCommand.txt,tTmp.txt,"~",2
              covx tTmp.txt,tIcon1.pco,0,0
              //statusIcon2
              spstr strCommand.txt,tIcon2.txt,"~",3
              spstr strCommand.txt,tTmp.txt,"~",4
              covx tTmp.txt,tIcon2.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",5
              if(tTmp.txt!="")
              {
                tIcon1.font=3
              }
              spstr strCommand.txt,tTmp.txt,"~",6
              if(tTmp.txt!="")
              {
                tIcon2.font=3
              }
            }
            if(tInstruction.txt=="weatherUpdate"&&tNotifyHead.txt==""&&tNotifyText.txt=="")
            {
              vis tMainIcon,1
              vis tMainIconAlt,0
              vis tMainText,1
              vis tMainTextAlt,0
              vis tMainTextAlt2,0
              vis tMainIconAlt2,0


              //tMainIcon
              spstr strCommand.txt,tMainIcon.txt,"~",3
              tMainIconAlt.txt=tMainIcon.txt
              //tMainIcon Color
              spstr strCommand.txt,tTmp.txt,"~",4
              covx tTmp.txt,tMainIcon.pco,0,0
              tMainIconAlt.pco=tMainIcon.pco
              //tMainText
              spstr strCommand.txt,tMainText.txt,"~",6
              tMainTextAlt.txt=tMainText.txt
"""

start = 7
for i in range(1,5):
    idxstart = start + (i-1)*6
    item = f"""
              //tForecast{i}
              spstr strCommand.txt,tForecast{i}.txt,"~",{idxstart+4}
              //tF{i}Icon
              spstr strCommand.txt,tF{i}Icon.txt,"~",{idxstart+2}
              //tF{i}Icon Color
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
              covx tTmp.txt,tF{i}Icon.pco,0,0
              //tForecast{i}Val
              spstr strCommand.txt,tForecast{i}Val.txt,"~",{idxstart+5}

    """
    head = head + item

head = head + """
              //alternative layout
              //tMainTextAlt2
              spstr strCommand.txt,tMainTextAlt2.txt,"~",36
              //tMainIconAlt2
              spstr strCommand.txt,tMainIconAlt2.txt,"~",33

              //tMainIconAlt2 Color
              spstr strCommand.txt,tTmp.txt,"~",34
              covx tTmp.txt,tMainIconAlt2.pco,0,0

              if(tMainTextAlt2.txt!=""&&p0.w!=320)
              {
                //value for tMRIcon, activate alternative layout
                vis tMainIcon,0
                vis tMainText,0
                vis tMainTextAlt,1
                vis tMainIconAlt,1
                vis tMainTextAlt2,1
                vis tMainIconAlt2,1
                vis tForecast1,0
                vis tF1Icon,0
                vis tForecast1Val,0
                //move forecast values to the right
                tForecast4.txt=tForecast3.txt
                tForecast3.txt=tForecast2.txt
                tForecast2.txt=tForecast1.txt
                tForecast4Val.txt=tForecast3Val.txt
                tForecast3Val.txt=tForecast2Val.txt
                tForecast2Val.txt=tForecast1Val.txt
                tF4Icon.txt=tF3Icon.txt
                tF3Icon.txt=tF2Icon.txt
                tF2Icon.txt=tF1Icon.txt
              }
            }
            if(tInstruction.txt=="color"&&tNotifyHead.txt==""&&tNotifyText.txt=="")
            {
              spstr strCommand.txt,tTmp.txt,"~",1
              covx tTmp.txt,tTime.bco,0,0
              if(tTime.bco!=screensaver.bco)
              {
                screensaver.bco=tTime.bco
                tAMPM.bco=tTime.bco
                tDate.bco=tTime.bco
                tMainIcon.bco=tTime.bco
                tMainText.bco=tTime.bco
                tMainIconAlt.bco=tTime.bco
                tMainTextAlt.bco=tTime.bco
                tMainTextAlt2.bco=tTime.bco
                tMainIconAlt2.bco=tTime.bco
                tIcon1.bco=tTime.bco
                tIcon2.bco=tTime.bco
                tForecast1.bco=tTime.bco
                tForecast1Val.bco=tTime.bco
                tF1Icon.bco=tTime.bco
                tForecast2.bco=tTime.bco
                tForecast2Val.bco=tTime.bco
                tF2Icon.bco=tTime.bco
                tForecast3.bco=tTime.bco
                tForecast3Val.bco=tTime.bco
                tF3Icon.bco=tTime.bco
                tForecast4.bco=tTime.bco
                tForecast4Val.bco=tTime.bco
                tF4Icon.bco=tTime.bco
                tTimeAdd.bco=tTime.bco
              }
              spstr strCommand.txt,tTmp.txt,"~",2
              covx tTmp.txt,tTime.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",3
              covx tTmp.txt,tAMPM.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",4
              covx tTmp.txt,tDate.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",5
              covx tTmp.txt,tMainText.pco,0,0
              tMainTextAlt.pco=tMainText.pco
              spstr strCommand.txt,tTmp.txt,"~",6
              covx tTmp.txt,tForecast1.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",7
              covx tTmp.txt,tForecast2.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",8
              covx tTmp.txt,tForecast3.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",9
              covx tTmp.txt,tForecast4.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",10
              covx tTmp.txt,tForecast1Val.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",11
              covx tTmp.txt,tForecast2Val.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",12
              covx tTmp.txt,tForecast3Val.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",13
              covx tTmp.txt,tForecast4Val.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",14
              covx tTmp.txt,t10.bco,0,0
              spstr strCommand.txt,tTmp.txt,"~",15
              covx tTmp.txt,tMainTextAlt2.pco,0,0
              //spstr strCommand.txt,tTmp.txt,"~",16
              //covx tTmp.txt,tMR.pco,0,0
              spstr strCommand.txt,tTmp.txt,"~",17
              covx tTmp.txt,tTimeAdd.pco,0,0
              if(tMainTextAlt2.txt!=""&&p0.w!=320)
              {
                tForecast4Val.pco=tForecast3Val.pco
                tForecast3Val.pco=tForecast2Val.pco
                tForecast2Val.pco=tForecast1Val.pco
                tForecast4.pco=tForecast3.pco
                tForecast3.pco=tForecast2.pco
                tForecast2.pco=tForecast1.pco
              }
            }
            if(tInstruction.txt=="notify")
            {
              spstr strCommand.txt,tNotifyHead.txt,"~",1
              spstr strCommand.txt,tNotifyText.txt,"~",2
              if(tNotifyHead.txt!=""||tNotifyText.txt!="")
              {
                vis tNotifyHead,1
                vis tNotifyText,1
              }else
              {
                vis tNotifyHead,0
                vis tNotifyText,0
              }
              tNotifyHead.bco=tTime.bco
              tNotifyText.bco=tTime.bco
              spstr strCommand.txt,tTmp.txt,"~",3
              if(tTmp.txt!="")
              {
                covx tTmp.txt,tNotifyHead.pco,0,0
              }
              spstr strCommand.txt,tTmp.txt,"~",4
              if(tTmp.txt!="")
              {
                covx tTmp.txt,tNotifyText.pco,0,0
              }
"""

print(head)


#start = 23
#for i in range(1,7):
#    idxstart = start + (i-1)*6
#    item = f"""
#              // get Type
#              spstr strCommand.txt,type{i}.txt,"~",{idxstart}
#              // get internal name
#              spstr strCommand.txt,entn{i}.txt,"~",{idxstart+1}
#              if(type{i}.txt=="delete"||type{i}.txt=="")
#              {{
#                vis tEntity{i},0
#                vis bEntity{i},0
#              }}else
#              {{
#                // change icon
#                spstr strCommand.txt,bEntity{i}.txt,"~",{idxstart+2}
#                vis bEntity{i},1
#                // change icon color
#                spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
#                covx tTmp.txt,sys0,0,0
#                bEntity{i}.pco=sys0
#                // set name
#                spstr strCommand.txt,tEntity{i}.txt,"~",{idxstart+4}
#                vis tEntity{i},1
#              }}
#"""
#    print(item)
foot = """
            }
""" + sharedfoot.replace("sleepValue=0", "dim=100").replace("""
            if(tInstruction.txt=="time")
            {
              // get set time to global variable
              spstr strCommand.txt,pageIcons.vaTime.txt,"~",1
            }
            if(tInstruction.txt=="date")
            {
              // get set date to global variable
              spstr strCommand.txt,pageIcons.vaDate.txt,"~",1
            }
            if(tInstruction.txt=="dimmode")
            {
              // get value
              spstr strCommand.txt,tTmp.txt,"~",1
              covx tTmp.txt,dimValue,0,0
              // get value normal
              spstr strCommand.txt,tTmp.txt,"~",2
              covx tTmp.txt,dimValueNormal,0,0
              dim=dimValueNormal
              // get background color
              spstr strCommand.txt,tTmp.txt,"~",3
              if(tTmp.txt!="")
              {
                covx tTmp.txt,defaultBcoColor,0,0
              }
              // get font color
              spstr strCommand.txt,tTmp.txt,"~",4
              if(tTmp.txt!="")
              {
                covx tTmp.txt,defaultFontColor,0,0
              }
            }""","")
print(foot)


