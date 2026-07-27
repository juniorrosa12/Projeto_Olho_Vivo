 
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

        objects = []

        objects.extend(
            self.person.analyze(
                people,
                frame,
            )
        )

        for phone in phones:

            px1, py1, px2, py2 = phone["bbox"]

            for person in people:

                x1, y1, x2, y2 = person["bbox"]

                if (
                    px1 >= x1
                    and py1 >= y1
                    and px2 <= x2
                    and py2 <= y2
                ):

                    detection = self.phone.analyze(
                        person,
                        phone,
                        frame,
                    )

                    if detection:
                        objects.append(detection)

        return EventFactory.create(
            event_type="frame_analysis",
            filial=FILIAL,
            camera=CAMERA,
            detections=objects,
            metadata={
                "total_detections": len(objects),
            },
        )