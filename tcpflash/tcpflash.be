class TftDownloader
    var tcp
	var s
	var b

	def get_file_size(host, port, file)
		import string
		self.tcp = tcpclient()
		self.tcp.connect("192.168.75.30", 8123)
		print("connected:", self.tcp.connected())
		self.s = "HEAD /local/test.tft HTTP/1.0\r\n"
		self.s += "\r\n"
		self.tcp.write(self.s)	
		
		#read one char after another until we reached end of http header
		var end_of_header = false
		var header = ""
		while !end_of_header
			if self.tcp.available() > 0
				header += self.tcp.read(1)
				if(string.find(header, '\r\n\r\n') != -1)
					end_of_header = true
				end
			end
		end
	
		var content_length = 0
	
		# convert header to list
		header = string.split(header, '\r\n')
		for i : header.iter()
			#print(i)
			if(string.find(i, 'Content-Length:') != -1)
				#print(i)
				content_length = number(string.split(i, 16)[1])
			end
		end
		
		return content_length
	end

	def download_chunk(b_start, b_end)
		import string
		self.tcp = tcpclient()
		self.tcp.connect("192.168.75.30", 8123)
		print("connected:", self.tcp.connected())
		self.s = "GET /local/test.tft HTTP/1.0\r\n"
		#self.s += "Range: bytes=0-4095\r\n"
		self.s += string.format("Range: bytes=%d-%d\r\n", b_start, b_end)
		self.s += "\r\n"
		self.tcp.write(self.s)	
		
		#read one char after another until we reached end of http header
		var end_of_header = false
		var header = ""
		while !end_of_header
			if self.tcp.available() > 0
				header += self.tcp.read(1)
				if(string.find(header, '\r\n\r\n') != -1)
					end_of_header = true
				end
			end
		end
	
		var content_length = 0
	
		# convert header to list
		header = string.split(header, '\r\n')
		for i : header.iter()
			#print(i)
			if(string.find(i, 'Content-Length:') != -1)
				#print(i)
				content_length = number(string.split(i, 16)[1])
			end
		end
		
		
		#print(content_length)
		# read bytes until content_length is reached
		var content = bytes()
		while content.size() != content_length
			if self.tcp.available() > 0
				content += self.tcp.readbytes()
			end
		end
		#print(content.size())
		return content
	end
end

class Nextion : Driver

    var ser
	var flash_size
	var flash_mode
	var flash_current_byte
	var tftd

    def init()
        log("NSP: Initializing Driver")
        self.ser = serial(17, 16, 115200, serial.SERIAL_8N1)
        self.sendnx('DRAKJHSUYDGBNCJHGJKSHBDN')
        self.flash_mode = 0
    end

    def screeninit()
        log("NSP: Screen Initialized") 
        self.sendnx("berry_ver.txt=\"berry: "+self.VERSION+"\"")
    end
	
	# send a nextion payload
	def encodenx(payload)
		var b = bytes().fromstring(payload)
		b += bytes('FFFFFF')
		return b
	end
	
	def sendnx(payload)
		var payload_bin = self.encodenx(payload)
		self.ser.write(payload_bin)
		 print("NSP: Sent =", payload_bin)
		log("NSP: Nextion command sent = " + str(payload_bin), 3)
	end
  
    
    def start_flash(url)
		
		self.tftd = TftDownloader()
		# get size of tft file
		self.flash_size = self.tftd.get_file_size()
		
        self.sendnx('DRAKJHSUYDGBNCJHGJKSHBDN')
        self.sendnx('recmod=0')
        self.sendnx('recmod=0')
        self.sendnx("connect")        
        self.flash_mode = 1
		self.flash_current_byte = 0
    end
	
	def write_chunk(b_start, b_end)
		var chunk = self.tftd.download_chunk(b_start, b_end)
		import string
		print(string.format("Sending Byte %d - %d with size of %d", b_start, b_end, chunk.size()))
		self.ser.write(chunk)
        return chunk.size()
    end
	
	def every_50ms()
        import string
        if self.ser.available() > 0
            var msg = self.ser.read()
            if size(msg) > 0
                log(string.format("NSP: Received Raw = %s",str(msg)), 3)
                if (self.flash_mode==1)
                    var str = msg[0..-4].asstring()
                    log(str, 3)
                    if (string.find(str,"comok 2")==0) 
                        self.sendnx(string.format("whmi-wri %d,115200,res0",self.flash_size))
                    elif (size(msg)==1 && msg[0]==0x05)
						print("rec 0x05")
                        var x = self.write_chunk(self.flash_current_byte, (self.flash_current_byte+4095) )
						self.flash_current_byte = self.flash_current_byte + x
						print(string.format("Flashing Progress ( %d / %d )", self.flash_current_byte, self.flash_size))
                    #    self.tot_read = self.tot_read + x
                    #    self.chunk = self.chunk + 1
                    #    var per = (self.tot_read*100)/self.flash_size
                    #    if (self.last_per!=per) 
                    #        self.last_per = per
                    #        tasmota.publish_result(string.format("{\"Flashing\":{\"complete\": %d}}",per), "RESULT") 
                    #    end
                        if (self.flash_current_byte==self.flash_size)
                            log("NSP: Flashing complete")
                            self.flash_mode = 0
                        end
                        tasmota.yield()
                    end
                else
                    if msg == bytes('000000FFFFFF88FFFFFF')
                        self.screeninit()
                    end       
                end
            end
        end
    end
end

var nextion = Nextion()
tasmota.add_driver(nextion)
