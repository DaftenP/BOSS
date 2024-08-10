import queue

class EventLoop:
    def __init__(self, nfc_handler, servo_handler):
        self.event_queue = nfc_handler.event_queue  # 수정된 부분
        self.nfc_handler = nfc_handler
        self.servo_handler = servo_handler
        self.handlers = {
            "process_nfc": self.nfc_handler.process,
            "process_servo": self.servo_handler.process
        }

    def start(self):
        self.event_queue.put("process_nfc")
        self.run()

    def run(self):
        while True:
            try:
                event = self.event_queue.get()
                handler = self.handlers.get(event)
                if handler:
                    handler()
                else:
                    print(f"Unknown event: {event}")
            except Exception as e:
                print(f"Error in event loop: {e}")
                break

    def cleanup(self):
        self.servo_handler.cleanup()
