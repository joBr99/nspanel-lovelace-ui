"""
Nextion2Text by Max Zuidberg

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
"""

from string import whitespace
import sys
from pathlib import Path
import struct
from typing import List
import argparse
import copy
import json


class IndentList(list):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.indent = 4
        self.indentLevel = 0
        self.indentStr = " "
        self.emptyLinesLimit = 1
        self.emptyLinesCount = 0

    def appendIndent(self, newStr):
        newStr: str
        if not newStr.strip(whitespace):
            if self.emptyLinesCount < self.emptyLinesLimit:
                self.emptyLinesCount += 1
            else:
                return
        else:
            self.emptyLinesCount = 0
        self.append(self.indentLevel * self.indent * self.indentStr + newStr)

    def appendIndentLine(self, newStr):
        newStr: str
        if not newStr.endswith("\n"):
            newStr += "\n"
        self.appendIndent(newStr)


class Component:
    """
    How the attributes dict is organized:
    attributes:
        "encoded" name:
            -1: default interpretation:
                name: Name by which the encoded name will be replaced
                type: int/str/strlist/bool - how to decode the content
                mapping: optional: replace the values by a string
            12: Optional interpretation if attribute is part of a component of type 12
    """
    codeEvents = {
        "codesload":    "Preinitialize Event",
        "codesloadend": "Postinitialize Event",
        "codesdown":    "Touch Press Event",
        "codesup":      "Touch Release Event",
        "codesunload":  "Page Exit Event",
        "codestimer":   "Timer Event",
        "codesplayend": "Play Complete Event",
    }
    attributes = {
        "type": {
            "name": "Type",
            "struct": "i",
            "mapping": {
                #Needs to contain all types, even if some get overridden afterwards. Order here is used for sorting later
                121: "Page",
                52:  "Variable",
                54:  "Number",
                59:  "XFloat",
                116: "Text",
                55:  "Scrolling Text",
                112: "Picture",
                113: "Crop Picture",
                58:  "QR Code",
                106: "Progress Bar",
                122: "Gauge",
                0:   "Waveform",
                1:   "Slider",
                98:  "Button",
                53:  "Dual-state Button",
                56:  "Checkbox",
                57:  "Radio",
                67:  "Switch",
                61:  "Combo Box",
                68:  "Text Select",
                62:  "SLText",
                4:   "Audio",
                60:  "External Picture",
                2:   "Gmov",
                3:   "Video",
                66:  "Data Record",
                63:  "File Stream",
                65:  "File Browser",
                109: "Hotspot",
                51:  "Timer",
		5:   "TouchCap",
                -1: "Unknown",
            },
            "type": {
                52: {
                    "sta": {
                        0: {
                            "mapping": {
                                52: "Variable (int32)",
                            },
                        },
                        1: {
                            "mapping": {
                                52: "Variable (string)",
                            },
                        },
                    },
                },
            },

        },
        "id": {
            "name": "ID",
            "struct": "i",
        },
        "vscope": {
            "name": "Scope",
            "struct": "i",
            "mapping": {
                0: "local",
                1: "global",
            },
        },
        "objname": {
            "name": "Object Name",
            "struct": "s",
        },
        "sta": {
            "name": "Fill",
            "struct": "i",
            "vis": True,
            "mapping": {
                0: "crop image",
                1: "solid color",
                2: "image",
            },
            "type": {
                52: {#Variable
                    "vis": False,
                    "ignore": True,
                    "mapping": {
                        0: "int32",
                        1: "string",
                    },
                },
                58: {#QR Code
                    "name": "Logo overlay",
                    "mapping": {
                        0: "no",
                        1: "yes",
                    },
                },
                121: {#Page
                    "mapping": {
                        0: "no background (white)",
                        1: "solid color",
                        2: "picture",
                    },
                },
                106: {#Progress Bar
                    "mapping": {
                        0: "solid color",
                        1: "image",
                    },
                },
            },
            "model": {
                "P": {
                    "mapping": {
                        0: "crop image",
                        1: "solid color",
                        2: "image",
                        3: "transparent",
                    },
                    "type": {
                        121: {# Page
                            "mapping": {
                                0: "no background (transparent)",
                                1: "solid color",
                                2: "picture",
                            },
                        },
                    },
                },
            },
        },
        "psta": {
            "struct": "i",
            "name": "Cursor Fill",
            "vis": True,
            "mapping": {
                0: "circular",
                1: "image",
                2: "square",
            },
            "model": {
                -1: {
                    "ignore": True,
                },
                "P": {
                    "ignore": False,
                },
            },
        },
        "style": {
            "name": "Style",
            "struct": "i",
            "vis": True,
            "mapping": {
                0: "flat",
                1: "border",
                2: "3D down",
                3: "3D up",
                4: "3D auto",
            },
            "sta": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                }
            }
        },
        "key": {
            "struct": "i",
            "name": "Associated Keyboard",
            "mapping": {
                255: "none",
            },
        },
        "font": {
            "struct": "i",
            "name": "Font ID",
            "vis": True,
        },
        "pw": {
            "struct": "i",
            "name": "Input Type",
            "vis": True,
            "mapping": {
                0: "character",
                1: "password",
            },
        },
        "val": {
            "name": "Value",
            "struct": "i",
            "type": {
                1: {
                    "name": "Position",
                },
                52: {
                    "sta": {
                        1 : {
                            "ignore": True,
                        },
                    },
                },
                53: {
                    "name": "State",
                    "mapping": {
                        0: "unpressed",
                        1: "pressed",
                    },
                },
                98: 53,
                56: {
                    "name": "State",
                    "mapping": {
                        0: "unpressed",
                        1: "pressed",
                    },
                },
                57: 56,
                122: {
                    "name": "Angle (deg)",
                }
            },
        },
        "txt": {
            "name": "Text",
            "struct": "s",
            "type": {
                52: {
                    "sta": {
                        0 : {
                            "ignore": True,
                        },
                    },
                },
            },
        },
        "txt_maxl":{
            "name": "Max. Text Size",
            "struct": "i",
            "type": {
                52: {
                    "sta": {
                        0 : {
                            "ignore": True,
                        },
                    },
                },
            },
        },
        "isbr": {
            "struct": "i",
            "name": "Word wrap",
            "vis": True,
            "mapping": {
                0: "disabled",
                1: "enabled",
            },
        },
        "vvs0": {
            "struct": "i",
            "name": "Significant digits left",
            "vis": True,
            "type": {
                55: {# Scrolling Text
                    "ignore": True,
                },
                122: {# Gauge
                    "model": {
                        -1: {
                            "ignore": True,
                        },
                        "P": {
                            "name": "Head width"
                        },
                    },
                },
            },
        },
        "vvs1": {
            "struct": "i",
            "name": "Significant digits right",
            "vis": True,
            "type": {
                55: {# Scrolling Text
                    "ignore": True,
                },
                122: {  # Gauge
                    "model": {
                        -1: {
                            "ignore": True,
                        },
                        "P": {
                            "name": "Center width"
                        },
                    },
                },
            },
        },
        "vvs2": {
            "struct": "i",
            "vis": True,
            "type": {
                55: {# Scrolling Text
                    "ignore": True,
                },
                122: {  # Gauge
                    "model": {
                        -1: {
                            "ignore": True,
                        },
                        "P": {
                            "name": "Foot width"
                        },
                    },
                },
            },
        },
        "vvs3": {
            "struct": "i",
            "vis": True,
            "type": {
                55: {# Scrolling Text
                    "ignore": True,
                },
            },
        },
        "lenth": {
            "struct": "i",
            "name": "Significant digits shown",
            "vis": True,
            "mapping": {
                0: "all",
            },
        },
        "format": {
            "struct": "i",
            "name": "Format",
            "vis": True,
            "mapping": {
                0: "decimal",
                1: "hexadecimal",
                2: "decimal with digit grouping"
            },
            "type": {
                122: {# Gauge
                    "name": "Angle offset",
                    "mapping": dict(), #disable default mapping
                },
            },
        },
        "tim": {
            "struct": "i",
            "name": "Period (ms)",
            "type": {
                -1: {
                    "vis": True,
                },
                51: {# Timer
                    "vis": False,
                },
            },
        },
        "en": {
            "struct": "i",
            "name": "Enabled",
            "mapping": {
                0: "no",
                1: "yes",
            },
            "type": {
                -1: {
                    "vis": True,
                },
                51: {# Timer
                    "vis": False,
                },
            },
        },
        "dis": {
            "struct": "i",
            "name": "Corner Radius (Perc.)",
            "vis": True,
            "model": {
                -1: {
                    "ignore": True,
                },
                "P": {
                    "ignore": False,
                    "type": {
                        0: {  # Waveform
                            "ignore": True,
                        },
                        122: {  # Gauge
                            "ignore": True,
                        },
                    },
                },
            },
        },
        "spax": {
            "struct": "i",
            "name": "Horizontal Spacing",
            "vis": True,
        },
        "spay": {
            "struct": "i",
            "name": "Vertical Spacing",
            "vis": True,
        },
        "xcen": {
            "struct": "i",
            "name": "Horizontal Alignment",
            "vis": True,
            "mapping": {
                0: "left",
                1: "center",
                2: "right",
            },
        },
        "ycen": {
            "struct": "i",
            "name": "Vertical Alignment",
            "vis": True,
            "mapping": {
                0: "top",
                1: "center",
                2: "bottom",
            },
        },
        "x": {
            "name": "x coordinate",
            "struct": "i",
            "vis": True,
            "type": {
                121: {# Page
                    "ignore": True,
                },
            },
            #"model": {
            #    "P": {
            #        "drag": {
            #            1: {
            #                "name": "Initial x coord."
            #            },
            #        },
            #    },
            #},
        },
        "y": {
            "name": "y coordinate",
            "struct": "i",
            "vis": True,
            "type": {
                121: {# Page
                    "ignore": True,
                },
            },
            #"model": {
            #    "P": {
            #        "drag": {
            #            1: {
            #                "name": "Initial y coord."
            #            },
            #        },
            #    },
            #},
        },
        "w": {
            "name": "Width",
            "struct": "i",
            "vis": True,
            type: {
                121: {# Page
                    "ignore": True,
                },
            },
        },
        "h": {
            "name": "Height",
            "struct": "i",
            "vis": True,
            "type": {
                121: {# Page
                    "ignore": True,
                },
            },
        },
        "bco": {
            "name": "Back. Color",
            "struct": "i",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                2: 0,
            },
            "type": {
                53: {# Button
                    "name": "Back. Color (Unpressed)",
                }
            }
        },
        "bco1": {
            "name": "Slided Back. Color",
            "struct": "i",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                2: 0,
            },
        },
        "bco2": {
            "struct": "i",
            "name": "Back. Color (Pressed)",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                2: 0,
            },
        },
        "pco": {
            "name": "Font Color",
            "struct": "i",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                2: 0,
            },
            "type": {
                58: {
                    "name": "Foreground Color"
                },
                53: {
                    "name": "Font Color (Unpressed)"
                },
                98: 53,
            },
        },
        "pco0": {
            "struct": "i",
            "name": "Channel 0 Color",
            "vis": True,
        },
        "pco1": {
            "struct": "i",
            "name": "Channel 1 Color",
            "vis": True,
            "ch": {
                1: {
                    "ignore": True,
                },
            },
        },
        "pco2": {
            "name": "Font Color (Pressed)",
            "struct": "i",
            "vis": True,
            "ignore": True,
            "type": {
                53: {
                    "sta": {
                        1: {
                            "ignore": False,
                        },
                    },
                },
                98: 53,
                0: {# Waveform
                    "name": "Channel 2 Color",
                    "ch": {
                        3: {
                            "ignore": False,
                        },
                        4: {
                            "ignore": False,
                        },
                    },
                },
            },
        },
        "pco3": {
            "struct": "i",
            "name": "Channel 3 Color",
            "vis": True,
            "ignore": True,
            "ch": {
                4: {
                    "ignore": False,
                },
            },
        },
        "pic": {
            "name": "Back. Picture ID",
            "struct": "i",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                1: 0,
            },
            "type": {
                112: {#Picture
                    "name": "Picture ID",
                },
                53: {#Button
                    "name": "Background Picture ID (Unpressed)"
                },
                98: 53, #Dual-State Button
                58: {#QR Code
                    "sta": {
                        0: {
                            "ignore": True,
                        },
                        1: {
                            "ignore": False,
                        },
                    },
                },
            },
        },
        "pic1": {
            "name": "Slided Back. Picture ID",
            "struct": "i",
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                1: 0,
            },
        },
        "pic2": {
            "name": "Back. Picture ID (Pressed)",
            "struct": "i",
            "ignore": True,
            "vis": True,
            "sta": {
                0: {
                    "ignore": True,
                },
                1: 0,
            },
            "type": {
                53: {#Button
                    "ignore": False,
                },
                98: 53,
            },
        },
        "picc": {
            "name": "Cropped Back. Picture ID",
            "struct": "i",
            "vis": True,
            "sta": {
                1: {
                    "ignore": True,
                },
                2: 1,
            },
            "type": {
                53: {
                    "name": "Cropped Back. Picture ID (Unpressed)"
                },
                98: 53,
            },
        },
        "picc1": {
            "name": "Cropped Slided Back. Picture ID",
            "struct": "i",
            "vis": True,
            "sta": {
                1: {
                    "ignore": True,
                },
                2: 1,
            },
        },
        "picc2": {
            "name": "Cropped Back. Picture ID (Pressed)",
            "struct": "i",
            "vis": True,
            "sta": {
                1: {
                    "ignore": True,
                },
                2: 1,
            },
        },
        "bpic": {
            "struct": "i",
            "name": "Background Picture ID",
            "vis": True,
        },
        "ppic": {
            "struct": "i",
            "name": "Foreground Picture ID",
            "vis": True,
        },

        "dez": {
            "name": "Direction",
            "struct": "i",
            "vis": True,
            "mapping": {
                0: "horizontal",
                1: "vertical",
            },
        },
        "dir": {
            "struct": "i",
            "name": "Direction",
            "vis": True,
            "type": {
                55: {# Scrolling Text
                    "mapping": {
                        0: "left->right",
                        1: "right->left",
                        2: "top->bottom",
                        3: "bottom->top",
                    },
                },
                0: {# Waveform
                    "name": "Flow Direction",
                    "mapping": {
                        0: "left->right",
                        1: "right->left",
                        2: "right aligned",
                    },
                },
            },
        },
        "borderc": {
            "struct": "i",
            "name": "Border Color",
            "vis": True,
            "style": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                },
            },
        },
        "borderw": {
            "struct": "i",
            "name": "Border Width",
            "vis": True,
            "style": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                },
            },
        },
        "mode": {
            "name": "Direction",
            "struct": "i",
            "vis": True,
            "mapping": {
                0: "horizontal",
                1: "vertical",
            },
            "type": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                },
            },
        },
        "maxval": {
            "name": "Upper range limit",
            "struct": "i",
            "type": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                },
            },
        },
        "minval": {
            "name": "Lower range limit",
            "struct": "i",
            "type": {
                -1: {
                    "ignore": True,
                },
                1: {
                    "ignore": False,
                },
            },
        },
        "drag": {
            "name": "Dragging",
            "struct": "i",
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
                "P": {
                    "type": {
                        121: {# Page
                            "ignore": True
                        },
                    },
                },
            },
        },
        "disup": {
            "name": "Disable release event after dragging",
            "struct": "i",
            "model": {
                "T": {
                    "ignore": True
                },
                "K": "T",
                "P": {
                    "type": {
                        121: {# Page
                            "ignore": True
                        },
                    },
                    "drag": {
                        0: {
                            "ignore": True
                        }
                    }
                },
            },
        },
        "aph": {
            "name": "Opacity",
            "struct": "i",
            "vis": True,
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "first": {
            "name": "Effect Priority",
            "struct": "i",
            "vis": True,
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
                "P": {
                    "effect": {
                        0: {
                            "ignore": True,
                        },
                    },
                },
            },
        },
        "time": {
            "name": "Effect Time",
            "struct": "i",
            "vis": True,
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
                "P": {
                    "effect": {
                        0: {
                            "ignore": True,
                        },
                    },
                },
            },
        },
        "sendkey": {
            "name": "Send Component ID",
            "struct": "i",
            "mapping": {
                0: "disabled",
                1: "on release",
                2: "on press",
                3: "on press and release",
            },
        },
        "movex": {
            "name": "",
            "struct": "i",
            "vis": True,
            "ignore": True
        },
        "movey": {
            "name": "",
            "struct": "i",
            "vis": True,
            "ignore": True
        },
        "endx": {
            "name": "",
            "struct": "i",
            "vis": True,
            "ignore": True
        },
        "endy": {
            "name": "",
            "struct": "i",
            "vis": True,
            "ignore": True
        },
        "effect": {
            "name": "Effect",
            "struct": "i",
            "vis": True,
            "mapping": {
                0: "load",
                1: "top fly into",
                2: "bottom fly into",
                3: "left fly into",
                4: "right fly into",
                5: "top left fly into",
                6: "top right fly into",
                7: "bottom left fly into",
                8: "bottom right fly into",
                9: "fade into the gradual change",
                10: "middle zoom",
            },
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "lockobj": {
            "name": "Locked",
            "struct": "i",
            "mapping": {
                0: "no",
                1: "yes",
            },
            "type": {
                -1: {
                    "ignore": True,
                },
                121: {
                    "ignore": False,
                },
            },
        },
        "groupid0": {
            "struct": "i",
            "ignore": True
        },
        "groupid1": {
            "struct": "i",
            "ignore": True
        },
        "ch": {
            "struct": "i",
			"ignore": True,
			"type":	{
				0: {# Waveform
					"ignore": False,
				},
			},
            "name": "Channel count",
        },
        "gdc": {
            "struct": "i",
            "name": "Grid Color",
            "vis": True,
        },
        "gdw": {
            "struct": "i",
            "name": "Grid hor. spacing",
            "vis": True,
        },
        "gdh": {
            "struct": "i",
            "name": "Grid ver. spacing",
            "vis": True,
        },
        "wid": {
            "struct": "i",
            "vis": True,
            "type": {
                1: {# Slider
                    "name": "Cursor width",
                    "mapping": {
                        255: "auto",
                    },
                },
                122: {# Gauge
                    "model": {
                        -1: {
                            "ignore": True,
                        },
                        "P": {
                            "ignore": False,
                            "name": "Gauge Thickness",
                        },
                    },
                },
            },
        },
        "hig": {
            "struct": "i",
            "vis": True,
            "type": {
                1: {# Slider
                    "name": "Cursor height",
                },
                122: {# Gauge
                    "model": {
                        -1: {
                            "ignore": True,
                        },
                        "P": {
                            "ignore": False,
                            "name": "Center circle dia.",
                        },
                    },
                },
            },
        },
        "up": {
            "name": "Swide up page ID",
            "struct": "i",
            "mapping": {
                255: "disabled",
            },
            "type": {
                122: {  # Gauge
                    "vis": True,
                    "name": "Head Length",
                    "mapping": {
                        32767: "auto",
                    },
                },
            },
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "down": {
            "name": "Swide down page ID",
            "struct": "i",
            "mapping": {
                255: "disabled",
            },
            "type": {
                122: {  # Gauge
                    "vis": True,
                    "name": "Foot Length"
                },
            },
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "left": {
            "name": "Swide left page ID",
            "struct": "i",
            "mapping": {
                255: "disabled",
            },
            "type": {
                122: {  # Gauge
                    "vis": True,
                    "name": "Head off-center"
                },
            },
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "right": {
            "name": "Swide right page ID",
            "struct": "i",
            "mapping": {
                255: "disabled",
            },
            "type": {
                122: {  # Gauge
                    "vis": True,
                    "name": "Gauge Head Length"
                },
            },
            "model": {
                "T": {
                    "ignore": True,
                },
                "K": "T",
            },
        },
        "objWid": {
            "struct": "i",
            "ignore": True,
        },
        "objHig": {
            "struct": "i",
            "ignore": True,
        },
        "inittrue": {
            "struct": "i",
            "ignore": True,
        },
        "molloc": {
            "struct": "i",
            "ignore": True,
        },
        "molloc_s": {
            "struct": "i",
            "ignore": True,
        },
    }

    def __init__(self, raw, modelSeries="T"):
        self.components = []
        self.data = dict()
        self.rawData = dict()
        self.sloc = 0
        self.uniqueSloc = set()
        self.propNameMaxLength = 0
        self.raw = raw
        self.modelSeries = modelSeries
        self.loadRawProperties()

    def __repr__(self):
        repr = self.rawData["att"]["objname"]
        data = self.parseRawProperties(customInclude=("type",), inplace=False)
        if data and "Attributes" in data and Component.attributes["type"]["name"] in data["Attributes"]:
            repr = data["Attributes"][Component.attributes["type"]["name"]] + " " + repr
        return repr

    def getText(self, *args, **kwargs):
        return "".join(self.getTextLines(*args, **kwargs))

    def getTextLines(self, indentLevel=0, indent=4, emptyLinesLimit=1,
                     customExclude=("type", "objname"), **kwargs):
        # Initialize resulting IndentList
        result = IndentList()
        result.indentStr = " "
        result.indentLevel = indentLevel
        result.indent = indent
        result.emptyLinesLimit = emptyLinesLimit
        result.appendIndentLine(self.__repr__())
        result.indentLevel += 1

        # Parse rawData according to the given parameters
        self.parseRawProperties(customExclude=customExclude, **kwargs)
        if "Attributes" in self.data:
            result.appendIndentLine("Attributes")
            result.indentLevel += 1
            propNameMaxLength = max([len(k) for k in self.data["Attributes"].keys()])
            for prop, val in self.data["Attributes"].items():
                try:
                    val = val.replace("\r\n", "\\r\\n")
                except:
                    pass
                line = prop.ljust(propNameMaxLength, " ") + ": " + str(val)
                result.appendIndentLine(line)
            result.indentLevel -= 1
            result.appendIndentLine("")
        if "Events" in self.data:
            result.appendIndentLine("Events")
            result.indentLevel += 1
            for event, code in self.data["Events"].items():
                code: str
                result.appendIndentLine(event)
                result.indentLevel += 1
                codeLines = code.split("\n")
                for cl in codeLines:
                    originalLength = len(cl)
                    clStripped = cl.lstrip(" ")
                    clIndentLevel = (originalLength - len(clStripped)) // 2
                    clStripped = result.indentStr * result.indent * clIndentLevel + clStripped
                    result.appendIndentLine(clStripped)
                result.indentLevel -= 1
                result.appendIndentLine("")
            result.indentLevel -=1
            result.appendIndentLine("")
        return result

    def parseRawProperties(self, customInclude=tuple(), customExclude=tuple(),
                           includeVisual:bool=False, includeUnknown:int=0,
                           inplace=True, emptyEvents=False,
                           keepNames=False, keepValues=False, **kwargs):

        data = dict()
        # Model name is considered as an "attribute", too. (needed to know the right interpretation; see below)
        self.rawData["att"]["model"] = self.modelSeries
        attributes = dict()
        # The interpretation of any attribute can depend on other attributes. (see code below)
        dependencies = set(Component.attributes.keys())
        dependencies.add("model")
        for attName, attData in self.rawData["att"].items():
            if attName in customExclude:
                continue
            if attName in Component.attributes.keys():
                # Build dictionary that interpretes and ignores the right attributes.
                # attProperties = dict()
                # attProperties.update(self.attributes[attName])
                # Enforce deep copy
                attProperties = copy.deepcopy(Component.attributes[attName])
                done = False
                while not done:
                    done = True
                    keys = [k for k in attProperties.keys()]
                    for d in keys:
                        if d in dependencies:
                            done = False
                            if d in self.rawData["att"]:
                                val = self.rawData["att"][d]
                                foundVal = True
                                if val in attProperties[d]:
                                    i = val
                                elif  -1 in attProperties[d]:
                                    i = -1
                                else:
                                    foundVal = False
                                if foundVal:
                                    while not type(attProperties[d][i]) is dict:
                                        vOld = i
                                        i = attProperties[d][i]
                                        attProperties[d].pop(vOld)
                                    attProperties.update(attProperties[d][i])
                            attProperties.pop(d)
                if  customInclude and attName not in customInclude:
                    attProperties["ignore"] = True
                if ("vis" in attProperties and attProperties["vis"]) and not includeVisual:
                    attProperties["ignore"] = True
                if (not "ignore" in attProperties or not attProperties["ignore"]):
                    if "name" in attProperties and not keepNames:
                        attName = attProperties["name"]
                    if "mapping" in attProperties and not keepValues:
                        if attData in attProperties["mapping"]:
                            attData = attProperties["mapping"][attData]
                    attributes[attName] = attData
            elif attName != "model" and (includeUnknown or attName in customInclude):
                if not attName in customInclude:
                    attName = "UNKNOWN " + attName
                if len(attData) > 4 or includeUnknown == 2:#raw
                    attData = attData.decode("iso_8859_1")
                elif includeUnknown == 3:#hex
                    attData = " ".join([hex(d)[2:] for d in attData])
                elif len(attData) <= 4:
                    val = 0
                    for b in reversed(attData):
                        val = (val << 8) + b
                    attData = val
                attributes[attName] = attData
        data["Attributes"] = attributes
        # model "attribute" is no longer needed and doesnt belong here anymore
        self.rawData["att"].pop("model")
        for attName, attData in self.rawData.items():
            if not attName.startswith("codes") or (not includeUnknown and attName not in Component.codeEvents):
                continue
            if not emptyEvents and not attData:
                continue
            if not "Events" in data:
                data["Events"] = dict()
            if attName in Component.codeEvents:
                attName = Component.codeEvents[attName]
            data["Events"][attName] = attData
        if inplace:
            self.data = data
        else:
            return data

    def loadRawProperties(self):
        # First level parsing. Find all property entries
        index = 0
        properties = list()
        while index < len(self.raw):
            length = struct.unpack_from("<I", self.raw, index)[0]
            index += 4
            properties.append(self.raw[index : index + length])
            index += length
        # Drop the last (empty) element
        if not properties[-1]:
            properties = properties[:-1]
        # Second level parsing. Properties are grouped. The group name includes
        # the group length as string. F.ex. a attribute group wth 29 entries is
        # is encoded as "att-29". After those 29 entries the next group follows.
        index = 0
        self.rawData = dict()
        newData = dict()
        while index < len(properties):
            name, length = properties[index].rsplit(b"-", 1)
            length = int(length)
            index += 1
            self.rawData[name.decode("iso_8859_1")] = properties[index : index + length]
            index += length
        for k, v in self.rawData.items():
            if k == "att":
                # Parse attributes. They have a 16 byte fixed length name (filled with \x00 to 16)
                # followed by the actual value.
                rawAttributes = dict()
                for att in v:
                    # Basic name, data separation and interpretation
                    attName = att[:16].rstrip(b"\x00").decode("iso_8859_1")
                    attData = att[16:]
                    if attName in self.attributes:
                        if "i" in self.attributes[attName]["struct"]:
                            val = 0
                            for b in reversed(attData):
                                val = (val << 8) + b
                            attData = val
                        else:
                            attData = attData.decode("iso_8859_1")
                    rawAttributes[attName] = attData
                self.rawData["att"] = rawAttributes
            else:
                # code lines
                eventCode = (b"\n".join(v)).decode("iso_8859_1")
                self.rawData[k] = eventCode

class Header:
    _headerFormat = ""

    def __init__(self, raw, start = 0):
        self._raw = raw
        self._headerStart = start
        self.headerSize = self.__getHeaderSize()
        self._processData(self.__getHeaderData())

    def __getHeaderData(self):
        return struct.unpack(self._headerFormat, self._raw[self._headerStart:self._headerStart+self.headerSize])

    def __getHeaderSize(self):
        return struct.calcsize(self._headerFormat)

class PageContentHeader(Header):
    _headerFormat = "<III"

    def _processData(self, data):
        self.startOffset : int
        self.size  : int
        self.startOffset = data[0]
        self.size  = data[1]

    def __repr__(self):
        return "Header of " + self.name

class PageHeader(Header):
    _headerFormat = "<IIIII?bbb16s16b"

    #crc[4], datasize[4], datainfoaddr[4], numberobj[4], password[4], locked[1], ?[1], version[1], ?[1], name[16], reserved[16]
    def _processData(self, data):
        self.crc          : int
        self.size         : int
        self.start        : int
        self.count        : int
        self.password     : int
        self.locked       : bool
        self.fileVersion  : int
        self.name         : str
        self.components   : List[PageContentHeader] = list()
        self.crc          = data[0]
        self.size        = data[1]
        if data[2] != self.headerSize:
            ValueError("Header Size Mismatch. Expected: {0}, got: {1}".format(self.headerSize, data[2]))
        self.count        = data[3]
        self.password     = data[4]
        self.locked       = data[5]
        self.fileVersion  = data[7]
        self.name         = data[9].decode("iso_8859_1").rstrip("\x00")
        index = self._headerStart + self.headerSize
        for i in range(self.count):
            obj = PageContentHeader(self._raw, index)
            self.components.append(obj)
            index += obj.headerSize


class HMIContentHeader(Header):
    _headerFormat = "<16sII?bbb"

    def _processData(self, data):
        self.name    : str
        self.start   : int
        self.size    : int
        self.deleted : bool
        self.name    = data[0].decode("iso_8859_1").rstrip("\x00")
        self.start   = data[1]
        self.size    = data[2]
        self.deleted = data[3]

    def isPage(self):
        return self.name.endswith(".pa")

    def isImage(self):
        return self.name.endswith(".i")

    def isImageSource(self):
        return self.name.endswith(".is")

    def __bool__(self):
        return not self.deleted

    def __repr__(self):
        return "Header of " + self.name

class HMIHeader(Header):
    _headerFormat = "<I"

    def _processData(self, data):
        self.count   : int
        self.content : List[HMIContentHeader] = list()
        self.count = data[0]
        index = self._headerStart + self.headerSize
        for i in range(self.count):
            obj = HMIContentHeader(self._raw, index)
            if obj:
                self.content.append(obj)
            index += obj.headerSize
        self.count = len(self.content)

class Page:
    _defaultSortList = list(Component.attributes["type"]["mapping"].keys())
    defaultTextSort = lambda c: Page._defaultSortList.index(c.rawData["att"]["type"])

    def __init__(self, raw, start: int, size: int, modelSeries: str):
        self.__raw = raw
        self.start = start
        self.size = size
        self.components : List[Component] = list()

        self.header = PageHeader(self.__raw, self.start)

        for comp in self.header.components:
            start = self.start + self.header.headerSize + comp.startOffset
            end = start + comp.size
            compRaw = self.__raw[start:end]
            self.components.append(Component(compRaw, modelSeries))

        self.commonAttributes = set()
        for c in self.components:
            attributes = set(list(c.rawData["att"].keys()))
            if not self.commonAttributes:
                self.commonAttributes = attributes
            else:
                self.commonAttributes &= attributes

        self.components.sort(key=lambda c: c.rawData["att"]["id"])

    def __repr__(self):
        return self.components[0].__repr__()

    def getTextLines(self, *args, **kwargs):
        if "key" not in kwargs:
            key=Page.defaultTextSort
        else:
            key=kwargs.pop("key")
        comps = sorted(self.components, key=key)

        textLines = IndentList()
        for c in comps:
            textLines.extend(c.getTextLines(*args, **kwargs))
        return textLines

    def getText(self, *args, **kwargs):
        return "".join(self.getTextLines(*args, **kwargs))


class HMI:
    _models = {
        0x9aa696a7: {"short": "TJC3224T022_011", "long": "TJC 2.2\" Basic 320x240",},
        0xea4c3169: {"short": "TJC3224T024_011", "long": "TJC 2.4\" Basic 320x240",},
        0x0b997ef5: {"short": "TJC3224T028_011", "long": "TJC 2.8\" Basic 320x240",},
        0x72930b67: {"short": "TJC4024T032_011", "long": "TJC 3.2\" Basic 400x240",},
        0xade186d6: {"short": "TJC4832T035_011", "long": "TJC 3.5\" Basic 480x240",},
        0xd5f3287f: {"short": "TJC4827T043_011", "long": "TJC 4.3\" Basic 480x270",},
        0x98777c2d: {"short": "TJC8048T050_011", "long": "TJC 5.0\" Basic 800x480",},
        0x17c5fb02: {"short": "TJC8048T070_011", "long": "TJC 7.0\" Basic 800x480",},
        0x334e7201: {"short": "TJC3224K022_011", "long": "TJC 2.2\" Enhanced 320x240",},
        0x43a4d5cf: {"short": "TJC3224K024_011", "long": "TJC 2.4\" Enhanced 320x240",},
        0xa2719a53: {"short": "TJC3224K028_011", "long": "TJC 2.8\" Enhanced 320x240",},
        0xdb7befc1: {"short": "TJC4024K032_011", "long": "TJC 3.2\" Enhanced 400x240",},
        0x04096270: {"short": "TJC4832K035_011", "long": "TJC 3.5\" Enhanced 480x240",},
        0x7c1bccd9: {"short": "TJC4827K043_011", "long": "TJC 4.3\" Enhanced 480x270",},
        0x319f988b: {"short": "TJC8048K050_011", "long": "TJC 5.0\" Enhanced 800x480",},
        0xbe2d1fa4: {"short": "TJC8048K070_011", "long": "TJC 7.0\" Enhanced 800x480",},
        0xf52fdc1d: {"short": "TJC4827X343_011", "long": "TJC 4.3\" X3-Series 480x270",},
        0xb8ab884f: {"short": "TJC8048X350_011", "long": "TJC 5.0\" X3-Series 800x480",},
        0x37190f60: {"short": "TJC8048X370_011", "long": "TJC 7.0\" X3-Series 800x480",},
        0xa7ff9055: {"short": "TJC1060X3A1_011", "long": "TJC 10.0\" X3-Series 1024x600",},
        0x51841ccd: {"short": "TJC4827X543_011", "long": "TJC 4.3\" X5-Series 480x270",},
        0x1c00489f: {"short": "TJC8048X550_011", "long": "TJC 5.0\" X5-Series 800x480",},
        0x93b2cfb0: {"short": "TJC8048X570_011", "long": "TJC 7.0\" X5-Series 800x480",},
        0x8da106d5: {"short": "TJC1060X570_011", "long": "TJC 7.0\" X5-Series 1024x600",},
        0x03545085: {"short": "TJC1060X5A1_011", "long": "TJC 10.0\" X5-Series 1024x600",},
        0xf59677a7: {"short":  "NX3224T024_011", "long": "Nextion 2.4\" Basic 320x240",},
        0x1443383b: {"short":  "NX3224T028_011", "long": "Nextion 2.8\" Basic 320x240",},
        0x6d494da9: {"short":  "NX4024T032_011", "long": "Nextion 3.2\" Basic 400x240",},
        0xb23bc018: {"short":  "NX4832T035_011", "long": "Nextion 3.5\" Basic 480x240",},
        0xca296eb1: {"short":  "NX4827T043_011", "long": "Nextion 4.3\" Basic 480x270",},
        0x87ad3ae3: {"short":  "NX8048T050_011", "long": "Nextion 5.0\" Basic 800x480",},
        0x081fbdcc: {"short":  "NX8048T070_011", "long": "Nextion 7.0\" Basic 480x270",},
        0x5b49c1bc: {"short":  "NX3224F024_011", "long": "Nextion 2.4\" Discovery 240x320",},
        0xba9c8e20: {"short":  "NX3224F028_011", "long": "Nextion 2.8\" Discovery 240x320",},
        0x1ce47603: {"short":  "NX4832F035_011", "long": "Nextion 3.5\" Discovery 320x480",},
        0x5c7e9301: {"short":  "NX3224K024_011", "long": "Nextion 2.4\" Enhanced 320x240",},
        0xbdabdc9d: {"short":  "NX3224K028_011", "long": "Nextion 2.8\" Enhanced 320x240",},
        0xc4a1a90f: {"short":  "NX4024K032_011", "long": "Nextion 3.2\" Enhanced 400x240",},
        0x1bd324be: {"short":  "NX4832K035_011", "long": "Nextion 3.5\" Enhanced 480x240",},
        0x63c18a17: {"short":  "NX4827K043_011", "long": "Nextion 4.3\" Enhanced 480x270",},
        0x2e45de45: {"short":  "NX8048K050_011", "long": "Nextion 5.0\" Enhanced 800x480",},
        0xa1f7596a: {"short":  "NX8048K070_011", "long": "Nextion 7.0\" Enhanced 800x480",},
        0x181169da: {"short":  "NX4827P043_011", "long": "Nextion 4.3\" Intelligent 480x270",},
        0x55953d88: {"short":  "NX8048P050_011", "long": "Nextion 5.0\" Intelligent 800x480",},
        0xda27baa7: {"short":  "NX8048P070_011", "long": "Nextion 7.0\" Intelligent 800x480",},
        0xc43473c2: {"short":  "NX1060P070_011", "long": "Nextion 7.0\" Intelligent 1024x600",},
        0x4fc44fa0: {"short":  "NX1060P101_011", "long": "Nextion 10.0\" Intelligent 1024x600",},
    }

    def __init__(self, HMIFilePath):
        objectList = list()
        with open(HMIFilePath, "rb") as HMIFile:
            self.raw = HMIFile.read()
        self.header = HMIHeader(self.raw)
        self.pages = []
        self.programS = ""
        # Parse "main.HMI" first, then the other structures
        for obj in self.header.content:
            if obj.name == "main.HMI":
                self.modelCRC = struct.unpack_from("<I", obj._raw, obj.start + 16)[0]
                if self.modelCRC not in self._models:
                    raise Exception("Unknown model ID: " + hex(self.modelCRC))
                self.modelName = self._models[self.modelCRC]["short"]
                self.modelDesc = self._models[self.modelCRC]["long"]
                # Strip the NX/TJC prefix, take the T/K/P/X letter at the 4th place and unify P/X to P.
                self.modelSeries = self.modelName.replace("NX", "").replace("TJC", "")[4].replace("X", "P")
        for obj in self.header.content:
            if obj.isPage():
                self.pages.append(Page(self.raw, obj.start, obj.size, self.modelSeries))
            elif obj.name == "Program.s":
                self.programS = self.raw[obj.start : obj.start + obj.size].decode("iso_8859_1")
            """
            end = obj.start + len(obj)
            s = self.raw[obj.start:end].decode("iso_8859_1")
            comp = component(s)
            if comp.typeStr == "Page":
                self.pages.append(comp)
            else:
                self.pages[-1].components.append(comp)
            """


### Here starts the script part.
def getCodeLines(rawLines, removeIndent=False, removeComments=True):
    eventLines = list()
    if type(rawLines) == dict:
        for k, v in rawLines.items():
            if k.startswith("code"):
                eventLines.extend(v.splitlines())
    elif type(rawLines) == list:
        eventLines.extend(rawLines)
    elif type(rawLines) == str:
        eventLines.extend(rawLines.splitlines())
    if removeIndent:
        eventLines = [l.lstrip(" ") for l in eventLines]
    if removeComments:
        eventLines = [l for l in eventLines if not l.lstrip(" ").startswith("//")]
    return eventLines

if __name__ == '__main__':
    desc = """Get a readable text version of a Nextion HMI file. 
              Developped by Max Zuidberg, licensed under MPL-2.0"""
    parser = argparse.ArgumentParser(description=desc)
    parser.add_argument("-i", "--input_hmi", metavar="HMI_FILE", type=str, required=True,
                        help="Path to the HMI source file")
    parser.add_argument("-o", "--output_dir", metavar="TEXT_FOLDER", type=str, required=True,
                        help="Path to the folder for the generated text files.")
    parser.add_argument("-d", "--del_out", action="store_true",
                        help="Optional flag to delete the content of the output folder before creating the new files.")
    parser.add_argument("-f", "--file_ext", metavar="EXTENSION", type=str, required=False, default=".txt",
                        help="Optional Extension that is added to the text files (default: \".txt\")")
    parser.add_argument("-e", "--empty_events", action="store_true",
                        help="Optional flag to include empty events in the output (Excluded by default).")
    parser.add_argument("-n", "--keep_names", action="store_true",
                        help="Optional flag to preserve the original names (f.ex. \"bco\" instead of \"Background "
                             "color\").")
    parser.add_argument("-v", "--keep_values", action="store_true",
                        help="Optional flag to preserve the original values (f.ex. \"sta: 0\" instead of \"sta: "
                             "cropped image\").")
    parser.add_argument("-s", "--stats", action="store_true",
                        help="Optional flag to create a file in the output folder that will include all the statistics "
                             "you see in the command line output.")
    parser.add_argument("-j", "--json", action="store_true",
                        help="Optional flag to create a JSON subfolder in the output folder, that contains the "
                             "parsed data of each page as more or less nicely formatted json. Note: if you want the "
                             "\"raw\" data as json, specify an empty custom attributes dictionary.")
    parser.add_argument("-p", "--properties", required=False, nargs="*", default=[],
                        help="Specify the (list of) properties that shall be included in the parsing. "
                             "By default, only known, non-visual properties are included. If you want to include "
                             "visual properties and/or unknown properties, too, specify \"visual\" and/or "
                             "\"unknown\". By default, unknown attributes up to 4 bytes length are interpreted as "
                             "integer while longer attribute values are interpreted as string. Alternatively you can "
                             "use \"unknown_hex\" to get all unknown values as hex, or \"unknown_raw\" to get all of "
                             "them as characters (including NUL characters and other unprintable ones).")
    parser.add_argument("-c", "--custom_dict", metavar="PY_FILE", required=False, type=str, default="",
                        help="Optional. You can create your own attributes and codeEvents dictionaries instead or in "
                             "addition to the build-in dictionaries (see -x). Specify the Python file with your "
                             "dictionaries here. CAREFUL! ONLY SPECIFY FILES YOU TRUST! If they contain malicious code "
                             "it will be executed (imported as Python module).")
    parser.add_argument("-x", "--custom_exclusive", action="store_true",
                        help="Optional Flag. Requires -c. By default the build-in dictionaries are _updated_ with the "
                             "key/value pairs from the custom dictionaries. This means that keys that are only present "
                             "in the build-in dictionaries _remain_. By adding this flag, the script will _only_ use "
                             "the custom dictionaries. Note: If you only want to replace one of both build-in "
                             "dictionaries, you can do so by only including that one in your file. You do not need to "
                             "include both.")
    args = parser.parse_args()

    hmiFile = Path(args.input_hmi)
    hmiTextFolder  = Path(args.output_dir)
    hmiTextFileExt = args.file_ext

    if not hmiFile.exists():
        parser.error("HMI file not found.")

    includeUnknown = 0
    includeVisual = False
    if "visual" in args.properties:
        includeVisual = True
    if "unknown" in args.properties:
        includeUnknown = 1
    elif "unknown_hex" in args.properties:
        includeUnknown = 2
    elif "unknown_raw" in args.properties:
        includeUnknown = 3

    if args.custom_dict:
        args.custom_dict = Path(args.custom_dict)
        if not args.custom_dict.exists():
            parser.error("Could not find file with custom dictionaries.")
        if not args.custom_dict.suffix.lower() == ".py":
            parser.error("File with custon dictionaries is not a python file.")
        sys.path.insert(0, str(args.custom_dict.parent))
        try:
            custom = __import__(str(args.custom_dict.stem), fromlist=["attributes", "codeEvents"])
            try:
                if args.custom_exclusive:
                    Component.attributes = custom.attributes
                else:
                    Component.attributes.update(custom.attributes)
            except:
                print("No attributes dictionary in specified Python module.")
            try:
                if args.custom_exclusive:
                    Component.codeEvents = custom.codeEvents
                else:
                    Component.codeEvents.update(custom.codeEvents)
            except:
                print("No codeEvents dictionary in specified Python module.")
        except:
            parser.error("Could not import custom dictionaries from specified Python module.")

    hmi = HMI(hmiFile)

    if not hmiTextFileExt.startswith("."):
        hmiTextFileExt = "." + hmiTextFileExt

    if hmiTextFolder.exists() and args.del_out:
        done = False
        cwd = hmiTextFolder
        while not done:
            content = cwd.iterdir()
            # check if iterator is empty.
            empty = True
            for f in content:
                empty = False
                if f.is_file():
                    f.unlink()
                elif f.is_dir():
                    cwd =  f
            if empty:
                if cwd == hmiTextFolder:
                    done = True
                elif cwd.is_relative_to(hmiTextFolder):
                    cwd.rmdir()
                    cwd = cwd.parent
                else:
                    print("Something went wrong while recursively deleting all content of the output folder. "
                          "Please reduce your file system voodoo.")
    hmiTextFolder.mkdir(exist_ok=True)

    if args.json:
        jsonFolder = hmiTextFolder / Path("JSON")
        jsonFolder.mkdir(exist_ok=True)

    if args.stats:
        statFile = open(hmiTextFolder / Path(hmiFile.stem + "_Stats" + hmiTextFileExt), "w")

    texts = dict()
    codeLines = dict()
    texts["Program.s"] = "Program.s\n    " + "\n    ".join(hmi.programS.splitlines()) + "\n"
    codeLines["Program.s"] = getCodeLines(hmi.programS)
    compCount = dict()
    compCount["Program.s"] = 0
    if args.json:
        with open(jsonFolder / Path("Program.s" + ".json"), "w") as f:
            json.dump({"Program.s": hmi.programS}, f, indent=4)
    for page in hmi.pages:
        name = page.components[0].rawData["att"]["objname"]#str(page)
        text = page.getText(emptyLinesLimit=1, includeUnknown=includeUnknown,
                            includeVisual=includeVisual, emptyEvents=args.empty_events,
                            keepNames=args.keep_names, keepValues=args.keep_values)
        texts[name] = text
        compCount[name] = len(page.components)
        codeLines[name] = []
        for c in page.components:
            codeLines[name].extend(getCodeLines(c.rawData))
        if args.json:
            with open(jsonFolder / Path(name + ".json"), "w") as f:
                json.dump(dict([(str(c), c.data) for c in page.components]), f, indent=4)
    totalCodeLines = 0
    tusloc = set()
    for name, text in texts.items():
        with open(hmiTextFolder / Path(name + hmiTextFileExt), "w", encoding="utf-8") as f:
            pageCodeLines = codeLines[name]
            sloc = len(pageCodeLines)
            usloc = set(pageCodeLines)
            tusloc |= usloc
            totalCodeLines += sloc
            stats = []
            stats.append(name)
            stats.append("\t" + str(compCount[name]).ljust(4) + " Component(s)")
            stats.append("\t" + str(sloc).ljust(4) + " Line(s) of event code")
            stats.append("\t" + str(len(usloc)).ljust(4) + " Unique line(s) of event code")
            for i,stat in enumerate(stats):
                print(stat.replace("\t", "     "))
                stats[i] = stat + "\n"
            if args.stats:
                statFile.writelines(stats)
            f.write(text)
    stats = ["", "Total"]
    stats.append("\t" + str(len(hmi.pages)).ljust(4) + " Page(s)")
    stats.append("\t" + str(sum(compCount.values())).ljust(4) + " Component(s)")
    stats.append("\t" + str(totalCodeLines).ljust(4) + " Line(s) of event code")
    stats.append("\t" + str(len(tusloc)).ljust(4) + " Unique line(s) of event code")
    for i, stat in enumerate(stats):
        print(stat.replace("\t", "     "))
        stats[i] = stat + "\n"
    if args.stats:
        statFile.writelines(stats)
        statFile.close()
