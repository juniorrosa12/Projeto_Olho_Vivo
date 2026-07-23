import os
import sys
import time

from loguru import logger

VISION_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(VISION_ROOT, ".."))

for path in (VISION_ROOT, PROJECT_ROOT):
    if path not in sys.path:
        sys.path.insert(0, path)

from src.core.frame_processor import FrameProcessor
from src.config.video import VIDEO_SOURCE

VIDEO_PATH = VIDEO_SOURCE


def main():
    logger.info("=" * 60)
    logger.info("Projeto Olho Vivo")
    logger.info("=" * 60)

    processor = FrameProcessor(VIDEO_PATH)

    while True:
        processor.run()

        logger.info("Reiniciando vídeo...")

        time.sleep(1)


if __name__ == "__main__":
    main()
