import cv2

from loguru import logger

from src.core.video_source import MP4VideoSource
from src.detectors.yolo_detector import YOLODetector
from src.rules.rule_engine import RuleEngine


class FrameProcessor:

    def __init__(self, video_path):

        self.video_path = video_path

        self.detector = YOLODetector()

        self.rule_engine = RuleEngine()

    def run(self):

        source = MP4VideoSource(self.video_path)

        if not source.open():

            logger.error(
                f"Não foi possível abrir {self.video_path}"
            )

            return

        frame_count = 0

        while True:

            ret, frame = source.read()

            if not ret:
                break

            frame_count += 1

            results = self.detector.detect(frame)

            result = results[0]

            detections = []

            if result.boxes.id is not None:

                ids = result.boxes.id.cpu().tolist()
                classes = result.boxes.cls.cpu().tolist()
                confs = result.boxes.conf.cpu().tolist()
                boxes = result.boxes.xyxy.cpu().tolist()
                names = result.names

                for track_id, cls, conf, box in zip(
                    ids,
                    classes,
                    confs,
                    boxes,
                ):

                    detections.append(
                        {
                            "id": int(track_id),
                            "class": names[int(cls)],
                            "confidence": float(conf),
                            "bbox": [
                                int(box[0]),
                                int(box[1]),
                                int(box[2]),
                                int(box[3]),
                            ],
                        }
                    )

            self.rule_engine.process(detections)

            #
            # Salva o último frame processado
            #

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