from loguru import logger
from src.analyzers.cell_phone_analyzer import CellPhoneAnalyzer
from src.analyzers.person_analyzer import PersonAnalyzer
from src.config.site import CAMERA, FILIAL
from src.events.event_factory import EventFactory


class RuleEngine:

    def __init__(self):

        self.person = PersonAnalyzer()
        self.phone = CellPhoneAnalyzer()

    def process(self, frame, detections):

        people = [
            d
            for d in detections
            if d["class"] == "person"
        ]

        phones = [
            d
            for d in detections
            if d["class"] == "cell phone"
        ]

        #
        # EVENTOS DE CELULAR
        #

        for phone in phones:

            px1, py1, px2, py2 = phone["bbox"]

            for person in people:

                x1, y1, x2, y2 = person["bbox"]

                #
                # Verifica interseção entre as caixas
                #

                intersects = (
                    px1 < x2
                    and px2 > x1
                    and py1 < y2
                    and py2 > y1
                )

                logger.debug(
                    f"Pessoa={person['bbox']} | "
                    f"Celular={phone['bbox']} | "
                    f"Intersect={intersects}"
                )

                if not intersects:
                    continue

                detection = self.phone.analyze(
                    person,
                    phone,
                    frame,
                )

                if detection:

                    logger.debug(
                        f"📱 Celular detectado para Track {person['id']}"
                    )

                    return EventFactory.create(
                        event_type="cell_phone",
                        filial=FILIAL,
                        camera=CAMERA,
                        detections=[detection],
                        metadata={
                            "rule": "cell_phone",
                        },
                    )

        #
        # Futuras regras (person_enter, person_exit,
        # loitering, intrusion...)
        #

        return None
