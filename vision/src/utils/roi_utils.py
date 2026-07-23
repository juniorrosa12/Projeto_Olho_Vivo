import cv2
import numpy as np


def bbox_center(bbox):
    x1, y1, x2, y2 = bbox

    return (
        int((x1 + x2) / 2),
        int((y1 + y2) / 2),
    )


def point_inside_roi(point, roi):

    polygon = np.array(roi, dtype=np.int32)

    return (
        cv2.pointPolygonTest(
            polygon,
            point,
            False,
        )
        >= 0
    )


def bbox_inside_roi(bbox, roi):

    return point_inside_roi(
        bbox_center(bbox),
        roi,
    )
