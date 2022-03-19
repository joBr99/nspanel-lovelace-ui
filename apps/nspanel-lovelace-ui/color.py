import colorsys

def hsv2rgb(self, h, s, v):
    hsv = colorsys.hsv_to_rgb(h,s,v)
    return tuple(round(i * 255) for i in hsv)
def pos_to_color(self, x, y):
    r = 160/2
    x = round((x - r) / r * 100) / 100
    y = round((r - y) / r * 100) / 100
    
    r = math.sqrt(x*x + y*y)
    sat = 0
    if (r > 1):
        sat = 0
    else:
        sat = r
    hsv = (math.degrees(math.atan2(y, x))%360/360, sat, 1)
    rgb = self.hsv2rgb(hsv[0],hsv[1],hsv[2])
    return rgb

def rgb_dec565(red, green, blue):
    # take in the red, green and blue values (0-255) as 8 bit values and then combine
    # and shift them to make them a 16 bit dec value in 565 format. 
    print ((int(red / 255 * 31) << 11) | (int(green / 255 * 63) << 5) | (int(blue / 255 * 31)))