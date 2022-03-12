# Nextion Serial Protocol driver by joBr99 + nextion upload protocol 1.2 (the fast one yay) implementation using http range and tcpclient
# based on;
# Sonoff NSPanel Tasmota driver v0.47 | code by blakadder and s-hadinger

class TftDownloader
    var tcp
	
	var host
	var port
	var file
	
	var s
	var b
	var tft_file_size
	var current_chunk
	var current_chunk_start
	var download_range

	
    def init(host, port, file, download_range)
        self.tft_file_size = 0

		self.host = host
		self.port = port
		self.file = file
		self.download_range = download_range #32768
    end

	def download_chunk(b_start, b_length)
		import string
		self.tcp = tcpclient()
		self.tcp.connect(self.host, self.port)
		print("connected:", self.tcp.connected())
		self.s = "GET " + self.file + " HTTP/1.0\r\n"
		self.s += "HOST: " + self.host + "\r\n"
		self.s += string.format("Range: bytes=%d-%d\r\n", b_start, (b_start+b_length-1))
		print(string.format("Downloading Byte %d - %d", b_start, (b_start+b_length-1)))
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
	
		# check for 206 status code
		if(string.find(header, '206 Partial Content') != -1)
			# download was sucessful
		else
			print("Error while downloading")
			print(header)
			return nil
		end
	
		# convert header to list
		header = string.split(header, '\r\n')
		for i : header.iter()
			#print(i)
			if(string.find(i, 'Content-Range:') != -1)
				if self.tft_file_size == 0
					print(i)
					self.tft_file_size = number(string.split(i, '/')[1])
				end
			end
			if(string.find(i, 'Content-Length:') != -1)
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
	
	def get_file_size()
		self.download_chunk(0, 1)
		return self.tft_file_size
	end
	
	# returns the next 4096 bytes after pos of the tft file
	def next_chunk(pos)
		if(self.current_chunk == nil)
			print("current chunk empty")
			self.current_chunk = self.download_chunk(pos, self.download_range)
			self.current_chunk_start = pos
		end
		if(pos < self.current_chunk_start)
			print("Requested pos is below start point of chunk in memory, not implemented")
		end
		if(pos >= (self.current_chunk_start+self.download_range))
			print("Requested pos is after the end of chunk in memory, downloading new range")
			self.current_chunk = self.download_chunk(pos, self.download_range)
			self.current_chunk_start = pos
		end
		var start_within_current_chunk = pos - self.current_chunk_start
		return self.current_chunk[start_within_current_chunk..(start_within_current_chunk+4095)]
	end
end

class Nextion : Driver

    var ser
	var flash_size
	var flash_mode
	var flash_version
	var flash_skip
	var flash_current_byte
	var tftd
	var progress_percentage_last
	static header = bytes('55BB')

    def init()
        log("NSP: Initializing Driver")
        self.ser = serial(17, 16, 115200, serial.SERIAL_8N1)
        self.flash_mode = 0
		self.flash_version = 1
		self.flash_skip = false
		tasmota.add_driver(self)
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
  
    def send(payload)
        var payload_bin = self.encode(payload)
        if self.flash_mode==1
            log("NSP: skipped command becuase still flashing", 3)
        else 
            self.ser.write(payload_bin)
            log("NSP: payload sent = " + str(payload_bin), 3)
        end
    end
	
    def start_flash(url)		
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
        var file = sa[1]
        #print(host,port,file)
		
		self.tftd = TftDownloader(host, port, file, 32768)
		
		# get size of tft file
		self.flash_size = self.tftd.get_file_size()
		
		self.flash_mode = 1
        self.sendnx('DRAKJHSUYDGBNCJHGJKSHBDN')
        self.sendnx('recmod=0')
        self.sendnx('recmod=0')
		self.sendnx("connect")
		self.sendnx("connect")

		self.flash_current_byte = 0
    end
	
	def write_chunk(b_start)
		var chunk = self.tftd.next_chunk(b_start)
		#import string
		#print(string.format("Sending Byte %d - %d with size of %d", b_start, b_start+4095, chunk.size()))
		self.ser.write(chunk)
        return chunk.size()
    end
	
	def flash_nextion()
		import string
	    var x = self.write_chunk(self.flash_current_byte)
		self.flash_current_byte = self.flash_current_byte + x
		var progress_percentage = (self.flash_current_byte*100/self.flash_size)
        if (self.progress_percentage_last!=progress_percentage)
			print(string.format("Flashing Progress ( %d / %d ) [ %d ]", self.flash_current_byte, self.flash_size, progress_percentage))
            self.progress_percentage_last = progress_percentage
            tasmota.publish_result(string.format("{\"Flashing\":{\"complete\": %d}}",progress_percentage), "RESULT") 
        end
        if (self.flash_current_byte==self.flash_size)
            log("NSP: Flashing complete")
            self.flash_mode = 0
        end
        tasmota.yield()
	end
	
	def every_100ms()
        import string
        if self.ser.available() > 0
            var msg = self.ser.read()
            if size(msg) > 0
                print("NSP: Received Raw =", msg)
                if self.flash_mode==1
                    var str = msg[0..-4].asstring()
                    log(str, 3)
					# TODO: add check for firmware versions < 126 and send proto 1.1 command for thoose
                    if (string.find(str,"comok 2")==0)
						if self.flash_version==1
							log("NSP: Flashing 1.1")
							self.sendnx(string.format("whmi-wri %d,115200,1",self.flash_size)) # Nextion Upload Protocol 1.1
						else
							log("NSP: Flashing 1.2")
							self.sendnx(string.format("whmi-wris %d,115200,1",self.flash_size)) # Nextion Upload Protocol 1.2
						end
						
					# skip to byte (upload protocol 1.2)
					elif (size(msg)==1 && msg[0]==0x08)
						self.flash_skip = true
						print("rec 0x08")
					elif (size(msg)==4 && self.flash_skip)
						var skip_to_byte = msg[0..4].get(0,4)
						if(skip_to_byte == 0)
							print("don't skip, offset is 0")
						else
							print("skip to ", skip_to_byte)
							self.flash_current_byte = skip_to_byte
						end
						self.flash_nextion()
					# send next 4096 bytes (proto 1.1/1.2)
                    elif (size(msg)==1 && msg[0]==0x05)
						print("rec 0x05")
						self.flash_nextion()
                    end
                else
					# Recive messages using custom protocol 55 BB [payload length] [payload length] [payload] [crc] [crc]
					if msg[0..1] == self.header
						var lst = self.split_55(msg)
						for i:0..size(lst)-1
							msg = lst[i]
							#var j = msg[2]+2
							var j = size(msg) - 3
							msg = msg[4..j]
							if size(msg) > 2
								var jm = string.format("{\"CustomRecv\":\"%s\"}",msg.asstring())
								tasmota.publish_result(jm, "RESULT")
							end
						end
					elif msg == bytes('000000FFFFFF88FFFFFF')
						log("NSP: Screen Initialized")
					else
                        var jm = string.format("{\"nextion\":\"%s\"}",str(msg[0..-4]))
						tasmota.publish_result(jm, "RESULT")
					end       			
                end
            end
        end
    end
end

def get_current_version(cmd, idx, payload, payload_json)
	import string
	var version_of_this_script = 2
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
			print("Scucessfully written nspanel-lovelace-ui berry driver")
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

var nextion = Nextion()

def flash_nextion(cmd, idx, payload, payload_json)
	def task()
		nextion.flash_version = 1
        nextion.start_flash(payload)
    end
    tasmota.set_timer(0,task)
    tasmota.resp_cmnd_done()
end

tasmota.add_cmd('FlashNextion', flash_nextion)

def flash_nextion_1_2(cmd, idx, payload, payload_json)
	def task()
		nextion.flash_version = 2
        nextion.start_flash(payload)
    end
    tasmota.set_timer(0,task)
    tasmota.resp_cmnd_done()
end

tasmota.add_cmd('FlashNextionFast', flash_nextion_1_2)

def send_cmd(cmd, idx, payload, payload_json)
    nextion.sendnx(payload)
    tasmota.resp_cmnd_done()
end

tasmota.add_cmd('Nextion', send_cmd)

def send_cmd2(cmd, idx, payload, payload_json)
    nextion.send(payload)
    tasmota.resp_cmnd_done()
end

tasmota.add_cmd('CustomSend', send_cmd2)
