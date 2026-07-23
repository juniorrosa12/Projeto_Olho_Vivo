import time


class EventMemory:

    def __init__(self):
        self.memory = {}

    def can_emit(self, track_id, event_type, cooldown=5):

        key = f"{track_id}:{event_type}"

        now = time.time()

        if key not in self.memory:
            self.memory[key] = now
            return True

        if now - self.memory[key] >= cooldown:
            self.memory[key] = now
            return True

        return False
