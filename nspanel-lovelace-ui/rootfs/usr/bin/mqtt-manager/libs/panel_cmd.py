import logging

def custom_send(msg_out_queue, topic, msg):
    msg_out_queue.put((topic, msg))
    logging.debug("Sent Message to NsPanel (%s): %s", topic, msg)


def page_type(msg_out_queue, topic, target_page):
    if target_page == "cardUnlock":
        target_page = "cardAlarm"
    custom_send(msg_out_queue, topic, f"pageType~{target_page}")


def send_time(msg_out_queue, topic, time, addTimeText=""):
    custom_send(msg_out_queue, topic, f"time~{time}~{addTimeText}")


def send_date(msg_out_queue, topic, date):
    custom_send(msg_out_queue, topic, f"date~{date}")


def entityUpd(msg_out_queue, topic, data):
    custom_send(msg_out_queue, topic, f"entityUpd~{data}")

def weatherUpdate(msg_out_queue, topic, data):
    custom_send(msg_out_queue, topic, f"weatherUpdate~{data}")

def timeout(msg_out_queue, topic, timeout):
    custom_send(msg_out_queue, topic, f"timeout~{timeout}")

def dimmode(msg_out_queue, topic, dimValue, dimValueNormal, backgroundColor, fontColor, featExperimentalSliders):
    if dimValue==dimValueNormal:
        dimValue=dimValue-1
    custom_send(msg_out_queue, topic, f"dimmode~{dimValue}~{dimValueNormal}~{backgroundColor}~{fontColor}~{featExperimentalSliders}")

def entityUpdateDetail(msg_out_queue, topic, data):
    custom_send(msg_out_queue, topic, f"entityUpdateDetail~{data}")

def entityUpdateDetail2(msg_out_queue, topic, data):
    custom_send(msg_out_queue, topic, f"entityUpdateDetail2~{data}")

def statusUpdate(msg_out_queue, topic, data):
    custom_send(msg_out_queue, topic, f"statusUpdate~{data}")
