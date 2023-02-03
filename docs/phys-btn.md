# Change behaviour of hardware buttons

## Tasmota Rules

You can configure the buttons to mimic an UI element on the screen by configuring tasmota rules.

The following rule will change the behaviour of the two buttons to do page navigation.

```
Rule2 on Button1#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,buttonPress2,navPrev,button"} endon on Button2#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,buttonPress2,navNext,button"} endon

Rule2 1
```

## Decouple buttons from controlling power outputs

If you do not want your NSPanel physical buttons to trigger the relays and prefer to have them as software configurable buttons, open the Tasmota console of your NSPanel and enter the following:
   
`SetOption73 1`
 
Your relays will now appear as switches in HomeAssistant and you can control your buttons by using automations:
   
   ![image](https://user-images.githubusercontent.com/57167030/169677954-5b811d12-dab8-4415-89aa-e4196732765e.png)

You may reverse this change by entering the following in the Tasmota console of your NSPanel:

`SetOption73 0`

Please note: Doing this will mean that if HomeAssistant is not working for any reason your buttons will not function correctly.
