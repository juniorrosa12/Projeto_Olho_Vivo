from abc import ABC, abstractmethod
import cv2


class VideoSource(ABC):
    """Interface para qualquer origem de vídeo."""

    @abstractmethod
    def open(self):
        pass

    @abstractmethod
    def read(self):
        pass

    @abstractmethod
    def release(self):
        pass


class MP4VideoSource(VideoSource):
    def __init__(self, video_path: str):
        self.video_path = video_path
        self.cap = None

    def open(self):
        self.cap = cv2.VideoCapture(self.video_path)
        return self.cap.isOpened()

    def read(self):
        return self.cap.read()

    def release(self):
        if self.cap:
            self.cap.release()
