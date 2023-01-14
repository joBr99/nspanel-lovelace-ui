from shared import *
head = sharedhead + """
            if(tInstruction.txt=="entityUpd")
            {
            // command format: entityUpd,heading,navigation,colorHome,iconHome[,iconColor,icon,speed,valueUp,valueDown]x6
            spstr strCommand.txt,tHeading.txt,"~",1
""" + navigation + """
			  // icon color home
        spstr strCommand.txt,tTmp.txt,"~",14
        covx tTmp.txt,t1.pco,0,0
			  // icon home
        spstr strCommand.txt,t1.txt,"~",15
        // speed 16 ignored
			  // text home
        spstr strCommand.txt,tHome.txt,"~",17
        spstr tHome.txt,tHome2.txt," ",1
        spstr tHome.txt,tHome.txt," ",0
        // icon color 18 ignored
        // icon 19 ignored
        // speed 20 ignored
			  // text home
        spstr strCommand.txt,tHomeO.txt,"~",21
        spstr tHomeO.txt,tHomeO2.txt," ",1
        spstr tHomeO.txt,tHomeO.txt," ",0
"""
print(head)
start = 22
for i in range(0,6):
    idxstart = start + (i)*4
    item = f"""
              // iconColor
              spstr strCommand.txt,tTmp.txt,"~",{idxstart}
              covx tTmp.txt,t{i}Icon.pco,0,0
              // icon
              spstr strCommand.txt,t{i}Icon.txt,"~",{idxstart+1}
              // speed
              spstr strCommand.txt,tTmp.txt,"~",{idxstart+2}
              covx tTmp.txt,t{i}Speed.val,0,0
              // lower text
              spstr strCommand.txt,t{i}u.txt,"~",{idxstart+3}

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

