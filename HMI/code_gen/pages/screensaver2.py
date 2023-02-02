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

              //tMainIcon
              spstr strCommand.txt,tMainIcon.txt,"~",3
              //tMainIcon Color
              spstr strCommand.txt,tTmp.txt,"~",4
              covx tTmp.txt,tMainIcon.pco,0,0
              //tMainText
              spstr strCommand.txt,tMainText.txt,"~",6
"""

start = 7
for i in range(1,4):
    idxstart = start + (i-1)*6
    item = f"""
              //d{i}Icon
              spstr strCommand.txt,d{i}Icon.txt,"~",{idxstart+2}
              //d{i}Icon Color
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
              covx tTmp.txt,d{i}Icon.pco,0,0
              //d{i}Val
              spstr strCommand.txt,d{i}Val.txt,"~",{idxstart+5}

    """
    head = head + item

start = idxstart+6
for i in range(1,7):
    idxstart = start + (i-1)*6
    item = f"""
              //e{i}Name
              spstr strCommand.txt,e{i}Name.txt,"~",{idxstart+4}
              //e{i}Icon
              spstr strCommand.txt,e{i}Icon.txt,"~",{idxstart+2}
              //e{i}Icon Color
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
              covx tTmp.txt,e{i}Icon.pco,0,0
              //e{i}Val
              spstr strCommand.txt,e{i}Val.txt,"~",{idxstart+5}

    """
    head = head + item

start = idxstart+6
for i in range(1,6):
    idxstart = start + (i-1)*6
    item = f"""
              //f{i}Icon
              spstr strCommand.txt,f{i}Icon.txt,"~",{idxstart+2}
              //f{i}Icon Color
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
              covx tTmp.txt,f{i}Icon.pco,0,0
    """
    head = head + item

head = head + """
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


