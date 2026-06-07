from typing import List, Dict
from pydantic import BaseModel

class WorkProject(BaseModel):
    id: str
    title: str
    status: str
    total_budget: float
    spent_budget: float
    progress_percentage: float
    health_status: str # On track, Over budget, Delayed

class WorksAgent:
    def analyze_project(self, project: Dict) -> WorkProject:
        total = project.get('total_budget', 0)
        spent = project.get('spent_budget', 0)
        
        # Calculate progress based on milestones
        milestones = project.get('milestones', [])
        completed_milestones = [m for m in milestones if m.get('status') == 'completed']
        progress = (len(completed_milestones) / len(milestones) * 100) if milestones else 0
        
        # Determine health
        health = "On track"
        if spent > total:
            health = "Over budget"
        elif project.get('status') == 'halted':
            health = "Stalled"
            
        return WorkProject(
            id=str(project.get('id')),
            title=project.get('title'),
            status=project.get('status'),
            total_budget=total,
            spent_budget=spent,
            progress_percentage=progress,
            health_status=health
        )

    def get_area_summary(self, projects: List[Dict]) -> Dict:
        total_projects = len(projects)
        in_progress = len([p for p in projects if p.get('status') == 'in_progress'])
        total_budget = sum([p.get('total_budget', 0) for p in projects])
        
        return {
            "total_count": total_projects,
            "active_count": in_progress,
            "total_investment": total_budget,
            "completion_rate": (len([p for p in projects if p.get('status') == 'completed']) / total_projects * 100) if total_projects else 0
        }
