#### Possible configuration values for screensaver config

key | optional | type | default | description
-- | -- | -- | -- | --
`entity` | True | string | `weather.example` | weather entity from homeassistant
`weatherUnit` | True | string | `celsius` | unit for temperature, valid values are `celsius` or `fahrenheit`
`weatherOverrideForecast1` | True | complex | `None` | sensor entity from home assistant here to overwrite the first weather forecast item on the screensaver
`weatherOverrideForecast2` | True | complex | `None` | sensor entity from home assistant here to overwrite the second weather forecast item on the screensaver
`weatherOverrideForecast3` | True | complex | `None` | sensor entity from home assistant here to overwrite the third weather forecast item on the screensaver
`weatherOverrideForecast4` | True | complex | `None` | sensor entity from home assistant here to overwrite the forth weather forecast item on the screensaver
`statusIcon1` | True | complex | `None` | status icon left to the date string, config similar to weatherOverride
`statusIcon2` | True | complex | `None` | status icon right to the date string, config similar to weatherOverride
`doubleTapToUnlock` | True | boolean | `False` | requires to tap screensaver two times
`alternativeLayout` | True | boolean | `False` | alternative layout with humidity
`theme` | True | complex | | configuration for theme
`defaultCard` | True | string | `None` | default page after exiting screensaver; only works with top level cards defined in cards; needs to be a navigation item, see subpages (navigate.type_key) This config option will also be evaluated as a HomeAssistant Template.
`key` | True | string | `None` | Used by navigate items

Example for the weatherOverride config options:

```yaml
      weatherOverrideForecast4:
        entity: sensor.example_item
        name: name
        icon: mdi:lightbulb
```
#### Possible configuration values for screensaver theme config

key | option | type | default | description
-- | -- | -- | -- | --
`background` | True | list | Black | `[R, G, B]`
`time` | True | list | White | `[R, G, B]`
`timeAMPM` | True | list | White | `[R, G, B]`
`date` | True | list | White | `[R, G, B]`
`tMainIcon` | True | list | White | `[R, G, B]`
`tMainText` | True | list | White | `[R, G, B]`
`tForecast1` | True | list | White | `[R, G, B]`
`tForecast2` | True | list | White | `[R, G, B]`
`tForecast3` | True | list | White | `[R, G, B]`
`tForecast4` | True | list | White | `[R, G, B]`
`tF1Icon` | True | list | White | `[R, G, B]`
`tF2Icon` | True | list | White | `[R, G, B]`
`tF3Icon` | True | list | White | `[R, G, B]`
`tF4Icon` | True | list | White | `[R, G, B]`
`tForecast1Val` | True | list | White | `[R, G, B]`
`tForecast2Val` | True | list | White | `[R, G, B]`
`tForecast3Val` | True | list | White | `[R, G, B]`
`tForecast4Val` | True | list | White | `[R, G, B]`
`bar` | True | list | White | `[R, G, B]`
`tMainIconAlt` | True | list | White | `[R, G, B]`
`tMainTextAlt` | True | list | White | `[R, G, B]`
`tMRIcon` | True | list | White | `[R, G, B]`
`tMR` | True | list | White | `[R, G, B]`
`tTimeAdd` | True | list | White | `[R, G, B]`
`autoWeather` | True | boolean | false | Set to `true` to enable weather icons to change depending on state e.g. blue for rainy. Any custom colors in `tMainIcon` `tF1Icon` `tF2Icon` `tF3Icon` `tF4Icon` take precedence.

If `autoWeather: true` is set. You may also overwrite the default color mapping for any valid weather state provided by homeassistant e.g. `rainy: [50, 50, 255]` or `sunny: [255, 255, 0]`

Specify colours as red green and blue values from 0-255 e.g. `[255, 0, 0]` for red or `[0, 0, 255]` for blue. These are translated internally to RGB565 (note that this has lower color depth so the colours may not appear the same). Also note that the screen has a low contrast ratio, so colors look sigificantly different at full display brightness and lowest brightness.

Example for the theme config:

```yaml
    screensaver:
      theme:
        autoWeather: true
```


<details>
<summary>Config Example for configured weatherOverrides</summary>
<br>
```
  config:
    screensaver:
      entity: weather.k3ll3r
      weatherOverrideForecast4:
        entity: sensor.example_item
        name: name
        icon: lightbulb
      alternativeLayout: True
```
</details>

<details>
<summary>Config Example for configured statusIcons</summary>
<br>
```
  config:
    screensaver:
        entity: weather.k3ll3r
        statusIcon1:
          entity: switch.example_item
        statusIcon2:
           entity: binary_sensor.example_item
```
</details>

<details>
<summary>Config Example for configured theme (colored weather icons)</summary>
<br>
```
  config:
    screensaver:
        entity: weather.k3ll3r
        theme:
			autoWeather: true
```
</details>


<details>
<summary>Config Example for configured theme (custom)</summary>
<br>
```
  config:
    screensaver:
        entity: weather.k3ll3r
   screensaver:
      entity: weather.k3ll3r
      theme:
        #time:             [220, 0, 255]
        #timeAMPM:         [220, 0, 255]
        #date:             [220, 0, 255]
        #tMainIcon:        [220, 0, 255]
        #tMainText:        [220, 0, 255]
        #tForecast1:       [220, 0, 255]
        #tForecast2:       [220, 0, 255]
        #tForecast3:       [220, 0, 255]
        #tForecast4:       [220, 0, 255]
        #tF1Icon:          [220, 0, 255]
        #tF2Icon:          [220, 0, 255]
        #tF3Icon:          [220, 0, 255]
        #tF4Icon:          [220, 0, 255]
        #tForecast1Val:    [220, 0, 255]
        #tForecast2Val:    [220, 0, 255]
        #tForecast3Val:    [220, 0, 255]
        #tForecast4Val:    [220, 0, 255]
        #bar:              [220, 0, 255]
        #tMRIcon:          [220, 0, 255]
        #tMR:              [220, 0, 255]
	#tTimeAdd:         [220, 0, 255]

        #autoWeather automatically colors the screensaver weather icons based upon weather. Uncomment the following line to enable.
        #autoWeather: true
        
        #If you have enabled autoWeather, the following options allow you to customise the colors used for autoWeather.
        
        #clear-night:              [150, 150, 100]
        #cloudy:                   [75, 75, 75]
        #exceptional:              [255, 50, 50]
        #fog:                      [150, 150, 150]
        #hail:                     [200, 200, 200]
        #lightning:                [200, 200, 0]
        #lightning-rainy:          [200, 200, 150]
        #partlycloudy:             [150, 150, 150]
        #pouring:                  [50, 50, 255]
        #rainy:                    [100, 100, 255]
        #snowy:                    [150, 150, 150]
        #snowy-rainy:              [150, 150, 255]
        #sunny:                    [255, 255, 0]
        #windy:                    [150, 150, 150]
        #windy-variant:            [255, 125, 125]
```
</details>
