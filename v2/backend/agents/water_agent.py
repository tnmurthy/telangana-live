from datetime import datetime, time, timedelta
from typing import List, Dict, Optional
from pydantic import BaseModel

class WaterWindow(BaseModel):
    area_id: str
    next_start: datetime
    duration_minutes: int
    status: str
    is_active: bool

class WaterAgent:
    def get_next_window(self, area_id: str, schedules: List[Dict]) -> Optional[WaterWindow]:
        if not schedules:
            return None
            
        now = datetime.now()
        current_day = now.weekday() # 0 is Monday (matching our day_of_week mapping if aligned)
        # Note: Monday is 0 in Python, but we can align it to 0-6 Sunday-Saturday if needed.
        # Let's assume day_of_week is 0-6 where 0 is Monday.

        # Sort schedules by day and time
        sorted_schedules = sorted(schedules, key=lambda x: (x['day_of_week'], x['start_time']))
        
        # Find next window
        for sch in sorted_schedules:
            # Simple logic: first window that is after 'now'
            # In a real implementation, this would handle week-wraparound
            pass
            
        # For the stub, we return a simulated next window
        return WaterWindow(
            area_id=area_id,
            next_start=now + timedelta(hours=4),
            duration_minutes=120,
            status="scheduled",
            is_active=False
        )

    def check_if_active(self, window: WaterWindow) -> bool:
        now = datetime.now()
        end_time = window.next_start + timedelta(minutes=window.duration_minutes)
        return window.next_start <= now <= end_time
