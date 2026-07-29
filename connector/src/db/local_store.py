import sqlite3
import json
import os
from datetime import datetime

DB_FILE = "connector_local.db"


class LocalStore:

    def __init__(self):
        self._init_db()

    def _get_connection(self):
        return sqlite3.connect(DB_FILE)

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Fila de Eventos Offline
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS offline_event_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'PENDING'
                )
            """)
            
            # Fila de Telemetrias Offline
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS offline_telemetry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    payload TEXT NOT NULL,
                    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Cache de Dispositivos Descobertos
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS discovered_devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_type TEXT NOT NULL,
                    ip TEXT NOT NULL,
                    data TEXT NOT NULL,
                    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()

    def enqueue_event(self, event_type: str, payload: dict):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO offline_event_queue (event_type, payload) VALUES (?, ?)",
                (event_type, json.dumps(payload))
            )
            conn.commit()

    def get_pending_events(self, limit: int = 50):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, event_type, payload FROM offline_event_queue WHERE status = 'PENDING' ORDER BY id ASC LIMIT ?",
                (limit,)
            )
            rows = cursor.fetchall()
            return [{"id": r[0], "event_type": r[1], "payload": json.loads(r[2])} for r in rows]

    def mark_event_delivered(self, event_id: int):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM offline_event_queue WHERE id = ?", (event_id,))
            conn.commit()

    def save_discovered_device(self, device_type: str, ip: str, data: dict):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO discovered_devices (device_type, ip, data) VALUES (?, ?, ?)",
                (device_type, ip, json.dumps(data))
            )
            conn.commit()

    def get_all_discovered_devices(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, device_type, ip, data, discovered_at FROM discovered_devices")
            rows = cursor.fetchall()
            return [
                {
                    "id": r[0],
                    "device_type": r[1],
                    "ip": r[2],
                    "data": json.loads(r[3]),
                    "discovered_at": r[4],
                }
                for r in rows
            ]


local_store = LocalStore()
