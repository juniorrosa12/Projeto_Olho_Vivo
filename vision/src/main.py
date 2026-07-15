import time

from loguru import logger

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
