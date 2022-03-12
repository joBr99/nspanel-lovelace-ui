import binascii
import struct
import codecs

print("Calculate NSPanel hex command from JSON payload\n")

#value = input("Enter JSON:\n")
value = "entityUpdHeading,Heading1234"

def crc16(data:bytes, poly:hex=0xA001) -> str:
    '''
        CRC-16 MODBUS HASHING ALGORITHM
    '''
    crc = 0xFFFF
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = ((crc >> 1) ^ poly
                   if (crc & 0x0001)
                   else crc >> 1)
    return crc
    

payload = bytes(value, 'ascii')

header = binascii.unhexlify('55BB')

print("length:", len(value))

length = len(value).to_bytes(2, 'little')

bytes_payload = header + length + payload

#print("bytes_payload:", bytes_payload)

msg_crc = crc16(bytes_payload)

#print('{:04x}'.format(msg_crc))

crc=struct.pack('H', msg_crc)

command=binascii.hexlify(bytes_payload + crc)

print("\n\n")
print(bytes.decode(command))