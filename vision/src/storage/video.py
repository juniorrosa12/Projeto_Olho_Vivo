import cv2
import os
import uuid


class VideoRecorder:

    def __init__(self):

        self.dir = "/app/output/videos"

        os.makedirs(self.dir, exist_ok=True)

    def save(self, frames, fps=25):

        if not frames:
            return ""

        h, w = frames[0].shape[:2]

        filename = f"{uuid.uuid4().hex}.mp4"

        fullpath = os.path.join(self.dir, filename)

        writer = cv2.VideoWriter(

            fullpath,

            cv2.VideoWriter_fourcc(*"mp4v"),

            fps,

            (w, h)

        )

        for frame in frames:
            writer.write(frame)

        writer.release()

        return f"/static/videos/{filename}"
