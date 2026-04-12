from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Gateway Experience API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

# Focus Level definitions
FOCUS_LEVELS = {
    "10": {
        "name": "Focus 10",
        "name_de": "Focus 10",
        "description": "Mind Awake / Body Asleep - The foundation state for all exploration",
        "description_de": "Geist Wach / Körper Schläft - Der Grundzustand für alle Erkundungen",
        "beat_frequency": 10,
        "base_frequency": 200,
        "duration_minutes": 15,
        "color": "#4A90D9"
    },
    "12": {
        "name": "Focus 12",
        "name_de": "Focus 12",
        "description": "Expanded Awareness - Access to higher self and intuitive knowledge",
        "description_de": "Erweitertes Bewusstsein - Zugang zum höheren Selbst und intuitivem Wissen",
        "beat_frequency": 7,
        "base_frequency": 200,
        "duration_minutes": 20,
        "color": "#7B68EE"
    },
    "15": {
        "name": "Focus 15",
        "name_de": "Focus 15",
        "description": "No-Time State - Transcending time and space limitations",
        "description_de": "Zeitloser Zustand - Überschreiten von Zeit- und Raumbegrenzungen",
        "beat_frequency": 4,
        "base_frequency": 200,
        "duration_minutes": 25,
        "color": "#9932CC"
    }
}

# Session Models
class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
    focus_level: str
    duration_seconds: int
    completed: bool = True
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SessionCreate(BaseModel):
    focus_level: str
    duration_seconds: int
    completed: bool = True
    notes: Optional[str] = None

# Journal Models
class JournalEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
    title: str
    content: str
    focus_level: Optional[str] = None
    session_id: Optional[str] = None
    mood: Optional[str] = None
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class JournalEntryCreate(BaseModel):
    title: str
    content: str
    focus_level: Optional[str] = None
    session_id: Optional[str] = None
    mood: Optional[str] = None
    tags: List[str] = []

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tags: Optional[List[str]] = None

# User Progress Model
class UserProgress(BaseModel):
    user_id: str = "default_user"
    total_sessions: int = 0
    total_minutes: int = 0
    focus_10_sessions: int = 0
    focus_12_sessions: int = 0
    focus_15_sessions: int = 0
    streak_days: int = 0
    last_session_date: Optional[datetime] = None

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Gateway Experience API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Focus Levels
@api_router.get("/focus-levels")
async def get_focus_levels():
    return FOCUS_LEVELS

@api_router.get("/focus-levels/{level_id}")
async def get_focus_level(level_id: str):
    if level_id not in FOCUS_LEVELS:
        raise HTTPException(status_code=404, detail="Focus level not found")
    return FOCUS_LEVELS[level_id]

# Sessions
@api_router.post("/sessions", response_model=Session)
async def create_session(session_data: SessionCreate):
    session = Session(**session_data.dict())
    await db.sessions.insert_one(session.dict())
    
    # Update user progress
    await update_user_progress(session)
    
    return session

@api_router.get("/sessions", response_model=List[Session])
async def get_sessions(limit: int = 50):
    sessions = await db.sessions.find().sort("created_at", -1).limit(limit).to_list(limit)
    return [Session(**s) for s in sessions]

@api_router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return Session(**session)

# Journal
@api_router.post("/journal", response_model=JournalEntry)
async def create_journal_entry(entry_data: JournalEntryCreate):
    entry = JournalEntry(**entry_data.dict())
    await db.journal.insert_one(entry.dict())
    return entry

@api_router.get("/journal", response_model=List[JournalEntry])
async def get_journal_entries(limit: int = 50):
    entries = await db.journal.find().sort("created_at", -1).limit(limit).to_list(limit)
    return [JournalEntry(**e) for e in entries]

@api_router.get("/journal/{entry_id}", response_model=JournalEntry)
async def get_journal_entry(entry_id: str):
    entry = await db.journal.find_one({"id": entry_id})
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return JournalEntry(**entry)

@api_router.put("/journal/{entry_id}", response_model=JournalEntry)
async def update_journal_entry(entry_id: str, update_data: JournalEntryUpdate):
    entry = await db.journal.find_one({"id": entry_id})
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.journal.update_one({"id": entry_id}, {"$set": update_dict})
    updated_entry = await db.journal.find_one({"id": entry_id})
    return JournalEntry(**updated_entry)

@api_router.delete("/journal/{entry_id}")
async def delete_journal_entry(entry_id: str):
    result = await db.journal.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return {"message": "Journal entry deleted"}

# User Progress
@api_router.get("/progress", response_model=UserProgress)
async def get_user_progress():
    progress = await db.progress.find_one({"user_id": "default_user"})
    if not progress:
        return UserProgress()
    return UserProgress(**progress)

async def update_user_progress(session: Session):
    progress = await db.progress.find_one({"user_id": "default_user"})
    if not progress:
        progress = UserProgress().dict()
    
    progress["total_sessions"] = progress.get("total_sessions", 0) + 1
    progress["total_minutes"] = progress.get("total_minutes", 0) + (session.duration_seconds // 60)
    
    # Update focus level specific counts
    focus_key = f"focus_{session.focus_level}_sessions"
    if focus_key in progress:
        progress[focus_key] = progress.get(focus_key, 0) + 1
    
    # Update streak
    last_date = progress.get("last_session_date")
    today = datetime.utcnow().date()
    
    if last_date:
        if isinstance(last_date, datetime):
            last_date = last_date.date()
        days_diff = (today - last_date).days
        if days_diff == 1:
            progress["streak_days"] = progress.get("streak_days", 0) + 1
        elif days_diff > 1:
            progress["streak_days"] = 1
    else:
        progress["streak_days"] = 1
    
    progress["last_session_date"] = datetime.utcnow()
    
    await db.progress.update_one(
        {"user_id": "default_user"},
        {"$set": progress},
        upsert=True
    )

# Statistics
@api_router.get("/statistics")
async def get_statistics():
    progress = await db.progress.find_one({"user_id": "default_user"})
    if not progress:
        progress = UserProgress().dict()
    
    sessions_count = await db.sessions.count_documents({})
    journal_count = await db.journal.count_documents({})
    
    return {
        "total_sessions": progress.get("total_sessions", 0),
        "total_minutes": progress.get("total_minutes", 0),
        "streak_days": progress.get("streak_days", 0),
        "focus_levels": {
            "10": progress.get("focus_10_sessions", 0),
            "12": progress.get("focus_12_sessions", 0),
            "15": progress.get("focus_15_sessions", 0)
        },
        "journal_entries": journal_count
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
