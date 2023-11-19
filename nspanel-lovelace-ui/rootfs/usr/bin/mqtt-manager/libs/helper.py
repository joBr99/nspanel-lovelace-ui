import colorsys
import math
import secrets
import string


def iid():
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(10))


def scale(val, src, dst):
    return ((val - src[0]) / (src[1]-src[0])) * (dst[1]-dst[0]) + dst[0]


def hsv2rgb(h, s, v):
    hsv = colorsys.hsv_to_rgb(h, s, v)
    return tuple(round(i * 255) for i in hsv)


def pos_to_color(x, y, wh):
    r = wh/2
    x = round((x - r) / r * 100) / 100
    y = round((r - y) / r * 100) / 100

    r = math.sqrt(x*x + y*y)
    sat = 0
    if (r > 1):
        sat = 0
    else:
        sat = r
    hsv = (math.degrees(math.atan2(y, x)) % 360/360, sat, 1)
    rgb = hsv2rgb(hsv[0], hsv[1], hsv[2])
    return rgb


def rgb_brightness(rgb_color, brightness):
    # brightness values are in range 0-255
    # to make sure that the color is not completly lost we need to rescale this to 70-255
    brightness = int(scale(brightness, (0, 255), (70, 255)))
    red = rgb_color[0]/255*brightness
    green = rgb_color[1]/255*brightness
    blue = rgb_color[2]/255*brightness
    return [int(red), int(green), int(blue)]


def rgb_dec565(rgb_color):
    red = rgb_color[0]
    green = rgb_color[1]
    blue = rgb_color[2]
    return ((int(red >> 3) << 11) | (int(green >> 2) << 5) | (int(blue >> 3)))


def convert_temperature(temp, unit):
    if unit == "fahrenheit":
        return f"{temp}°F"
    else:
        return f"{temp}°C"
