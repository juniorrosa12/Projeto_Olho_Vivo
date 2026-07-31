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


class RTSPVideoSource(VideoSource):
    """Fonte de vídeo RTSP com reconexão automática para DVRs ao vivo."""

    def __init__(self, rtsp_url: str, reconnect_delay: float = 3.0):
        self.rtsp_url = rtsp_url
        self.reconnect_delay = reconnect_delay
        self.cap = None

    def open(self):
        import time
        import os
        # Força transporte TCP no FFmpeg/OpenCV (obrigatorio para conexoes VPN/NetBird)
        os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"
        self.cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        if not self.cap.isOpened():
            time.sleep(self.reconnect_delay)
            self.cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
        return self.cap.isOpened()

    def read(self):
        ret, frame = self.cap.read()
        if not ret:
            # Tenta reconectar automaticamente via TCP
            import time
            import os
            os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"
            self.cap.release()
            time.sleep(self.reconnect_delay)
            self.cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            ret, frame = self.cap.read()
        return ret, frame

    def release(self):
        if self.cap:
            self.cap.release()
