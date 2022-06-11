# Installation - ioBroker
The Backend for ioBroker is maintained by [britzelpuf](https://github.com/britzelpuf) and [armilar](https://github.com/armilar)

https://forum.iobroker.net/topic/50888/sonoff-nspanel/612?_=1654980976439

**Step für Step - Anleitung zur Einrichtung eines Sonoff NSPanel mit Lovelace UI unter ioBroker**

![219c8bad-2af0-42e6-a041-b4ba319ca96d-image.png](/assets/uploads/files/1653910838009-219c8bad-2af0-42e6-a041-b4ba319ca96d-image.png) 
**1. Voraussetzungen für den ioBroker**

Für den Betrieb benötigst du „keinen“ ioBroker-lovelace-Adapter. Die komplette lovelace-Integration erfolgt über die TFT-Firmware und die nachfolgenden ioBroker-Adapter.

* **%(#666)[MQTT-Adapter]**
![3ccd8404-afe3-4182-953c-2172ca1f0a09-image.png](/assets/uploads/files/1653911602309-3ccd8404-afe3-4182-953c-2172ca1f0a09-image.png) 
Die Kommunikation zwischen dem NSPanel und ioBroker erfolgt mittels MQTT über Tasmota. Da der Datenpunkt „CustomSend“ erforderlich ist und dieser nicht im Sonoff-Adapter vorhanden ist und auch nicht durch das Skript angelegt werden kann, erfolgt die Kommunikation „nicht“ über den Sonoff-Adapter --> später mehr …
* **%(#666)[Javascript-Adapter]**
Es werden zwei Type-Skripte (TS = das etwas mächtigere Javascript) benötigt. Zum Einen ein Icon-Skript, da alle verwendeten Icons nicht als „echte Grafiken“ im Panel hinterlegt sind, sondern als Schriftzeichen-Symbole. Des Weiteren ein TS-Skript mit dem eigentlichen Laufzeit-Code, welches für jedes eingesetzte NSPanel vorhanden und konfiguriert sein sollte --> später mehr …
* **%(#666)[Geräte verwalten“-Adapter]**
![bae0913f-fb3f-4856-90d1-eebb70b5a89a-image.png](/assets/uploads/files/1653911536657-bae0913f-fb3f-4856-90d1-eebb70b5a89a-image.png) 
Über diesen Adapter sollten die Aliase später (mit Ausnahme des Media-Alias für Alexa & Co.) erstellt werden --> später mehr … 
* **%(#666)[Accu-Weather-Adapter]**
![1f0dbb8b-a057-4237-a5c7-df7728a255c6-image.png](/assets/uploads/files/1653911665919-1f0dbb8b-a057-4237-a5c7-df7728a255c6-image.png) 
Spielt in erster Linie eine Rolle beim Screensaver-Wetter, da zum Ersten die Icons und die Temperatur-Informationen für den Forecast ausgelesen werden (falls genutzt) und zum Zweiten das aktuelle Wettericon für den Screensaver benötigt wird. Wer keine Wetterstation oder Außentemperatursensor hat, kann auch die Temperatur aus Accu-Weather importieren --> später mehr …
* **%(#666)[Alexa2-Adapter]**
Zur Visualisierung des Media-Player‘s sollte der Alexa2-Adapter installiert sein. Wenn du statt Alexa-Devices andere Hersteller wie z.B. Google-Home-Geräte oder in erster Linie der Spotify-Premium-Adapter im Einsatz hast, so ist es auch möglich mit einem entsprechend, alternativen Media-Adapter den Media-Player zu betreiben --> später mehr …

**2.	Panel mit Tasmota flashen.**
Hierzu eignet sich für den "Hardwareteil" die Anleitung von haus-automatisierung.com 

(**https://www.youtube.com/watch?v=uqPz08ZpFW8**). Video bis 11 Minuten und 30 Sekunden befolgen!

Die Beschreibung, wie man das Panel mit Tasmota flashen kann, ohne einen Kurzschluss zu erzeugen, ist schon sehr gut erklärt.
Du installierst gleich einen „abweichenden“ Berry-Treiber (autoexec.be)  als in der Video-Beschreibung genannt. Wenn du Tasmota und „noch nicht der Berry-Treiber“ installiert hast, bitte mit der Youtube-Video-Anleitung von Matthias ab Zeit=11:30 aufhören. Ich verwende in meinen Panels die Version „tasmota32-DE.bin“. Du kannst aber auch die „tasmota32-nspanel.bin“ verwenden.
Zur MQTT-Konfiguration kommen wir im Punkt 4
An dieser Stelle solltest du aber bereits die grundsätzliche Tasmota Konfiguration vornehmen:

a)	Unter „Sonstige Einstellungen“ trägst du im Feld Vorlage 
```
{"NAME":"NSPanel","GPIO":[0,0,0,0,3872,0,0,0,0,0,32,0,0,0,0,225,0,480,224,1,0,0,0,33,0,0,0,0,0,0,0,0,0,0,4736,0],"FLAG":0,"BASE":1}
``` 
ein, hakst Aktivieren "an" und klickst auf Speichern. Du kannst natürlich auch noch Device und Friendly Name vergeben
![3ca891dc-0892-4ed4-8c44-384899cbb460-image.png](/assets/uploads/files/1653916806795-3ca891dc-0892-4ed4-8c44-384899cbb460-image.png) 
b)	Unter Logging fügst du die IP von deinem ioBroker unter Sys-Log Host () ein und klickst auf Speichern.
c)	Unter Konsolen/Konsole kannst du natürlich auch noch weitere Einstellungen vornehmen (ipaddress1 192.168.X.X für statische IP’s, setOption’s, etc.)
  

**3. Berry-Treiber installieren**
Im Tasmota findest du unter „Konsolen“ den Button „Verwalte Dateisystem“. Wenn du diesen anklickst, siehst du einen weiteren Button „Datei erstellen und bearbeiten“. Du änderst den Dateinamen „neue-datei.txt“ in „autoexec.be“ und fügst den Inhalt aus dem folgenden Link ein:

**https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be**

![bbf8f99d-8f37-4903-9aa8-3b7decab2577-image.png](/assets/uploads/files/1653912758425-bbf8f99d-8f37-4903-9aa8-3b7decab2577-image.png) 
Danach klickst du auf „Speichern“ und dann solltest du Tasmota rebooten.

Wenn das Panel bereits unter einer anderen Variante (z.B. haus-automatisierung.com) installiert war, dann bitte alle Dateien (insbesondere autoexec.be und autoexec.bec) vorher über das Flammensymbol hinter dem Dateinamen löschen. Und von vorne mit dem Punkt 3 beginnen
![e0c99373-2e72-4f18-827d-5050f8d41962-image.png](/assets/uploads/files/1653912663013-e0c99373-2e72-4f18-827d-5050f8d41962-image.png) 

**4. MQTT im Tasmota konfigurieren**

Im Tasmota unter „Einstellungen/MQTT konfigurieren“:
a)	Host deines ioBrokers vergeben
b)	Den Port deiner ioBroker-MQTT-Adapter-Instanz eingeben (für mqtt.0.). Wenn du noch keinen MQTT-Adapter installiert hast, dann verwende bitte nicht unbedingt den Standard-Port 1883. Dieser Port wird auch von anderen Pseudo-MQTT-Adaptern (Sonoff/Shelly/etc.) ebenfalls verwendet und führt im parallelen Betrieb mit anderen MQTT-Devices später unweigerlich zu Komplikationen. Ich verwende für die MQTT-Instanzen gerne einen Port ab 1886 oder 1887 oder 1888 oder höher. Das Problem zeigt sich in der Regel ab dem Zeitpunkt, an dem der „CustomSend“ nicht von deiner mqtt.0.-Instanz abonniert wird.
c)	Benutzer und Passwort aus der ioBroker-MQTT-Instanz eintragen
d)	Bei Client und topic trage ich in der Regel „NSPanel_X“ ein. (X = 1, 2, 3 oder WZ für Wohnzimmer, etc.)
e)	Für den full topic verwende ich in der Regel „SmartHome/%topic%/%prefix%/“.
f)	Speichern klicken und Einstellungen verlassen

![76749e7d-c630-406c-9d2b-a2424521fa96-image.png](/assets/uploads/files/1653909770906-76749e7d-c630-406c-9d2b-a2424521fa96-image.png) 


**5.	TFT-Firmware auf das Panel flashen**
Tasmota „Konsolen/Konsole“ öffnen und in die Kommandozeile 

```
FlashNextion http://nspanel.pky.eu/lovelace-ui/github/nspanel-v2.9.0.tft
```

eingeben, mit Enter bestätigen. Das Panel installiert jetzt die TFT-Firmware (Kann beim ersten Mal ein paar Minuten dauern – Fortschritt beobachten – am Ende erfolgt ein Reboot und das Panel wechselt in einen Screen – „Waiting for Content“ 
![4f4f6005-7cfd-444d-9b9a-14703194781d-image.png](/assets/uploads/files/1653913546138-4f4f6005-7cfd-444d-9b9a-14703194781d-image.png) 

Das Panel wartet jetzt auf den Input von deinem ioBroker-Skript (Installierst du in einem der nächsten Punkte …) 

**6. MQTT im ioBroker installieren und konfigurieren**
Wenn du bereits eine Instanz des MQTT-Adapters (z.B. mqtt.0.) nutzt, dann bitte den Port der MQTT-Adapter-Instanz auch im Tasmota-MQTT verwenden. Bitte auch hier den Hinweis aus Punkt 4b beachten und ggf. einen anderen Port für die Kommunikation eintragen.
Ansonsten wählst du im ioBroker-Menü unter „Adapter“ den mqtt-Adapter aus und erstellst wie gewohnt eine Instanz des Adapters. Du kannst dir natürlich auch eine zusätzliche Instanz (z.B. mqtt.1. oder mqtt.2. etc.) erstellen.

Meine Einstellungen im Reiter Verbindung sind z.B.:
a)	IP = Server/Broker
b)	WebSockets benutzen (angehakt)
c)	IP Adresse des ioBrokers (wahrscheinlich eth0 oder eth1) auswählen
d)	Port 1886 (analog Port aus Tasmota/MQTT)
e)	Benutzer (analog Benutzer aus Tasmota/MQTT)
f)	Kennwort + Kennwort wiederholen (analog Passwort aus Tasmota/MQTT)

![8182d534-bbe0-42a3-89b6-864bc30f9a17-image.png](/assets/uploads/files/1653909648857-8182d534-bbe0-42a3-89b6-864bc30f9a17-image.png) 

Meine Einstellungen im Reiter MQTT-Einstellungen sind:
a)	Maske zum Bekanntgeben eigener States: mqtt.0.* (Bei zusätzlicher Instanz entsprechend höher (mqtt.1.* etc.)
b)	Eigene States beim Verbinden publizieren (angehakt)
c)	States bei subscribe publizieren (angehakt)
d)	Leere Session erzwingen: Client-Einstellungen verwenden

![f184fc26-229d-4a75-84cc-74fda631c527-image.png](/assets/uploads/files/1653909565560-f184fc26-229d-4a75-84cc-74fda631c527-image.png) 

**7. CustomSend anlegen**
Der MQTT Datenpunkt wird benötigt und muss vom MQTT-Adapter angelegt werden. Ein manuelles Anlegen unter „Objekte“ oder „createState“ ist im ioBroker „nicht mehr“ möglich. Um den Datenpunkt zu erzeugen, öffnest du im Tasmota die Konsole und gibst ohne die Anführungszeichen 
```
„CustomSend time~12:00“
``` 
ein. Alternativ kann auch der MQTT-Explorer genutzt werden und ein payload unter .../cmnd abgesendet werden. Danach sollte im MQTT-Adapter unter Objekte ein Datenpunkt: „**SmartHome/NSPanel_X/cmnd/CustomSend**“ erscheinen. Falls nicht, solange wiederholen bis dieser Datenpunkt abonniert wurde, oder ggfs. Nochmals die MQTT-Einstellungen überprüfen. In den Vergangenen Fragen dieses Topics ging es häufiger um diesen Punkt.

**8. Icon „TypeScript“ unter „Skripte“ im Verzeichnis „global“ anlegen**
Wie bereits in der Einleitung erwähnt, werden zwei TypeScripts (TS) benötigt. Das erste ist das Icon-Skript. Das Icon-Skript dient zur Übersetzung von Schriftzeichensymbolen zwischen dem Skript und der TFT-Firmware.
Unter dem grünen Vezeichnisbaum „global“ im ioBroker-Menüpunkt Skripte erzeugst du ein Skript mit dem Namen „IconsSelector“ vom Typ: TypeScript (TS). Dort fügst du den Inhalt der Datei: 

**https://github.com/Armilar/nspanel-lovelace-ui/blob/main/ioBroker/icon_mapping.ts** 

ein und startest das Skript.

Nur zur Info: Du kannst die einzelnen Icon-Symbolnamen (aktuell 6896 unterschiedliche Icon-Symbole) auf 

**https://htmlpreview.github.io/?https://github.com/jobr99/Generate-HASP-Fonts/blob/master/cheatsheet.html** 

einsehen und später (kommen wir bei der Alias-Erstellung noch zu) auch jedes Icon in deinem Panel an entsprechender Stelle verwenden. Für die Einbindung sind die „Namen“ der Icons wichtig.

**9. TypeScript „NSPanelTs.ts“ anlegen**
Unter dem regulären Vezeichnisbaum „common“ im ioBroker-Menüpunkt Skripte erzeugst du (gerne auch in weiteren Unterverzeichnissen) ein weiteres Skript (Aktuell in für die TFT-Version 2.9.0) mit dem Inhalt:

**https://github.com/jobr99/nspanel-lovelace-ui/blob/main/ioBroker/NsPanelTs.ts**

Für jedes einzelne NSPanel das du konfigurieren möchtest, musst du dieses Skript anlegen und speziell für dieses jeweilige NSPanel entsprechende Einstellungen vornehmen. Für den Skriptnamen verwende ich in der Regel eine Kombination aus Panel und Skriptversion, wie z.B.: NSPANEL_1_2.9.0
 
(Es kommen in regelmäßigen Abständen weitere NSPanel-Features und Bug-Fixes in das GitHub-Skript in denen dann nur noch der untere Teil (--- ab hier keine Konfiguration mehr ---) ausgetauscht werden muss und die NSPanel-Parameter erhalten bleiben)

Die aktuelle Änderung von 2.8.0 auf 2.9.0 ist z.B.: 

* Steuerung von Klimageräten/Klimaanlagen
![0735190e-11c3-4bc2-bfd1-5899b8ee0eed-image.png](/assets/uploads/files/1653910414137-0735190e-11c3-4bc2-bfd1-5899b8ee0eed-image.png) 

* QR-Code für z.B. Gäste WLAN
![a43e9656-891a-42ef-90cc-f9ed61850d4b-image.png](/assets/uploads/files/1653910476255-a43e9656-891a-42ef-90cc-f9ed61850d4b-image.png) 

* Neues Design für Thermostate
![abd817a4-db10-45dc-9d5c-9adf6151dac5-image.png](/assets/uploads/files/1653910570137-abd817a4-db10-45dc-9d5c-9adf6151dac5-image.png) 

* etc.

Im oberen Teil des Skripts sind die grundsätzlichen Teile der zu erstellenden Aliase, Konstanten und Variablen (auch Seiten) enthalten. An dieser Stelle ist zunächst wichtig, die Kommunikationsparameter für die MQTT-Kommunikation zu parametrieren (ab ca. Zeile 400) beginnend mit 
```
„export const config: Config = {
```


Hier musst du die beiden nachfolgenden Kommunikations-Datenpunkte aus dem MQTT-Adapter eintragen: 
```
panelRecvTopic: "mqtt.0.SmartHome.NSPanel_1.tele.RESULT",       //bitte anpassen
panelSendTopic: "mqtt.0.SmartHome.NSPanel_1.cmnd.CustomSend",   //bitte anpassen
```

Falls abweichend, dann am besten direkt unter Objekte herauskopieren

Bitte starte das Skript. Alle weiteren Parameter stellen wir später ein. Ab jetzt sollte der Startup-Screen „Waiting for Connection“ in den Sreensaver wechseln und minütlich die Uhrzeit an den Screensaver übertragen und das Datum aktualisiert werden.

**10. TypeScript konfigurieren**
Im Punkt 9 haben wir zunächst die nur Kommunikation zwischen Panel und Skript über MQTT hergestellt. Jetzt kommen wir zum Inhalt des Panels:

**Der untere Bereich vom Screensaver:**
 
**a)	Die 4 kleineren Icons**
Hier kannst du dich entscheiden, ob du die Wettervorhersage oder eigene Werte visualisieren möchtest. Wenn du dich für den Forecast entscheidest, dann muss die Variable 
```
var weatherForecast
``` 
auf „true“ stehen. Ebenfalls sollte die Adapter-Instanz von Accu-Weather funktionsfähig eingerichtet sein. Für diese Werte ist kein Alias notwendig, da diese zur Laufzeit direkt aus dem Adapter ausgelesen werden.
Möchtest du an dieser Stelle eigene Werte visualisieren, dann muss die Variable 
```
var weatherForecast
``` 
auf „false“ stehen. Jetzt kannst du im Block beginnend mit 
```
export const config: Config = {
```        
die Datenpunkte ***firstScreensaverEntity bis fourthScreensaverEntity*** mit eigenen Datenpunkten füllen.
Eine Ausnahme stellt das große Wetter-Icon und der Wert für die aktuelle Temperatur im Screensaver dar. Hierfür benötigen wir einen Alias (im nächsten Punkt)
 
**b)	Diverse Datenpunkte**
Beim ersten Start des Scripts erzeugt das Skript unter 0_userdata diverse Datenpunkte für Screensaver Dimmode, interne Sensoren, Tasmota-Statuswerte, etc. 
Der Pfad kann im Skript unter „NSPanel_Path“ angepasst werden.

**c)	Alexa**
Wenn du Alexa-Devices mit dem Media-Player nutzen möchtest, dann stelle noch das Standard-Alexa-Device (Seriennummer unter „var alexaDevice“) ein.
Ebenso kannst du unter alexaSpeakerList eine Liste mit vorhandenen Alexa-Devices (und/oder Gruppen) anlegen, die von diesem NSPanel-MediaPlayer aus bedient werden sollen. Bleibt diese Liste leer, werden automatisch alle Devices aus dem Alexa2-Adapter importiert.

**11. Aliase Anlegen**
Jetzt kommt der eigentliche Teil der Seitengestaltung. Es werden keine Datenpunkte benötigt, sondern Aliase.
Ein Alias ist „kein“ Datenpunkt, sondern ein Objekt mit mehreren Datenpunkten.
Das Skript setzt entsprechende Trigger auf die Alias-Datenpunkte .SET, .GET, .ACTUAL usw. Deshalb werden deine Steuerelemente im Panel nicht greifen, wenn du mit einzelnen Datenpunkten aus den verschiedenen Adaptern arbeitest.
Ich habe im Verlauf diverse Aliase erzeugt und auch in den ChangeLogs der jeweiligen Skript-Version sind die möglichen Aliase aufgeführt, daher gehe ich hier nicht (würde die Anleitung auch sprengen) im Detail auf die Aliase ein.
Was brauche ich für einen Alias:
a)	Zunächst installierst du dir eine Instanz des Adapters „Geräte verwalten“
b)	Dann erstellst du dir einen Alias (Beispiel Wetter-Icon und aktueller Wert der Außentemperatur) Dieser Alias muss nur einmalig angelegt werden und funktioniert somit auch in jedem weiteren Panel.
![56982014-6811-49cc-9be3-bed78436ef57-image.png](/assets/uploads/files/1653912015692-56982014-6811-49cc-9be3-bed78436ef57-image.png) 
und etwas tiefer:
![a9814dc5-887b-4f8b-bb5b-742e104897b3-image.png](/assets/uploads/files/1653912072019-a9814dc5-887b-4f8b-bb5b-742e104897b3-image.png) 
c)	Wenn du einen Alias für den Media-Player benötigst, dann erstelle die diesen Alias besser über den Adapter „Alias-Manager“, 
![07fe0047-d38f-45c9-92f9-3811c80be0e8-image.png](/assets/uploads/files/1653912124055-07fe0047-d38f-45c9-92f9-3811c80be0e8-image.png) 
da der Adapter „Geräte verwalten“ bei diesem Alias nicht ordentlich arbeitet. Jedoch ist der auch so Komplex, das es für Alias-Anfänger schwer ist, einen Alias mit den korrekten Datenpunkten zu füllen.

**12. Seitengestaltung** 

Am Besten benutzt ihr die Beispiele im Skript und legt entsprechende Aliase hierzu an, die auch in diesem ioBroker-Community-Topic innerhalb der letzten Wochen beschrieben wurden.

Und noch ein paar Bilderchen:

cardEntities mit Alias Lampe/Dimmer/Switch
![d8fcfee4-3137-4bae-85ba-6b70106c77c1-image.png](/assets/uploads/files/1653912863870-d8fcfee4-3137-4bae-85ba-6b70106c77c1-image.png) 

cardEntities mit RGB und HUE Aliasen (Color)
![7f1f6db2-1d67-4b59-86c6-c06d4e8f4c2a-image.png](/assets/uploads/files/1653912902052-7f1f6db2-1d67-4b59-86c6-c06d4e8f4c2a-image.png) 

popupLight mit Farbtemperatur und Brightness
![da3057b5-db2c-4b61-8716-8b2114e09aee-image.png](/assets/uploads/files/1653912933681-da3057b5-db2c-4b61-8716-8b2114e09aee-image.png) 

popupLight mit ColorWheel
![1ba6c1ff-d682-4368-b36a-4952aed4bcbe-image.png](/assets/uploads/files/1653912960049-1ba6c1ff-d682-4368-b36a-4952aed4bcbe-image.png) 

cardGrid mit Radiosendern/Playlists (Alias Taste)
![6b8c8b7a-331e-4fc1-867b-4ce69705fd0a-image.png](/assets/uploads/files/1653929221491-6b8c8b7a-331e-4fc1-867b-4ce69705fd0a-image.png) 

cardEntities mit Aliasen Lautstärke und Info
![9c36cfd7-b586-41db-8b4a-d68734dbbaae-image.png](/assets/uploads/files/1653912981365-9c36cfd7-b586-41db-8b4a-d68734dbbaae-image.png) 

cardEntities mit Fenster, Tür, Jalousie und Verschluss
![d874876a-a190-4fab-b2a2-5a0f0bb0f62a-image.png](/assets/uploads/files/1653913018089-d874876a-a190-4fab-b2a2-5a0f0bb0f62a-image.png) 

cardEntities mit Abfallkalender
![098059be-4996-403b-a7a7-653915f10204-image.png](/assets/uploads/files/1653936380574-098059be-4996-403b-a7a7-653915f10204-image.png) 

cardMedia
![9e702c46-e5d1-452b-a60b-e5068cb64750-image.png](/assets/uploads/files/1653913181184-9e702c46-e5d1-452b-a60b-e5068cb64750-image.png) 

cardAlarm
![8f8e9ecc-a4b2-48f1-b9b1-4fe68b4b2574-image.png](/assets/uploads/files/1653913221457-8f8e9ecc-a4b2-48f1-b9b1-4fe68b4b2574-image.png) 

cardGrid
![8a0ce26c-c49c-4bc3-b2ca-bc4897febd09-image.png](/assets/uploads/files/1653929268828-8a0ce26c-c49c-4bc3-b2ca-bc4897febd09-image.png) 

cardEntities
![7b7c21e6-02aa-4a3e-bb25-c8127689d801-image.png](/assets/uploads/files/1653913242372-7b7c21e6-02aa-4a3e-bb25-c8127689d801-image.png) 

cardEntities als Subpage unter cardEntities (verschachtelt)
![bd7783f7-9365-4333-b5bc-872ca92fd4b7-image.png](/assets/uploads/files/1653913274663-bd7783f7-9365-4333-b5bc-872ca92fd4b7-image.png)

cardNotify
![2dca9c22-df47-4c29-8e16-bc0323101cb1-image.png](/assets/uploads/files/1653914178326-2dca9c22-df47-4c29-8e16-bc0323101cb1-image.png)