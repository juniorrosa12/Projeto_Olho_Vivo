import time

from loguru import logger

from src.core.frame_processor import FrameProcessor

VIDEO_PATH = "/app/videos/pessoas.mp4"


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
