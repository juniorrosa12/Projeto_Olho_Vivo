from types import SimpleNamespace

import numpy as np
from loguru import logger
from ultralytics.trackers.byte_tracker import BYTETracker


class ByteTracker:

    def __init__(self):
        logger.info("Inicializando ByteTrack...")

        args = SimpleNamespace(
            track_thresh=0.5,
            match_thresh=0.8,
            track_buffer=30,
            mot20=False,
            frame_rate=30,
        )

        self.tracker = BYTETracker(args)

        logger.success("ByteTrack inicializado.")

    def update(self, result):
        """
        Recebe o resultado do YOLO e retorna os tracks ativos.
        """

        if result.boxes is None or len(result.boxes) == 0:
            return []

        detections = []

        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            score = float(box.conf[0])

            detections.append([x1, y1, x2, y2, score])

        detections = np.asarray(detections, dtype=np.float32)

        img_info = (result.orig_shape[0], result.orig_shape[1])
        img_size = img_info

        tracks = self.tracker.update(
            detections,
            img_info,
            img_size
        )

        return tracks
