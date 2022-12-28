from shared import *
head = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
            // command format: entityUpd,heading,navigation,[,type,internalName,iconId,displayName,optionalValue]x4
            spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation
print(head)
start = 14
for i in range(1,5):
    idxstart = start + (i-1)*6
    item = f"""
              // get Type
              spstr strCommand.txt,type{i}.txt,"~",{idxstart}
              // get internal name
              spstr strCommand.txt,entn{i}.txt,"~",{idxstart+1}
              if(type{i}.txt=="delete"||type{i}.txt=="")
              {{
                vis bUp{i},0
                vis bStop{i},0
                vis bDown{i},0
                vis btOnOff{i},0
                vis tEntity{i},0
                vis tIcon{i},0
                vis bText{i},0
                vis hSlider{i},0
                vis nNum{i},0
              }}else
              {{
                // change icon
                spstr strCommand.txt,tIcon{i}.txt,"~",{idxstart+2}
                vis tIcon{i},1
                // change icon color
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+3}
                covx tTmp.txt,sys0,0,0
                tIcon{i}.pco=sys0
                // set name
                spstr strCommand.txt,tEntity{i}.txt,"~",{idxstart+4}
                vis tEntity{i},1
              }}

              if(type{i}.txt=="shutter")
              {{
                vis bUp{i},1
                vis bStop{i},1
                vis bDown{i},1
                vis btOnOff{i},0
                vis bText{i},0
                vis hSlider{i},0
                vis nNum{i},0
                // get Button State (optional Value)
                spstr strCommand.txt,tId.txt,"~",{idxstart+5}              

                // up button
                spstr tId.txt,tTmp.txt,"|",3
                if(tTmp.txt=="disable")
                {{
                  bUp{i}.pco=27501
                  spstr tId.txt,bUp{i}.txt,"|",0
                  tsw bUp{i},0
                }}
                else if(tTmp.txt=="enable")
                {{
                  bUp{i}.pco=65535
                  spstr tId.txt,bUp{i}.txt,"|",0
                  tsw bUp{i},1
                }}

                // stop button
                spstr tId.txt,tTmp.txt,"|",4
                if(tTmp.txt=="disable")
                {{
                  bStop{i}.pco=27501
                  spstr tId.txt,bStop{i}.txt,"|",1
                  tsw bStop{i},0
                }}
                else if(tTmp.txt=="enable")
                {{
                  bStop{i}.pco=65535
                  spstr tId.txt,bStop{i}.txt,"|",1
                  tsw bStop{i},1
                }}

                // down button
                spstr tId.txt,tTmp.txt,"|",5
                if(tTmp.txt=="disable")
                {{
                  bDown{i}.pco=27501
                  spstr tId.txt,bDown{i}.txt,"|",2
                  tsw bDown{i},0
                }}
                else if(tTmp.txt=="enable")
                {{
                  bDown{i}.pco=65535
                  spstr tId.txt,bDown{i}.txt,"|",2
                  tsw bDown{i},1
                }}
              }}
              if(type{i}.txt=="light"||type{i}.txt=="switch"||type{i}.txt=="fan")
              {{
                vis bUp{i},0
                vis bStop{i},0
                vis bDown{i},0
                vis btOnOff{i},1
                vis bText{i},0
                vis hSlider{i},0
                vis nNum{i},0
                // get Button State (optional Value)
                spstr strCommand.txt,tTmp.txt,"~",{idxstart+5}
                covx tTmp.txt,sys0,0,0
                btOnOff{i}.val=sys0
              }}
              if(type{i}.txt=="text"||type{i}.txt=="timer")
              {{
                vis bUp{i},0
                vis bStop{i},0
                vis bDown{i},0
                vis btOnOff{i},0
                vis bText{i},1
                tsw bText{i},0
                vis hSlider{i},0
                vis nNum{i},0
                bText{i}.pco=65535
                bText{i}.pco2=65535
                // get Text (optional Value)
                spstr strCommand.txt,bText{i}.txt,"~",{idxstart+5}
              }}
              if(type{i}.txt=="button"||type{i}.txt=="input_sel")
              {{
                vis bUp{i},0
                vis bStop{i},0
                vis bDown{i},0
                vis btOnOff{i},0
                vis bText{i},1
                tsw bText{i},1
                vis hSlider{i},0
                vis nNum{i},0
                bText{i}.pco=1374
                bText{i}.pco2=1374
                // get Text (optional Value)
                spstr strCommand.txt,bText{i}.txt,"~",{idxstart+5}
              }}
              if(type{i}.txt=="number")
              {{
                vis bUp{i},0
                vis bStop{i},0
                vis bDown{i},0
                vis btOnOff{i},0
                vis bText{i},0
                tsw bText{i},0
                vis hSlider{i},1
                vis nNum{i},1
                // get config (optional Value) (use bText as variable)
                spstr strCommand.txt,bText{i}.txt,"~",{idxstart+5}
                //first value is current value
                spstr bText{i}.txt,tTmp.txt,"|",0
                covx tTmp.txt,sys0,0,0
                hSlider{i}.val=sys0
                nNum{i}.val=sys0
                //second value is min value
                spstr bText{i}.txt,tTmp.txt,"|",1
                covx tTmp.txt,sys0,0,0
                hSlider{i}.minval=sys0
                //third value is max value
                spstr bText{i}.txt,tTmp.txt,"|",2
                covx tTmp.txt,sys0,0,0
                hSlider{i}.maxval=sys0
              }}



"""
    print(item)
foot = """
            }
""" + sharedfoot
print(foot)

