import cv2
import numpy as np


class HeatmapAccumulator:

    def __init__(self, width=1920, height=1080):

        self.width = width
        self.height = height

        self.map = np.zeros(
            (height, width),
            dtype=np.float32,
        )

        self.kernel = self._create_kernel(
            radius=40,
            sigma=15,
        )

    def _create_kernel(self, radius, sigma):

        size = radius * 2 + 1

        kernel_1d = cv2.getGaussianKernel(
            size,
            sigma,
        )

        kernel = kernel_1d @ kernel_1d.T

        kernel /= kernel.max()

        return kernel * 10

    def add(self, x, y):

        radius = self.kernel.shape[0] // 2

        x1 = max(0, x - radius)
        y1 = max(0, y - radius)

        x2 = min(self.width, x + radius + 1)
        y2 = min(self.height, y + radius + 1)

        kx1 = radius - (x - x1)
        ky1 = radius - (y - y1)

        kx2 = kx1 + (x2 - x1)
        ky2 = ky1 + (y2 - y1)

        self.map[y1:y2, x1:x2] += self.kernel[
            ky1:ky2,
            kx1:kx2,
        ]

        np.clip(
            self.map,
            0,
            255,
            out=self.map,
        )

    def clear(self):

        self.map.fill(0)

    def get(self):

        return self.map
