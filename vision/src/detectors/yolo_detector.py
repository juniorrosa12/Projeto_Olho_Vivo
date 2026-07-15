import cv2
import numpy as np

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
            conf=0.25,
            iou=0.45,
            verbose=False,
        )

        detections = []

        if len(results) == 0:
            return frame, detections

        result = results[0]

        #
        # ROI
        #

        for filial in ROI.values():
            for poly in filial.values():

                cv2.polylines(
                    frame,
                    [np.array(poly, dtype=np.int32)],
                    True,
                    (0,255,255),
                    2
                )

        if result.boxes is None:

            return frame, detections

        ids = (
            result.boxes.id.cpu().tolist()
            if result.boxes.id is not None
            else [None] * len(result.boxes)
        )

        classes = result.boxes.cls.cpu().tolist()
        confs = result.boxes.conf.cpu().tolist()
        boxes = result.boxes.xyxy.cpu().tolist()

        for track_id, cls, conf, box in zip(
            ids,
            classes,
            confs,
            boxes
        ):

            x1,y1,x2,y2 = map(int,box)

            class_name = result.names[int(cls)]

            color=(0,255,0)

            if class_name=="cell phone":
                color=(0,0,255)

            cv2.rectangle(
                frame,
                (x1,y1),
                (x2,y2),
                color,
                2
            )

            label = class_name

            if track_id is not None:
                label += f" #{int(track_id)}"

            cv2.putText(
                frame,
                label,
                (x1,max(25,y1-8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

            detections.append({

                "id": int(track_id) if track_id is not None else -1,

                "class": class_name,

                "confidence": float(conf),

                "bbox":[x1,y1,x2,y2]

            })

        logger.info(f"Detecções: {len(detections)}")

        return frame, detections

