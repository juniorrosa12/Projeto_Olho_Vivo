import os
import cv2
import numpy as np

from ultralytics import YOLO
from loguru import logger

from src.config.roi import ROI


MONITORED_CLASSES = {
    "person",
    "cell phone",
    "backpack",
    "handbag",
}


CLASS_NAMES = {
    "person": "Pessoa",
    "cell phone": "Celular",
    "backpack": "Mochila/Sacola",
    "handbag": "Bolsa",
}


COLORS = {
    "person": (0, 255, 0),
    "cell phone": (0, 0, 255),
    "backpack": (255, 170, 0),
    "handbag": (255, 0, 255),
}


class YOLODetector:

    def __init__(self, model_name="yolo11s.pt"):

        if not os.path.exists(model_name):
            logger.error(f'Modelo {model_name} não encontrado')
            raise FileNotFoundError(f'Modelo {model_name} não encontrado')

        logger.info(f"Carregando modelo {model_name}...")

        self.model = YOLO(model_name)

        logger.success("Modelo YOLO carregado.")

    def detect(self, frame):

        results = self.model.track(
            source=frame,
            persist=True,
            tracker="bytetrack.yaml",
            conf=0.20,
            iou=0.50,
            verbose=False,
        )

        detections = []

        if len(results) == 0:
            return frame, detections

        result = results[0]

        for filial in ROI.values():
            for poly in filial.values():

                cv2.polylines(
                    frame,
                    [np.array(poly, dtype=np.int32)],
                    True,
                    (0, 255, 255),
                    2,
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

        logger.debug("========== DETECÇÕES ==========")

        for track_id, cls, conf, box in zip(ids, classes, confs, boxes):

            class_name = result.names[int(cls)]

            logger.debug(
                f"YOLO -> Classe='{class_name}' "
                f"| Track={track_id} "
                f"| Conf={conf:.2f}"
            )

            if class_name not in MONITORED_CLASSES:
                continue

            x1, y1, x2, y2 = map(int, box)

            color = COLORS[class_name]

            display_name = CLASS_NAMES[class_name]

            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                color,
                2,
            )

            label = display_name

            if track_id is not None:
                label += f" #{int(track_id)}"

            cv2.putText(
                frame,
                label,
                (x1, max(25, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2,
            )

            detection = {
                "id": int(track_id) if track_id is not None else -1,
                "class": class_name,
                "display_name": display_name,
                "confidence": float(conf),
                "bbox": [x1, y1, x2, y2],
            }

            detections.append(detection)

            logger.debug(
                f"MONITORADO -> {detection}"
            )

        logger.debug(
            f"Total monitorados: {len(detections)}"
        )

        logger.debug("==============================")

        return frame, detections
