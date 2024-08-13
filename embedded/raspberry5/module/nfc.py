from module.pn532.api import PN532

class NFCReader:
    def __init__(self):
        self.nfc = PN532()

    def process_uid(self, uid):
        """Process UID to trim and format as required."""
        if isinstance(uid, list):
            uid = bytes(uid)  # Convert list to bytes if necessary
        
        # Convert UID bytes to hexadecimal string
        uid_str = ''.join(format(byte, '02X') for byte in uid)
        
        # Trim the UID string as required
        if len(uid_str) > 14:
            uid_str = uid_str[10:-4]
        
        return uid_str

    def read(self):
        """Read NFC UID and process it."""
        uid = self.nfc.read()  # Adjust based on the actual method provided by the library
        if uid:
            return self.process_uid(uid)
        else:
            return None
