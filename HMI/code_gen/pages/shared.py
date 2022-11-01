sharedhead = """
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
      if(3<usize)
      {
        // check if serial buffer has reached the announced length
        ucopy payloadLength,2,2,0
        // we are only checking payload length so we have to skip first 3 bytes (init+payload length) (-1 because of < instead of <=)
        payloadLength+=3
        // payload length does also not contain crc, so we are adding another 2 bytes for crc
        payloadLength+=2
        if(payloadLength<usize)
        {
          // calculate crc
          crcrest 1,0xFFFF
          // u[2] contains payload legth at 3rd pos in buffer, we are calculating crc from 3rd pos with number of bytes from payload length
          //crcputu 3,u[2]
          // u[2] cotnains payload length, we are calculating a crc over the whole message, so we have to add 3 to the length from u[2]
          crcputu 0,payloadLength-1
          // get recived crc to be able to compare it
          ucopy recvCrc,payloadLength-1,2,0
          // compare crc with recived value
          if(crcval==recvCrc)
          {
            // crc is okay
            // here is the location where acual code should be
            // write command to variable strCommand
            ucopy strCommand.txt,4,payloadLength-5,0
            // write instruction to tInstuction (debug output, but used as variable here, ui elements will be disabled by default)
            spstr strCommand.txt,tInstruction.txt,"~",0
"""

sharedfoot = """
            if(tInstruction.txt=="pageType")
            {
              sleepValue=0
              //command format pageType,specialPageName
              //write name of speical page to tId
              spstr strCommand.txt,tId.txt,"~",1
              //save second arg if there's one
              spstr strCommand.txt,tTmp.txt,"~",2
              //save third arg if there's one
              spstr strCommand.txt,pageIcons.tTmp2.txt,"~",3
              spstr strCommand.txt,pageIcons.tTmp3.txt,"~",4
              //we are going to exit this page with this command, so we have to clear the buffer, so we are not getting into a stupid loop ...
              udelete payloadLength-1
              bufferPos=0
              if(tId.txt=="pageStartup")
              {
                page pageStartup
              }
              if(tId.txt=="screensaver")
              {
                page screensaver
              }
              if(tId.txt=="cardEntities")
              {
                page cardEntities
              }
              if(tId.txt=="cardGrid")
              {
                page cardGrid
              }
              if(tId.txt=="popupLight")
              {
                pageIcons.tTmp1.txt=tTmp.txt
                page popupLight
              }
              if(tId.txt=="popupShutter")
              {
                pageIcons.tTmp1.txt=tTmp.txt
                page popupShutter
              }
              if(tId.txt=="popupNotify")
              {
                page popupNotify
              }
              if(tId.txt=="cardThermo")
              {
                page cardThermo
              }
              if(tId.txt=="cardMedia")
              {
                page cardMedia
              }
              if(tId.txt=="cardAlarm")
              {
                page cardAlarm
              }
              if(tId.txt=="cardQR")
              {
                page cardQR
              }
              if(tId.txt=="cardPower")
              {
                page cardPower
              }
            }
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
            }
            if(tInstruction.txt=="timeout")
            {
              //set timeout to global var
              spstr strCommand.txt,tTmp.txt,"~",1
              covx tTmp.txt,sleepTimeout,0,0
            }
            // end of user code
            udelete payloadLength-1
            bufferPos=0
          }
        }
      }
    }
    // next character
    bufferPos++
  }
}
"""

navigation = """
              // navigation icons
              spstr strCommand.txt,tId.txt,"~",2
              spstr tId.txt,tTmp.txt,"|",0
              if(tTmp.txt=="0")
              {
                vis bPrev,0
                tsw mSwipePrev,0
                tsw mSwipeUp,0
              }
              if(tTmp.txt=="1")
              {
                vis bPrev,1
                tsw mSwipePrev,1
                tsw mSwipeUp,0
                bPrev.txt=""
              }
              if(tTmp.txt=="2")
              {
                vis bPrev,1
                tsw mSwipePrev,0
                tsw mSwipeUp,1
                bPrev.txt=""
              }       
              spstr tId.txt,tTmp.txt,"|",1
              if(tTmp.txt=="0")
              {
                vis bNext,0
                tsw mSwipeNext,0
              }
              if(tTmp.txt=="1")
              {
                vis bNext,1
                tsw mSwipeNext,1
                bNext.txt=""
              }
              if(tTmp.txt=="2")
              {
                vis bNext,1
                bNext.txt=""
              }
"""