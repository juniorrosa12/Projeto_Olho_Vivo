import cv2
import numpy as np


def draw_detections(frame, detections):

    for det in detections:

        x1, y1, x2, y2 = det["bbox"]

        color = (0, 255, 0)

        if det["class"] == "cell phone":
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
            f'{det["class"]} #{det["id"]}',
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2,
        )

    return frame


def draw_roi(frame, roi):

    pts = np.array(roi, np.int32)

    cv2.polylines(
        frame,
        [pts],
        True,
        (0, 255, 255),
        2,
    )

    return frame