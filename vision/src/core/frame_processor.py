import time
from collections import defaultdict, deque

import cv2
from loguru import logger

from src.api.backend_client import BackendClient
from src.core.video_source import MP4VideoSource
from src.detectors.yolo_detector import YOLODetector
from src.rules.rule_engine import RuleEngine
from src.services.track_service import TrackService
from src.storage.snapshot import SnapshotRecorder
from src.storage.video import VideoRecorder


class FrameProcessor:

    def __init__(self, video_path):

        self.video_path = video_path

        self.detector = YOLODetector()

        self.rule_engine = RuleEngine()

        self.snapshot = SnapshotRecorder()

        self.backend = BackendClient()

        self.track_service = TrackService()

        self.video = VideoRecorder()

        self.buffer = deque(maxlen=250)

        self.tracks = defaultdict(list)

        self.last_time = time.time()

        self.last_video = 0

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

            fps = 1 / max(now - self.last_time, 0.0001)

            self.last_time = now

            frame, detections = self.detector.detect(frame)

            #
            # TRACKS
            #

            for detection in detections:

                if detection["id"] < 0:
                    continue

                self.track_service.upsert(detection)

                x1, y1, x2, y2 = detection["bbox"]

                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                self.tracks[detection["id"]].append((cx, cy))

                if len(self.tracks[detection["id"]]) > 30:
                    self.tracks[detection["id"]].pop(0)

                pts = self.tracks[detection["id"]]

                for i in range(1, len(pts)):
                    cv2.line(
                        frame,
                        pts[i - 1],
                        pts[i],
                        (255, 0, 255),
                        2,
                    )

            #
            # RULE ENGINE
            #

            event = self.rule_engine.process(
                frame,
                detections,
            )

            #
            # ENVIA SOMENTE EVENTOS REAIS
            #

            if event is not None:

                logger.success(
                    f"Evento detectado: {event.event_type}"
                )

                #
                # Snapshot
                #

                snapshot = self.snapshot.save(frame)

                event.snapshot = snapshot

                logger.success(
                    f"Snapshot salvo: {snapshot}"
                )

                #
                # Vídeo
                #

                if time.time() - self.last_video > 10:

                    video = self.video.save(
                        list(self.buffer)
                    )

                    event.video = video

                    logger.success(
                        f"Vídeo salvo: {video}"
                    )

                    self.last_video = time.time()

                self.backend.send(event)

            people = len(
                [
                    d
                    for d in detections
                    if d["class"] == "person"
                ]
            )

            cv2.putText(
                frame,
                "FILIAL_027 | CAM01",
                (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 255),
                2,
            )

            cv2.putText(
                frame,
                f"Pessoas: {people}",
                (20, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2,
            )

            cv2.putText(
                frame,
                f"FPS: {fps:.1f}",
                (20, 105),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 0),
                2,
            )

            cv2.putText(
                frame,
                time.strftime("%d/%m/%Y %H:%M:%S"),
                (20, 140),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            cv2.imwrite(
                "/app/output/latest.jpg",
                frame,
            )

            if frame_count % 30 == 0:

                logger.info(
                    f"Frame {frame_count} | Objetos: {len(detections)}"
                )

        source.release()

        logger.success(
            f"Fim do vídeo. Frames: {frame_count}"
        )
