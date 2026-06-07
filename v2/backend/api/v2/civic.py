from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional, Dict
from agents.rag_agent import RAGAgent
from agents.schemes_agent import SchemesAgent, SchemeEligibility
from agents.alerts_agent import AlertsAgent, AreaAlert
from agents.transport_agent import TransportAgent, TransitArrival
from agents.jobs_agent import JobsAgent, JobPosting
from agents.news_agent import NewsAgent, ClassifiedNews
from agents.emergency_agent import EmergencyAgent, Contact
from agents.power_agent import PowerAgent, PowerAlert
from agents.water_agent import WaterAgent, WaterWindow
from agents.grievance_agent import GrievanceAgent, ClassificationResult
from agents.works_agent import WorksAgent, WorkProject
from agents.officials_agent import OfficialsAgent, Official
from agents.environment_agent import EnvironmentAgent, MobilityAgent, EnvironmentalMetric, TrafficSnapshot
from agents.civic_pride_agent import ODOPAgent, BudgetAgent, ODOPItem, BudgetItem
from agents.panchang_agent import PanchangAgent, PanchangSnapshot
from agents.healthcare_agent import HealthcareAgent, HealthFacility
from agents.mee_seva_agent import MeeSevaAgent, MeeSevaCenter
from agents.parity_agent import FeatureParityAgent, ParkInfo, RationShop, AgriAdvisory
from pydantic import BaseModel

router = APIRouter()

# Request/Response Models
class QueryRequest(BaseModel):
    query: str
    area_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]

class GrievanceRequest(BaseModel):
    title: str
    description: str
    area_id: str

class PushSubscriptionRequest(BaseModel):
    area_id: str
    subscription: dict

@router.get("/pulse/parity/parks", response_model=List[ParkInfo])
async def get_parks(area_id: str):
    agent = FeatureParityAgent()
    return agent.get_nearby_parks(area_id)

@router.get("/pulse/parity/pds", response_model=List[RationShop])
async def get_pds(area_id: str):
    agent = FeatureParityAgent()
    return agent.get_nearby_ration_shops(area_id)

@router.get("/pulse/parity/agri", response_model=List[AgriAdvisory])
async def get_agri():
    agent = FeatureParityAgent()
    return agent.get_crop_advisories()

@router.get("/pulse/parity/shloka")
async def get_shloka():
    agent = FeatureParityAgent()
    return agent.get_daily_shloka()

@router.post("/push/subscribe")
async def save_push_subscription(request: PushSubscriptionRequest):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    payload = {"area_id": request.area_id, "subscription_json": request.subscription}
    res = sb.table("push_subscriptions").insert(payload).execute()
    return {"status": "success", "id": res.data[0]["id"]}

@router.get("/alerts/hyperlocal", response_model=List[AreaAlert])
async def get_hyperlocal_alerts(area_id: str = None):
    agent = AlertsAgent()
    return agent.get_active_alerts(area_id)

@router.get("/transport/arrivals", response_model=List[TransitArrival])
async def get_transit_arrivals(area_id: str, type: str = 'metro'):
    agent = TransportAgent()
    return agent.get_live_arrivals(area_id, type)

@router.get("/jobs/matched", response_model=List[JobPosting])
async def get_matched_jobs(area_id: str, prefs: dict = {}):
    agent = JobsAgent()
    return agent.get_matched_jobs(area_id, prefs)

@router.get("/news/feed", response_model=List[dict])
async def get_news_feed(area_id: Optional[str] = None, category: Optional[str] = None, min_score: int = 0):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    query = sb.table("news").select("*").gte("ai_relevance_score", min_score).order("published_at", desc=True).limit(20)
    if area_id and area_id != 'all':
        query = query.eq("area_id", area_id)
    if category and category != 'all':
        query = query.eq("category", category)
    res = query.execute()
    return res.data

@router.get("/pulse/environment", response_model=EnvironmentalMetric)
async def get_environment_stats(area_id: str):
    agent = EnvironmentAgent()
    return agent.get_latest_stats(area_id)

@router.get("/pulse/traffic", response_model=TrafficSnapshot)
async def get_traffic_status(area_id: str):
    agent = MobilityAgent()
    return agent.get_traffic_status(area_id)

@router.get("/pulse/odop", response_model=Optional[ODOPItem])
async def get_district_odop(area_id: str):
    agent = ODOPAgent()
    return agent.get_district_product(area_id)

@router.get("/pulse/panchang", response_model=PanchangSnapshot)
async def get_daily_panchang():
    agent = PanchangAgent()
    return agent.get_daily_panchang()

@router.get("/pulse/healthcare", response_model=List[HealthFacility])
async def get_nearby_healthcare(area_id: str):
    agent = HealthcareAgent()
    return agent.get_nearby_facilities(area_id)

@router.get("/pulse/mee-seva", response_model=List[MeeSevaCenter])
async def get_nearby_mee_seva(area_id: str):
    agent = MeeSevaAgent()
    return agent.get_nearby_centers(area_id)

@router.get("/pulse/budget", response_model=List[BudgetItem])
async def get_budget_explainer(area_id: Optional[str] = None):
    agent = BudgetAgent()
    return agent.get_budget_breakdown(area_id)

@router.get("/pulse/rates/market", response_model=List[dict])
async def get_market_rates(market: Optional[str] = None):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    query = sb.table("mandi_prices").select("*").order("date", desc=True).limit(20)
    if market:
        query = query.eq("market", market)
    res = query.execute()
    return res.data

@router.get("/pulse/rates/daily")
async def get_daily_rates(city: str = "Hyderabad"):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    gold = sb.table("gold_rates").select("*").eq("city", city).order("date", desc=True).limit(1).execute()
    fuel = sb.table("fuel_prices").select("*").eq("city", city).order("date", desc=True).limit(1).execute()
    return {
        "gold": gold.data[0] if gold.data else None,
        "fuel": fuel.data[0] if fuel.data else None
    }

@router.get("/sos/contacts", response_model=List[Contact])
async def get_emergency_contacts(area_id: str, category: str = None):
    agent = EmergencyAgent()
    return agent.get_contacts(area_id, category)

@router.get("/power/alerts", response_model=List[PowerAlert])
async def get_power_alerts(area_id: str):
    agent = PowerAgent()
    return agent.get_active_alerts(area_id)

@router.get("/water/next", response_model=Optional[WaterWindow])
async def get_next_water(area_id: str):
    agent = WaterAgent()
    return agent.get_next_window(area_id, [])

@router.post("/report/submit")
async def submit_grievance(request: GrievanceRequest):
    from supabase import create_client
    from core.config import settings
    agent = GrievanceAgent()
    classification = agent.classify_report(request.title, request.description)
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    payload = {
        "area_id": request.area_id, "title": request.title, "description": request.description,
        "category": classification.category, "sentiment": classification.sentiment,
        "priority": classification.priority, "department": classification.department,
        "ai_metadata": {"reasoning": classification.reasoning}
    }
    res = sb.table("citizen_reports").insert(payload).execute()
    if not res.data: raise HTTPException(status_code=500, detail="Failed to save report")
    return {"status": "received", "id": res.data[0]["id"], "classification": classification}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: QueryRequest):
    agent = RAGAgent()
    context = agent.search_knowledge(request.query)
    answer = agent.generate_answer(request.query, context)
    return ChatResponse(answer=answer, sources=context)

@router.get("/works/summary")
async def get_works_summary(area_id: str):
    projects = [
        {
            "id": "flyover-jubilee", "title": "Jubilee Hills Flyover Ext", "status": "in_progress",
            "total_budget": 150000000, "spent_budget": 85000000,
            "milestones": [{"label": "Foundation", "status": "completed"}, {"label": "Pillars", "status": "completed"}]
        }
    ]
    agent = WorksAgent()
    return agent.get_area_summary(projects)

@router.post("/schemes/check", response_model=List[SchemeEligibility])
async def check_schemes(user_profile: dict):
    schemes = [{"id": "rythu-bandhu", "benefits": "₹10,000 per acre", "eligibility_json": {"occupation": "farmer"}}]
    agent = SchemesAgent()
    return agent.evaluate_eligibility(user_profile, schemes)

@router.get("/monitoring/status")
async def get_agent_monitoring():
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    res = sb.table("agent_monitoring").select("*").execute()
    return res.data

@router.post("/report/{report_id}/upvote")
async def upvote_report(report_id: int):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    res = sb.table("citizen_reports").select("upvote_count").eq("id", report_id).execute()
    new_count = (res.data[0]["upvote_count"] or 0) + 1
    sb.table("citizen_reports").update({"upvote_count": new_count}).eq("id", report_id).execute()
    return {"status": "success", "new_count": new_count}

@router.get("/officials", response_model=List[Official])
async def get_officials(area_id: str):
    from supabase import create_client
    from core.config import settings
    sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    res = sb.table("officials").select("*").eq("area_id", area_id).execute()
    return res.data
