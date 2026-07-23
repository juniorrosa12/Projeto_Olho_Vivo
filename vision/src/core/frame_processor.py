import time
from collections import defaultdict, deque

import cv2
import numpy as np

from loguru import logger

from src.core.video_source import MP4VideoSource
from src.detectors.yolo_detector import YOLODetector
from src.rules.rule_engine import RuleEngine
from src.storage.video import VideoRecorder


class FrameProcessor:

    def __init__(self, video_path):

        self.video_path = video_path

        self.detector = YOLODetector()

        self.rule_engine = RuleEngine()

        self.video = VideoRecorder()

        self.buffer = deque(maxlen=250)

        self.tracks = defaultdict(list)

        self.last_time = time.time()

        self.last_video = 0

        self.roi = [

            (220,120),

            (1700,120),

            (1700,980),

            (220,980)

        ]


    def run(self):

        source = MP4VideoSource(self.video_path)

        if not source.open():

            logger.error(f"Não foi possível abrir {self.video_path}")

            return

        frame_count = 0

        while True:

            ret, frame = source.read()

            if not ret:

                break

            frame_count += 1

            self.buffer.append(frame.copy())

            now = time.time()

            fps = 1 / max(now-self.last_time,0.0001)

            self.last_time = now

            frame,detections = self.detector.detect(frame)

            for detection in detections:

                if detection["id"] < 0:

                    continue

                x1,y1,x2,y2 = detection["bbox"]

                cx=(x1+x2)//2

                cy=(y1+y2)//2

                self.tracks[detection["id"]].append((cx,cy))

                if len(self.tracks[detection["id"]])>30:

                    self.tracks[detection["id"]].pop(0)

                pts=self.tracks[detection["id"]]

                for i in range(1,len(pts)):

                    cv2.line(

                        frame,

                        pts[i-1],

                        pts[i],

                        (255,0,255),

                        2

                    )

            self.rule_engine.process(frame,detections)

            #
            # grava um vídeo somente quando houver detecção
            #

            if detections:

                if time.time()-self.last_video>10:

                    video=self.video.save(list(self.buffer))

                    logger.success(f"Vídeo salvo: {video}")

                    self.last_video=time.time()

            people=len(

                [

                    d

                    for d in detections

                    if d["class"]=="person"

                ]

            )

            cv2.putText(

                frame,

                "FILIAL_027 | CAM01",

                (20,35),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.8,

                (0,255,255),

                2

            )

            cv2.putText(

                frame,

                f"Pessoas: {people}",

                (20,70),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.7,

                (0,255,0),

                2

            )

            cv2.putText(

                frame,

                f"FPS: {fps:.1f}",

                (20,105),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.7,

                (255,255,0),

                2

            )

            cv2.putText(

                frame,

                time.strftime("%d/%m/%Y %H:%M:%S"),

                (20,140),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.7,

                (255,255,255),

                2

            )

            cv2.imwrite(

                "/app/output/latest.jpg",

                frame

            )

            if frame_count%30==0:

                logger.info(

                    f"Frame {frame_count} | Objetos: {len(detections)}"

                )

        source.release()

        logger.success(

            f"Fim do vídeo. Frames: {frame_count}"

        )
