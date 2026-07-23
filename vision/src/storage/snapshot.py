from pathlib import Path
from datetime import datetime

import cv2


class Snapshot:

    def __init__(self):

        self.output = Path("/app/output/snapshots")
        self.output.mkdir(parents=True, exist_ok=True)

    def save(self, frame):

        name = datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".jpg"

        path = self.output / name

        cv2.imwrite(str(path), frame)

        return f"/static/snapshots/{name}"
