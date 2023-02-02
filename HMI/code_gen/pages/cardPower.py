from shared import *
head = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
            spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation + """
			  // icon color home
        spstr strCommand.txt,tTmp.txt,"~",17
        covx tTmp.txt,t1.pco,0,0
			  // icon home
        spstr strCommand.txt,t1.txt,"~",16
        // speed 16 ignored
			  // text home
        spstr strCommand.txt,tHome.txt,"~",19
        spstr tHome.txt,tHome2.txt," ",1
        spstr tHome.txt,tHome.txt," ",0
			  // text home
        spstr strCommand.txt,tHomeO.txt,"~",26
        spstr tHomeO.txt,tHomeO2.txt," ",1
        spstr tHomeO.txt,tHomeO.txt," ",0
"""

print(head)
start = 27
for i in range(0,6):
    idxstart = start + (i)*7
    item = f"""
              // iconColor
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+4}
              covx tTmp.txt,t{i}Icon.pco,0,0
              // icon
              spstr strCommand.txt,t{i}Icon.txt,"~",{idxstart+3}
              // speed
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+7}
              covx tTmp.txt,t{i}Speed.val,0,0
              if(t{i}Speed.val>120)
              {{
                t{i}Speed.val=120
              }}
              if(t{i}Speed.val<-120)
              {{
                t{i}Speed.val=-120
              }}
              // lower text
              spstr strCommand.txt,t{i}u.txt,"~",{idxstart+6}
              // upper text
              spstr strCommand.txt,t{i}o.txt,"~",{idxstart+5}
              if(t{i}Icon.txt!="")
              {{
                vis t{i}Icon,1
                vis t{i}u,1
                vis h{i},1
              }}else
              {{
                vis t{i}Icon,0
                vis t{i}u,0
                vis h{i},0
              }}
"""
    print(item)
foot = """
            }
""" + sharedfoot
print(foot)

