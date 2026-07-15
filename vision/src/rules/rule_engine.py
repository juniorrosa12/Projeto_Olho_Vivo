from src.analyzers.person_analyzer import PersonAnalyzer
from src.analyzers.cell_phone_analyzer import CellPhoneAnalyzer
from src.dispatcher.event_dispatcher import EventDispatcher


class RuleEngine:

    def __init__(self):

        self.person = PersonAnalyzer()
        self.phone = CellPhoneAnalyzer()
        self.dispatcher = EventDispatcher()

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

        events = self.person.analyze(people)

        for event in events:
            self.dispatcher.dispatch(event)

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

                    event = self.phone.analyze(person, phone)

                    if event:
                        self.dispatcher.dispatch(event)
