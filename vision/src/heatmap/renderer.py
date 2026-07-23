import cv2
import numpy as np
from pathlib import Path


class HeatmapRenderer:

    def __init__(self):

        self.output = Path("/app/output/heatmap")
        self.output.mkdir(parents=True, exist_ok=True)

    def render(self, heat):

        if heat.max() == 0:

            img = np.zeros(
                (heat.shape[0], heat.shape[1], 3),
                dtype=np.uint8,
            )

        else:

            norm = cv2.normalize(
                heat,
                None,
                0,
                255,
                cv2.NORM_MINMAX,
            ).astype(np.uint8)

            norm = cv2.GaussianBlur(
                norm,
                (101, 101),
                0,
            )

            img = cv2.applyColorMap(
                norm,
                cv2.COLORMAP_TURBO,
            )

            img[norm == 0] = (0, 0, 0)

        path = self.output / "latest.png"

        cv2.imwrite(
            str(path),
            img,
        )

        return "/static/output/heatmap/latest.png"
