// data available
if(usize>1)
{
  bufferPos=0
  while(bufferPos<usize)
  {
    // check for 0x55 0xBB - Command Init Secuence
    if(u[bufferPos]==187&&u[bufferPos-1]==85)
    {
      //remove garbage at the start of the buffer if there's any to free buffer for command
      if(u[bufferPos]!=1)
      {
        udelete bufferPos-1
      }
      //instruction is now aligned with buffer, because we deleted garbage before instrcution
      //get length after init sequence (check if there are more than to bytes in buffer)
      if(2<usize)
      {
        // check if serial buffer has reached the announced length
        payloadLength=u[2]
        // we are only checking payload length so we have to skip first 3 bytes (init+payload length) (-1 because of < instead of <=)
        payloadLength+=2
        // payload length does also not contain crc, so we are adding another 2 bytes for crc
        payloadLength+=2
        if(payloadLength<usize)
        {
          // calculate crc
          crcrest 1,0xFFFF
          // u[2] contains payload legth at 3rd pos in buffer, we are calculating crc from 3rd pos with number of bytes from payload length
          //crcputu 3,u[2]
          // u[2] cotnains payload length, we are calculating a crc over the whole message, so we have to add 3 to the length from u[2]
          crcputu 0,u[2]+3
          // get recived crc to be able to compare it
          ucopy recvCrc,u[2]+3,2,0
          // compare crc with recived value
          if(crcval==recvCrc)
          {
            // crc is okay
            // here is the location where acual code should be
            // write command to variable strCommand
            ucopy strCommand.txt,3,u[2],0
            // write instruction to tInstuction (debug output, but used as variable here, ui elements will be disabled by default)
            spstr strCommand.txt,tInstruction.txt,",",0
            if(tInstruction.txt=="entityUpdHeading")
            {
              spstr strCommand.txt,tHeading.txt,",",1
            }
            if(tInstruction.txt=="entityUpd")
            {
              // command format: entityUpd,id,icon,name,type,optionalValue
              // write id to tId (debug output, but used as variable here, ui elements will be disabled by default)
              spstr strCommand.txt,tId.txt,",",1
              // id 1
              if(tId.txt=="1")
              {
                // get Type
                spstr strCommand.txt,type1.txt,",",2
                // get internal name
                spstr strCommand.txt,entn1.txt,",",3
                if(type1.txt=="delete")
                {
                  vis bUp1,0
                  vis bStop1,0
                  vis bDown1,0
                  vis btOnOff1,0
                  vis tEntity1,0
                  vis tIcon1,0
                  vis bText1,0
                }else
                {
                  // change icon
                  spstr strCommand.txt,tTmp.txt,",",4
                  covx tTmp.txt,sys0,0,0
                  substr pageIcons.tIcons.txt,tIcon1.txt,sys0,1
                  vis tIcon1,1
                  // set name
                  spstr strCommand.txt,tEntity1.txt,",",5
                  vis tEntity1,1
                }
                if(type1.txt=="shutter")
                {
                  vis bUp1,1
                  vis bStop1,1
                  vis bDown1,1
                  vis btOnOff1,0
                  vis bText1,0
                }
                if(type1.txt=="light")
                {
                  vis bUp1,0
                  vis bStop1,0
                  vis bDown1,0
                  vis btOnOff1,1
                  vis bText1,0
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff1.val=sys0
                }
                if(type1.txt=="switch")
                {
                  vis bUp1,0
                  vis bStop1,0
                  vis bDown1,0
                  vis btOnOff1,1
                  vis bText1,0
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff1.val=sys0
                }
                if(type1.txt=="text")
                {
                  vis bUp1,0
                  vis bStop1,0
                  vis bDown1,0
                  vis btOnOff1,0
                  vis bText1,1
                  tsw bText1,0
                  bText1.pco=65535
                  bText1.pco2=65535
                  // get Text (optional Value)
                  spstr strCommand.txt,bText1.txt,",",6
                }
                if(type1.txt=="button")
                {
                  vis bUp1,0
                  vis bStop1,0
                  vis bDown1,0
                  vis btOnOff1,0
                  vis bText1,1
                  tsw bText1,1
                  bText1.pco=1374
                  bText1.pco2=1374
                  // get Text (optional Value)
                  spstr strCommand.txt,bText1.txt,",",6
                }
              }
              // id 2
              if(tId.txt=="2")
              {
                // get Type
                spstr strCommand.txt,type2.txt,",",2
                // get internal name
                spstr strCommand.txt,entn2.txt,",",3
                if(type2.txt=="delete")
                {
                  vis bUp2,0
                  vis bStop2,0
                  vis bDown2,0
                  vis btOnOff2,0
                  vis tEntity2,0
                  vis tIcon2,0
                  vis bText2,0
                }else
                {
                  //change icon
                  spstr strCommand.txt,tTmp.txt,",",4
                  covx tTmp.txt,sys0,0,0
                  substr pageIcons.tIcons.txt,tIcon2.txt,sys0,1
                  vis tIcon2,1
                  // set name
                  spstr strCommand.txt,tEntity2.txt,",",5
                  vis tEntity2,1
                }
                if(type2.txt=="shutter")
                {
                  vis bUp2,1
                  vis bStop2,1
                  vis bDown2,1
                  vis btOnOff2,0
                  vis bText2,0
                }
                if(type2.txt=="light")
                {
                  vis bUp2,0
                  vis bStop2,0
                  vis bDown2,0
                  vis btOnOff2,1
                  vis bText2,0
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff2.val=sys0
                }
                if(type2.txt=="switch")
                {
                  vis bUp2,0
                  vis bStop2,0
                  vis bDown2,0
                  vis btOnOff2,1
                  vis bText2,0
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff2.val=sys0
                }
                if(type2.txt=="text")
                {
                  vis bUp2,0
                  vis bStop2,0
                  vis bDown2,0
                  vis btOnOff2,0
                  vis bText2,1
                  tsw bText2,0
                  bText2.pco=65535
                  bText2.pco2=65535
                  // get Text (optional Value)
                  spstr strCommand.txt,bText2.txt,",",6
                }
                if(type2.txt=="button")
                {
                  vis bUp2,0
                  vis bStop2,0
                  vis bDown2,0
                  vis btOnOff2,0
                  vis bText2,1
                  tsw bText2,1
                  bText2.pco=1374
                  bText2.pco2=1374
                  // get Text (optional Value)
                  spstr strCommand.txt,bText2.txt,",",6
                }
              }
              // id 3
              if(tId.txt=="3")
              {
                // get Type
                spstr strCommand.txt,type3.txt,",",2
                // get internal name
                spstr strCommand.txt,entn3.txt,",",3
                if(type3.txt=="delete")
                {
                  vis bUp3,0
                  vis bStop3,0
                  vis bDown3,0
                  vis btOnOff3,0
                  vis tEntity3,0
                  vis tIcon3,0
                  vis bText3,0
                }else
                {
                  //change icon
                  spstr strCommand.txt,tTmp.txt,",",4
                  covx tTmp.txt,sys0,0,0
                  substr pageIcons.tIcons.txt,tIcon3.txt,sys0,1
                  vis tIcon3,1
                  // set name
                  spstr strCommand.txt,tEntity3.txt,",",5
                  vis tEntity3,1
                }
                if(type3.txt=="shutter")
                {
                  vis bUp3,1
                  vis bStop3,1
                  vis bDown3,1
                  vis btOnOff3,0
                  vis bText3,0
                }
                if(type3.txt=="light")
                {
                  vis bUp3,0
                  vis bStop3,0
                  vis bDown3,0
                  vis bText3,0
                  vis btOnOff3,1
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff3.val=sys0
                }
                if(type3.txt=="switch")
                {
                  vis bUp3,0
                  vis bStop3,0
                  vis bDown3,0
                  vis bText3,0
                  vis btOnOff3,1
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff3.val=sys0
                }
                if(type3.txt=="text")
                {
                  vis bUp3,0
                  vis bStop3,0
                  vis bDown3,0
                  vis btOnOff3,0
                  vis bText3,1
                  tsw bText3,0
                  bText3.pco=65535
                  bText3.pco2=65535
                  // get Text (optional Value)
                  spstr strCommand.txt,bText3.txt,",",6
                }
                if(type3.txt=="button")
                {
                  vis bUp3,0
                  vis bStop3,0
                  vis bDown3,0
                  vis btOnOff3,0
                  vis bText3,1
                  tsw bText3,1
                  bText3.pco=1374
                  bText3.pco2=1374
                  // get Text (optional Value)
                  spstr strCommand.txt,bText3.txt,",",6
                }
              }
              // id 2
              if(tId.txt=="4")
              {
                // get Type
                spstr strCommand.txt,type4.txt,",",2
                // get internal name
                spstr strCommand.txt,entn4.txt,",",3
                if(type4.txt=="delete")
                {
                  vis bUp4,0
                  vis bStop4,0
                  vis bDown4,0
                  vis btOnOff4,0
                  vis tEntity4,0
                  vis tIcon4,0
                  vis bText4,0
                }else
                {
                  //change icon
                  spstr strCommand.txt,tTmp.txt,",",4
                  covx tTmp.txt,sys0,0,0
                  substr pageIcons.tIcons.txt,tIcon4.txt,sys0,1
                  vis tIcon4,1
                  // set name
                  spstr strCommand.txt,tEntity4.txt,",",5
                  vis tEntity4,1
                }
                if(type4.txt=="shutter")
                {
                  vis bUp4,1
                  vis bStop4,1
                  vis bDown4,1
                  vis btOnOff4,0
                  vis bText4,0
                }
                if(type4.txt=="light")
                {
                  vis bUp4,0
                  vis bStop4,0
                  vis bDown4,0
                  vis bText4,0
                  vis btOnOff4,1
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff4.val=sys0
                }
                if(type4.txt=="switch")
                {
                  vis bUp4,0
                  vis bStop4,0
                  vis bDown4,0
                  vis bText4,0
                  vis btOnOff4,1
                  // get Button State (optional Value)
                  spstr strCommand.txt,tTmp.txt,",",6
                  covx tTmp.txt,sys0,0,0
                  btOnOff4.val=sys0
                }
                if(type4.txt=="text")
                {
                  vis bUp4,0
                  vis bStop4,0
                  vis bDown4,0
                  vis btOnOff4,0
                  vis bText4,1
                  tsw bText4,0
                  bText4.pco=65535
                  bText4.pco2=65535
                  // get Text (optional Value)
                  spstr strCommand.txt,bText4.txt,",",6
                }
                if(type4.txt=="button")
                {
                  vis bUp4,0
                  vis bStop4,0
                  vis bDown4,0
                  vis btOnOff4,0
                  vis bText4,1
                  tsw bText4,1
                  bText4.pco=1374
                  bText4.pco2=1374
                  // get Text (optional Value)
                  spstr strCommand.txt,bText4.txt,",",6
                }
              }
            }
            if(tInstruction.txt=="pageType")
            {
              //command format pageType,specialPageName
              //write name of speical page to tId
              spstr strCommand.txt,tId.txt,",",1
              //save second arg if there's one
              spstr strCommand.txt,tTmp.txt,",",2
              if(tId.txt=="cardEntities")
              {
                //yay, we are already on the correct page
              }else
              {
                //we are going to exit this page with this command, so we have to clear the buffer, so we are not getting into a stupid loop ...
                udelete u[2]+3
                bufferPos=0
              }
              if(tId.txt=="popupLight")
              {
                pageIcons.tTmp1.txt=tTmp.txt
                page popupLight
              }
              if(tId.txt=="cardThermo")
              {
                page cardThermo
              }
              if(tId.txt=="cardMedia")
              {
                page cardMedia
              }
              if(tId.txt=="pageStartup")
              {
                page pageStartup
              }
            }
            if(tInstruction.txt=="time")
            {
              // get set time to global variable
              spstr strCommand.txt,screensaver.vaTime.txt,",",1
            }
            if(tInstruction.txt=="date")
            {
              // get set date to global variable
              spstr strCommand.txt,screensaver.vaDate.txt,"?",1
            }
            if(tInstruction.txt=="dimmode")
            {
              // get value
              spstr strCommand.txt,tTmp.txt,",",1
              covx tTmp.txt,dimValue,0,0
            }
            if(tInstruction.txt=="timeout")
            {
              // set timeout to global var
              spstr strCommand.txt,tTmp.txt,",",1
              covx tTmp.txt,sleepTimeout,0,0
            }
            // end of user code
            udelete u[2]+3
            bufferPos=0
          }
        }
      }
    }
    // next character
    bufferPos++
  }
  if(bufferPos==usize)
  {
    // copy whole buffer to t1.txt, for debugging
    //ucopy t2.txt,0,usize,0
    // ucopy n2.val,0,usize,0
    // clear whole buffer
    //code_c
    //bufferPos=0
  }
}
