import cv2


def draw_roi(frame, points):

    cv2.polylines(
        frame,
        [points],
        True,
        (0, 255, 255),
        2,
    )

    return frame