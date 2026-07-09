import cv2

from ultralytics import YOLO
from loguru import logger

from src.config.roi import ROI


class YOLODetector:

    def __init__(self, model_name="yolo11n.pt"):

        logger.info(f"Carregando modelo {model_name}...")

        self.model = YOLO(model_name)

        logger.success("Modelo YOLO carregado.")

    def detect(self, frame):

        results = self.model.track(
            source=frame,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False,
        )

        result = results[0]

        #
        # Desenha ROI
        #

        for _, poly in ROI.items():

            cv2.polylines(
                frame,
                [cv2.UMat(__import__("numpy").array(poly, dtype="int32")).get()],
                True,
                (0, 255, 255),
                2,
            )

        #
        # Bounding boxes
        #

        if result.boxes.id is not None:

            ids = result.boxes.id.cpu().tolist()
            cls = result.boxes.cls.cpu().tolist()
            conf = result.boxes.conf.cpu().tolist()
            boxes = result.boxes.xyxy.cpu().tolist()

            for track_id, c, score, box in zip(
                ids,
                cls,
                conf,
                boxes,
            ):

                x1, y1, x2, y2 = map(int, box)

                name = result.names[int(c)]

                color = (0, 255, 0)

                if name == "cell phone":
                    color = (0, 0, 255)

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    color,
                    2,
                )

                cv2.putText(
                    frame,
                    f"{name} #{int(track_id)}",
                    (x1, y1 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    color,
                    2,
                )

        return results