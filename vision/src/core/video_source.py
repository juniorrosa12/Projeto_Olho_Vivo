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
    """Fonte de vídeo RTSP com reconexão automática e espera por I-frames H.264."""

    def __init__(self, rtsp_url: str, reconnect_delay: float = 2.0, max_read_retries: int = 25):
        self.rtsp_url = rtsp_url
        self.reconnect_delay = reconnect_delay
        self.max_read_retries = max_read_retries
        self.cap = None

    def open(self):
        import time
        import os
        from loguru import logger
        os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"
        if self.cap:
            try:
                self.cap.release()
            except Exception:
                pass

        logger.info(f"Abrindo canal RTSP via TCP: {self.rtsp_url.split('@')[-1] if '@' in self.rtsp_url else self.rtsp_url}")
        self.cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        for _ in range(10):
            if self.cap.isOpened():
                return True
            time.sleep(0.2)
        return False

    def read(self):
        import time
        from loguru import logger

        if not self.cap or not self.cap.isOpened():
            if not self.open():
                return False, None

        # Tenta ler o frame aguardando o primeiro I-frame (keyframe) do H.264
        for attempt in range(self.max_read_retries):
            ret, frame = self.cap.read()
            if ret and frame is not None and frame.size > 0:
                return True, frame
            time.sleep(0.1)

        # Se falhou após 2.5s aguardando I-frame, tenta reconectar uma vez
        logger.warning(f"RTSP stream sem frames válidos após {self.max_read_retries} tentativas. Reconectando socket RTSP...")
        if self.open():
            for attempt in range(15):
                ret, frame = self.cap.read()
                if ret and frame is not None and frame.size > 0:
                    return True, frame
                time.sleep(0.1)

        return False, None

    def release(self):
        if self.cap:
            try:
                self.cap.release()
            except Exception:
                pass

