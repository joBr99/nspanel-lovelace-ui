# NSPanel Lovelance UI

The HMI Project of this project is only used to display stuff, navigation ist mostly up to the backend. This allows to be way more flexible.

Messages to the Panel can be send through the Command `CustomSend`, which is implemented in the berry driver.
You can issue this command through MQTT by sending messages to the `cmnd/XXX/CustomSend` Topic.
Messages from the Panel are send to the `tele/XXX/RESULT` Topic, encoded in json `{"CustomRecv":"message_from_screen"}`

## Startup

On startup the panel will send `{"CustomRecv":"event,startup,39,eu"}` every few seconds.

```
event,   #Every message from the screen will start with `event`
startup, #Startup Event
39,      #Current HMI Project Version
eu       #Current HMI Project Model
```

You can answer this message in many different ways, but in general the goal is to navigate way from the startup page. In the following example we will navigate to the screensaver page.

Send the following messages to the CustomSend Topic. (You can also send them on tasmota console for testing)

### Some preperation before we are acually navigating away:

Send this every minute: `time~18:17`

Send this at least once at midnight: `date~Donnerstag, 25. August 2022`

Send theese message once after receiving the startup event (parameters will be explained later):

`timeout~20`

`dimmode~10~100~6371`

### Navigate from the startup page to the screensaver, by sending this command to the CustomSend Topic.

`pageType~screensaver`

After sending this command you should already see the time and date.
To also show weather data you have to send them with weatherUpdate, but we will skip this for now.

### Exit Screensaver

Touching the panel on the screensaver will result in this MQTT Message on the result topic:

`event,buttonPress2,screensaver,bExit,1`

You can answer this by sending theese commands to the CustomSend Topic.

`pageType~cardEntities`

`entityUpd~test~1|1~light~light.schreibtischlampe~X~17299~Schreibtischlampe~0~text~sensor.server_energy_power~Y~17299~Server ENERGY Power~155 W~shutter~cover.rolladenfenster_cover_1~Z~17299~Fenster Eingang~A|B|C|disable|enable|enable~switch~switch.bad~D~63142~Bad~1`

## Messages to Nextion Display

### General Commands, implemented on all pages

set brightness of screensaver and active-brightness:

`dimmode~0~100 - (screen off)`

`dimmode~100~100 - (screen on with full brightness)`

set current time:

`time~22:26`

set current date:

`date~Di 24. Februar`

set screensaver timeout (set time in sec~ max 65):

`timeout~15 - timeout after 15 seconds`

`timeout~0 - disable screensaver`

change the page type:

`pageType~pageStartup`

`pageType~cardEntities`

`pageType~cardThermo`

`pageType~cardMedia`

`pageType~popupLight~Schreibtischlampe~light.schreibtischlampe`

`pageType~popupNotify`

`pageType~screensaver`

### screensaver page

`weatherUpdate~tMainIcon~tMainText~tForecast1~tF1Icon~tForecast1Val~tForecast2~tF2Icon~tForecast2Val~tForecast3~tF3Icon~tForecast3Val~tForecast4~tF4Icon~tForecast4Val~optionalLayoutIcon~optionalLayoutText~altIconFont~altIconFont`

`color~background~time~timeAMPM~date~tMainIcon~tMainText~tForecast1~tForecast2~tForecast3~tForecast4~tF1Icon~tF2Icon~tF3Icon~tF4Icon~tForecast1Val~tForecast2Val~tForecast3Val~tForecast4Val~bar~tMRIcon~tMR`

`notify~heading~text`

### cardEntities Page

`entityUpd~title~[navigation]~[entity_information]`

<table>
<thead>
  <tr>
    <th>Number</th>
    <th>Category</th>
    <th>Location</th>
    <th>Type</th>
    <th>Field</th>
    <th>Addional Information</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>0</td>
    <td>instruction</td>
    <td></td>
    <td>instruction</td>
    <td>entityUpd</td>
    <td></td>
  </tr>
  <tr>
    <td>1</td>
    <td>title</td>
    <td>title</td>
    <td>title</td>
    <td>title</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td rowspan="12">Navigation</td>
    <td rowspan="6">Upper Left Icon</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td>(ignored)¹</td>
  </tr>
  <tr>
    <td>3</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>4</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td>displayName</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>7</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>8</td>
    <td rowspan="6">Upper Right Icon</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td>(ignored)¹</td>
  </tr>
  <tr>
    <td>9</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>10</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>11</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>12</td>
    <td>displayName</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>13</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>14</td>
    <td rowspan="36">Entities</td>
    <td rowspan="6">First Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>15</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>16</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>17</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>18</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>19</td>
    <td colspan="2">optionalValue</td>
  </tr>
  <tr>
    <td>20</td>
    <td rowspan="6">Second Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>21</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>22</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>23</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>24</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>25</td>
    <td colspan="2">optionalValue</td>
  </tr>
  <tr>
    <td>26</td>
    <td rowspan="6">Thrid Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>27</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>28</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>29</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>30</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>31</td>
    <td colspan="2">optionalValue</td>
  </tr>
  <tr>
    <td>32</td>
    <td rowspan="6">Forth Entiry</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>33</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>34</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>35</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>36</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>37</td>
    <td colspan="2">optionalValue</td>
  </tr>
  <tr>
    <td>38</td>
    <td rowspan="6">Fifth Entiy (US Portrait&nbsp;&nbsp;&nbsp;Version)</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>39</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>40</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>41</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>42</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>43</td>
    <td colspan="2">optionalValue</td>
  </tr>
  <tr>
    <td>44</td>
    <td rowspan="6">Sixth Entiy (US Portrait&nbsp;&nbsp;&nbsp;Version)</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>45</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>46</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>47</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>48</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>49</td>
    <td colspan="2">optionalValue</td>
  </tr>
</tbody>
</table>

### cardGird Page

cardGrid is using the exact same message cardEntities is using; it ignores the information supplied in optionalValue, because it isn't needed for cardGrid

<table>
<thead>
  <tr>
    <th>Parameter&nbsp;&nbsp;&nbsp;Number</th>
    <th>Category</th>
    <th>Location</th>
    <th>Type</th>
    <th>Field</th>
    <th>Addional Information</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>0</td>
    <td>instruction</td>
    <td></td>
    <td>instruction</td>
    <td>entityUpd</td>
    <td></td>
  </tr>
  <tr>
    <td>1</td>
    <td>title</td>
    <td>title</td>
    <td>title</td>
    <td>title</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td rowspan="12">Navigation</td>
    <td rowspan="6">Upper Left Icon</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td>(ignored)¹</td>
  </tr>
  <tr>
    <td>3</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>4</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td>displayName</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>7</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>8</td>
    <td rowspan="6">Upper Right Icon</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td>(ignored)¹</td>
  </tr>
  <tr>
    <td>9</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>10</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>11</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>12</td>
    <td>displayName</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>13</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>14</td>
    <td rowspan="36">Entities</td>
    <td rowspan="6">First Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>15</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>16</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>17</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>18</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>19</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>20</td>
    <td rowspan="6">Second Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>21</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>22</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>23</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>24</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>25</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>26</td>
    <td rowspan="6">Thrid Entity</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>27</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>28</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>29</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>30</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>31</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>32</td>
    <td rowspan="6">Forth Entiry</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>33</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>34</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>35</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>36</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>37</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>38</td>
    <td rowspan="6">Fifth Entiy (US Portrait&nbsp;&nbsp;&nbsp;Version)</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>39</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>40</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>41</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>42</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>43</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
  <tr>
    <td>44</td>
    <td rowspan="6">Sixth Entiy (US Portrait&nbsp;&nbsp;&nbsp;Version)</td>
    <td rowspan="6">Entity Definition</td>
    <td>type</td>
    <td></td>
  </tr>
  <tr>
    <td>45</td>
    <td colspan="2">intNameEntity</td>
  </tr>
  <tr>
    <td>46</td>
    <td>icon</td>
    <td></td>
  </tr>
  <tr>
    <td>47</td>
    <td>iconColor</td>
    <td></td>
  </tr>
  <tr>
    <td>48</td>
    <td>displayName</td>
    <td></td>
  </tr>
  <tr>
    <td>49</td>
    <td>optionalValue</td>
    <td>ignored</td>
  </tr>
</tbody>
</table>

# Custom Protocol

```
55 BB [payload length] [payload length] [payload] [crc] [crc]
```

Payload length contains the number of bytes of the payload.

CRC is "CRC-16 (MODBUS) Big Endian" calculated over the whole message

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.

## Example for valid Message

This message has to be generated for the Message "1337" (1337 is not a valid command~ this is just an example)

```
55 BB  04 00  31 33 33 37  5F 5B
```
