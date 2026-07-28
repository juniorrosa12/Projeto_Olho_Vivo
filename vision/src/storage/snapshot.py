import cv2
import os
import uuid


class SnapshotRecorder:

    def __init__(self):
        self.dir = "/app/output/snapshots"
        os.makedirs(self.dir, exist_ok=True)

    def save(self, frame):
        filename = f"{uuid.uuid4().hex}.jpg"
        cv2.imwrite(os.path.join(self.dir, filename), frame)
        return f"/static/snapshots/{filename}"
