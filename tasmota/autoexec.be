# Sonoff NSPanel Tasmota Lovelace UI Berry Driver | code by joBr99
# based on;
# Sonoff NSPanel Tasmota (Nextion with Flashing) driver | code by peepshow-21
# based on;
# Sonoff NSPanel Tasmota driver v0.47 | code by blakadder and s-hadinger

# Example Flash
# FlashNextion http://ip-address-of-your-homeassistant:8123/local/nspanel.tft
# FlashNextion http://nspanel.pky.eu/lui.tft

class Nextion : Driver

    static header = bytes('55BB')

    static flash_block_size = 4096

    var flash_mode
	var flash_start_millis
    var flash_size
    var flash_written
    var flash_buff
    var flash_offset
	var flash_proto_version
	var flash_proto_baud
    var awaiting_offset
    var tcp
    var ser
    var last_per
	var url

    def split_55(b)
      var ret = []
      var s = size(b)   
      var i = s-2   # start from last-1
      while i > 0
        if b[i] == 0x55 && b[i+1] == 0xBB           
          ret.push(b[i..s-1]) # push last msg to list
          b = b[(0..i-1)]   # write the rest back to b
        end
        i -= 1
      end
      ret.push(b)
      return ret
    end

    def crc16(data, poly)
      if !poly  poly = 0xA001 end
      # CRC-16 MODBUS HASHING ALGORITHM
      var crc = 0xFFFF
      for i:0..size(data)-1
        crc = crc ^ data[i]
        for j:0..7
          if crc & 1
            crc = (crc >> 1) ^ poly
          else
            crc = crc >> 1
          end
        end
      end
      return crc
    end

	# encode using custom protocol 55 BB [payload length] [payload length] [payload] [crc] [crc]
    def encode(payload)
      var b = bytes()
      b += self.header
      b.add(size(payload), 2)   # add size as 2 bytes, little endian
      b += bytes().fromstring(payload)
      var msg_crc = self.crc16(b)
      b.add(msg_crc, 2)       # crc 2 bytes, little endian
      return b
    end

    def encodenx(payload)
        var b = bytes().fromstring(payload)
        b += bytes('FFFFFF')
        return b
    end

    def sendnx(payload)
        import string
        var payload_bin = self.encodenx(payload)
        self.ser.write(payload_bin)
        log(string.format("NXP: Nextion command sent = %s",str(payload_bin)), 3)       
    end

    def send(payload)
        var payload_bin = self.encode(payload)
        if self.flash_mode==1
            log("NXP: skipped command becuase still flashing", 3)
        else 
            self.ser.write(payload_bin)
            log("NXP: payload sent = " + str(payload_bin), 3)
        end
    end

    def write_to_nextion(b)
        self.ser.write(b)
    end

    def screeninit()
        log("NXP: Screen Initialized")
		self.sendnx("recmod=1")		
    end

    def write_block()
        
        import string
        log("FLH: Read block",3)
        while size(self.flash_buff)<self.flash_block_size && self.tcp.connected()
            if self.tcp.available()>0
                self.flash_buff += self.tcp.readbytes()
            else
                tasmota.delay(50)
                log("FLH: Wait for available...",3)
            end
        end
        log("FLH: Buff size "+str(size(self.flash_buff)),3)
        var to_write
        if size(self.flash_buff)>self.flash_block_size
            to_write = self.flash_buff[0..self.flash_block_size-1]
            self.flash_buff = self.flash_buff[self.flash_block_size..]
        else
            to_write = self.flash_buff
            self.flash_buff = bytes()
        end
        log("FLH: Writing "+str(size(to_write)),3)
        var per = (self.flash_written*100)/self.flash_size
        if (self.last_per!=per) 
            self.last_per = per
            tasmota.publish_result(string.format("{\"Flashing\":{\"complete\": %d, \"time_elapsed\": %d}}",per , (tasmota.millis()-self.flash_start_millis)/1000), "RESULT") 
        end
        if size(to_write)>0
            self.flash_written += size(to_write)
            self.ser.write(to_write)
        end
        log("FLH: Total "+str(self.flash_written),3)
        if (self.flash_written==self.flash_size)
            log("FLH: Flashing complete - Time elapsed: %d", (tasmota.millis()-self.flash_start_millis)/1000)
            self.flash_mode = 0
			self.ser.deinit()
			self.ser = serial(17, 16, 115200, serial.SERIAL_8N1)
        end

    end

    def every_100ms()
        import string
        if self.ser.available() > 0
            var msg = self.ser.read()
            if size(msg) > 0
                log(string.format("NXP: Received Raw = %s",str(msg)), 3)
                if (self.flash_mode==1)
                    var strv = msg[0..-4].asstring()
                    if string.find(strv,"comok 2")>=0
                        log("FLH: Send (High Speed) flash start")
						self.flash_start_millis = tasmota.millis()
                        #self.sendnx(string.format("whmi-wris %d,115200,res0",self.flash_size))
						if self.flash_proto_version == 0
							self.sendnx(string.format("whmi-wri %d,%d,res0",self.flash_size,self.flash_proto_baud))
						else
							self.sendnx(string.format("whmi-wris %d,%d,res0",self.flash_size,self.flash_proto_baud))
						end
						if self.flash_proto_baud != 115200
						    self.ser.deinit()
							self.ser = serial(17, 16, self.flash_proto_baud, serial.SERIAL_8N1)
						end
                    elif size(msg)==1 && msg[0]==0x08
                        log("FLH: Waiting offset...",3)
                        self.awaiting_offset = 1
                    elif size(msg)==4 && self.awaiting_offset==1
                        self.awaiting_offset = 0
                        self.flash_offset = msg.get(0,4)
                        log("FLH: Flash offset marker "+str(self.flash_offset),3)
						if self.flash_offset != 0
							self.open_url_at(self.url, self.flash_offset)
							self.flash_written = self.flash_offset
						end
                        self.write_block()
                    elif size(msg)==1 && msg[0]==0x05
                        self.write_block()
                    else
                        log("FLH: Something has gone wrong flashing display firmware ["+str(msg)+"]",2)
                    end
                else
                    var msg_list = self.split_55(msg)
                    for i:0..size(msg_list)-1
                        msg = msg_list[i]
                        if size(msg) > 0
                            if msg == bytes('000000FFFFFF88FFFFFF')
                                self.screeninit()
                            elif size(msg)>=2 && msg[0]==0x55 && msg[1]==0xBB
                                var jm = string.format("{\"CustomRecv\":\"%s\"}",msg[4..-3].asstring())
                                tasmota.publish_result(jm, "RESULT")        
                            elif msg[0]==0x07 && size(msg)==1 # BELL/Buzzer
                                tasmota.cmd("buzzer 1,1")
                            else
                                var jm = string.format("{\"nextion\":\"%s\"}",str(msg[0..-4]))
                                tasmota.publish_result(jm, "RESULT")        
                            end
                        end       
                    end
                end
            end
        end
    end      

    def begin_nextion_flash()
        self.flash_written = 0
        self.awaiting_offset = 0
        self.flash_offset = 0
        self.sendnx('DRAKJHSUYDGBNCJHGJKSHBDN')
        self.sendnx('recmod=0')
        self.sendnx('recmod=0')
        self.flash_mode = 1
        self.sendnx("connect")        
    end
    
    def open_url_at(url, pos)
		self.url = url
        import string
        var host
        var port
        var s1 = string.split(url,7)[1]
        var i = string.find(s1,":")
        var sa
        if i<0
            port = 80
            i = string.find(s1,"/")
            sa = string.split(s1,i)
            host = sa[0]
        else
            sa = string.split(s1,i)
            host = sa[0]
            s1 = string.split(sa[1],1)[1]
            i = string.find(s1,"/")
            sa = string.split(s1,i)
            port = int(sa[0])
        end
        var get = sa[1]
        log(string.format("FLH: host: %s, port: %s, get: %s",host,port,get))
        self.tcp = tcpclient()
        self.tcp.connect(host,port)
        log("FLH: Connected:"+str(self.tcp.connected()),3)
        var get_req = "GET "+get+" HTTP/1.0\r\n"
		get_req += string.format("Range: bytes=%d-\r\n", pos)
		get_req += string.format("HOST: %s:%s\r\n\r\n",host,port)
        self.tcp.write(get_req)
        var a = self.tcp.available()
        i = 1
        while a==0 && i<5
          tasmota.delay(100*i)
          tasmota.yield() 
          i += 1
          log("FLH: Retry "+str(i),3)
          a = self.tcp.available()
        end
        if a==0
            log("FLH: Nothing available to read!",3)
            return
        end
        var b = self.tcp.readbytes()
        i = 0
        var end_headers = false;
        var headers
        while i<size(b) && headers==nil
            if b[i..(i+3)]==bytes().fromstring("\r\n\r\n") 
                headers = b[0..(i+3)].asstring()
                self.flash_buff = b[(i+4)..]
            else
                i += 1
            end
        end
        #print(headers)
		# check http respose for code 200/206
        if string.find(headers,"200 OK")>0 || string.find(headers,"206 Partial Content")>0
            log("FLH: HTTP Respose is 200 OK or 206 Partial Content",3)
		else
            log("FLH: HTTP Respose is not 200 OK or 206 Partial Content",3)
			print(headers)
			return -1
        end
		# only set flash size if pos is zero
		if pos == 0
			# check http respose for content-length
			var tag = "Content-Length: "
			i = string.find(headers,tag)
			if (i>0) 
				var i2 = string.find(headers,"\r\n",i)
				var s = headers[i+size(tag)..i2-1]
				self.flash_size=int(s)
			end
			log("FLH: Flash file size: "+str(self.flash_size),3)
		end

    end

    def flash_nextion(url)
        self.flash_size = 0
        var res = self.open_url_at(url, 0)
		if res != -1
			self.begin_nextion_flash()
		end
    end

    def init()
        log("NXP: Initializing Driver")
        self.ser = serial(17, 16, 115200, serial.SERIAL_8N1)
        self.flash_mode = 0
		self.flash_proto_version = 1
		self.flash_proto_baud = 921600
    end

end

var nextion = Nextion()

tasmota.add_driver(nextion)

def get_current_version(cmd, idx, payload, payload_json)
	import string
	var version_of_this_script = 6
	var jm = string.format("{\"nlui_driver_version\":\"%s\"}", version_of_this_script)
	tasmota.publish_result(jm, "RESULT")
end

tasmota.add_cmd('GetDriverVersion', get_current_version)

def update_berry_driver(cmd, idx, payload, payload_json)
	def task()
		import string
		var cl = webclient()
		cl.begin(payload)
		var r = cl.GET()
		if r == 200
			print("Sucessfully downloaded nspanel-lovelace-ui berry driver")
		else
			print("Error while downloading nspanel-lovelace-ui berry driver")
		end
		r = cl.write_file("autoexec.be")
		if r < 0
			print("Error while writeing nspanel-lovelace-ui berry driver")
		else
			print("Sucessfully written nspanel-lovelace-ui berry driver")
			var s = load('autoexec.be')
			if s == true
				var jm = string.format("{\"nlui_driver_update\":\"%s\"}", "succeeded")
				tasmota.publish_result(jm, "RESULT")
			else 
				var jm = string.format("{\"nlui_driver_update\":\"%s\"}", "failed")
				tasmota.publish_result(jm, "RESULT")
			end
			
		end
	end
	tasmota.set_timer(0,task)
	tasmota.resp_cmnd_done()
end

tasmota.add_cmd('UpdateDriverVersion', update_berry_driver)

def flash_nextion(cmd, idx, payload, payload_json)
    def task()
	    nextion.flash_proto_version = 1
		nextion.flash_proto_baud = 921600
        nextion.flash_nextion(payload)
    end
    tasmota.set_timer(0,task)
    tasmota.resp_cmnd_done()
end

def flash_nextion_adv(cmd, idx, payload, payload_json)
    def task()		
		if idx==0
			nextion.flash_proto_version = 1
		    nextion.flash_proto_baud = 921600
        elif idx==1
			nextion.flash_proto_version = 0
		    nextion.flash_proto_baud = 921600
        elif idx==2
			nextion.flash_proto_version = 1
		    nextion.flash_proto_baud = 115200
        elif idx==3
			nextion.flash_proto_version = 0
		    nextion.flash_proto_baud = 115200
        elif idx==4
			nextion.flash_proto_version = 1
		    nextion.flash_proto_baud = 256000
        elif idx==5
			nextion.flash_proto_version = 0
		    nextion.flash_proto_baud = 256000
        else
			nextion.flash_proto_version = 0
		    nextion.flash_proto_baud = 115200
        end
		
        nextion.flash_nextion(payload)
    end
    tasmota.set_timer(0,task)
    tasmota.resp_cmnd_done()
end

def send_cmd(cmd, idx, payload, payload_json)
    nextion.sendnx(payload)
    tasmota.resp_cmnd_done()
end

def send_cmd2(cmd, idx, payload, payload_json)
    nextion.send(payload)
    tasmota.resp_cmnd_done()
end

tasmota.add_cmd('Nextion', send_cmd)
tasmota.add_cmd('CustomSend', send_cmd2)
tasmota.add_cmd('FlashNextion', flash_nextion)
tasmota.add_cmd('FlashNextionAdv', flash_nextion_adv)
