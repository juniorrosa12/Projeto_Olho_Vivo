import cv2
import os
import uuid

class VideoRecorder:

    def __init__(self):

        self.dir="/app/output/videos"

        os.makedirs(self.dir,exist_ok=True)

    def save(self,frames,fps=25):

        if len(frames)==0:
            return ""

        h,w=frames[0].shape[:2]

        name=f"{uuid.uuid4().hex}.mp4"

        path=os.path.join(self.dir,name)

        writer=cv2.VideoWriter(

            path,

            cv2.VideoWriter_fourcc(*"mp4v"),

            fps,

            (w,h)

        )

        for frame in frames:
            writer.write(frame)

        writer.release()

        return path
