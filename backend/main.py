"""
ConnectCRM - Backend Service (Stage 2: Full Functional Endpoints & Persistence)
================================================================================
FastAPI backend service for ConnectCRM.
Provides RESTful endpoints for:
- Root and health monitoring
- Dashboard statistics calculation
- Customers management (GET, POST with email validation & company support)
- Follow-ups management (GET, POST, PATCH /mark-done)
- Orders list and order status update (PATCH)
- Integrations status and credentials validation test
- Data persistence using lightweight local JSON store (survives restarts)
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="ConnectCRM API",
    description="Backend REST API service for ConnectCRM & WooCommerce integration.",
    version="0.2.1",
)

# -----------------------------------------------------------------------------
# CORS Configuration
# -----------------------------------------------------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Local JSON Storage Helper (Persists across restarts without external DB setup)
# -----------------------------------------------------------------------------
DATA_DIR = Path(__file__).parent / "data_store"
DATA_DIR.mkdir(exist_ok=True)
STORAGE_FILE = DATA_DIR / "crm_store.json"

DEFAULT_DATA = {
    "customers": [
        {
            "id": "cust-101",
            "name": "Sarah Jenkins",
            "email": "sarah.j@outlook.com",
            "phone": "+1 (555) 234-8901",
            "company": "Jenkins Retail",
            "tier": "Active VIP",
            "orders_count": 12,
            "total_spent": 1840.50,
            "source": "Sample Demo Record",
            "created_at": "2026-10-10T10:00:00Z"
        },
        {
            "id": "cust-102",
            "name": "Marcus Vance",
            "email": "m.vance@techcorp.io",
            "phone": "+1 (555) 987-6543",
            "company": "TechCorp Solutions",
            "tier": "Active VIP",
            "orders_count": 8,
            "total_spent": 2310.00,
            "source": "Sample Demo Record",
            "created_at": "2026-10-11T12:00:00Z"
        },
        {
            "id": "cust-103",
            "name": "Elena Rostova",
            "email": "elena.rostova@gmail.com",
            "phone": "+1 (555) 456-7890",
            "company": "Solo Merchant",
            "tier": "New Customer",
            "orders_count": 1,
            "total_spent": 89.99,
            "source": "Sample Demo Record",
            "created_at": "2026-10-12T08:30:00Z"
        },
        {
            "id": "cust-104",
            "name": "David Kalu",
            "email": "david.kalu@craftstudio.co",
            "phone": "+1 (555) 321-7654",
            "company": "Craft Studio Co",
            "tier": "Regular",
            "orders_count": 5,
            "total_spent": 940.20,
            "source": "Sample Demo Record",
            "created_at": "2026-10-12T14:15:00Z"
        },
        {
            "id": "cust-105",
            "name": "Amara Chen",
            "email": "amara.c@designworks.net",
            "phone": "+1 (555) 654-0987",
            "company": "Designworks Agency",
            "tier": "Regular",
            "orders_count": 3,
            "total_spent": 410.00,
            "source": "Sample Demo Record",
            "created_at": "2026-10-12T17:40:00Z"
        },
        {
            "id": "cust-106",
            "name": "Liam O'Connor",
            "email": "liam.oc@peakfitness.org",
            "phone": "+1 (555) 789-1234",
            "company": "Peak Fitness",
            "tier": "Regular",
            "orders_count": 4,
            "total_spent": 620.00,
            "source": "Sample Demo Record",
            "created_at": "2026-10-13T09:20:00Z"
        }
    ],
    "followups": [
        {
            "id": "fol-1",
            "customerName": "Marcus Vance",
            "email": "m.vance@techcorp.io",
            "dueDate": "Today, 4:00 PM",
            "reason": "Follow up on bulk order discount agreement",
            "priority": "high",
            "status": "pending",
            "completed_at": None
        },
        {
            "id": "fol-2",
            "customerName": "Elena Rostova",
            "email": "elena.rostova@gmail.com",
            "dueDate": "Tomorrow, 11:30 AM",
            "reason": "Abandoned checkout assistance & coupon offering",
            "priority": "medium",
            "status": "pending",
            "completed_at": None
        },
        {
            "id": "fol-3",
            "customerName": "Robert Vance",
            "email": "rvance@vancerefrig.com",
            "dueDate": "Oct 15, 2:00 PM",
            "reason": "Quarterly satisfaction review",
            "priority": "low",
            "status": "pending",
            "completed_at": None
        }
    ],
    "orders": [
        {
            "id": "ord-1001",
            "orderNumber": "#WC-8941",
            "customerName": "Sarah Jenkins",
            "customerEmail": "sarah.j@outlook.com",
            "total": 249.0,
            "currency": "$",
            "status": "completed",
            "date": "2026-10-13 11:42",
            "itemsCount": 3,
            "source": "WooCommerce"
        },
        {
            "id": "ord-1002",
            "orderNumber": "#WC-8940",
            "customerName": "Marcus Vance",
            "customerEmail": "m.vance@techcorp.io",
            "total": 780.5,
            "currency": "$",
            "status": "processing",
            "date": "2026-10-13 10:15",
            "itemsCount": 5,
            "source": "WooCommerce"
        },
        {
            "id": "ord-1003",
            "orderNumber": "#WC-8939",
            "customerName": "Elena Rostova",
            "customerEmail": "elena.rostova@gmail.com",
            "total": 89.99,
            "currency": "$",
            "status": "pending",
            "date": "2026-10-13 08:30",
            "itemsCount": 1,
            "source": "WooCommerce"
        },
        {
            "id": "ord-1004",
            "orderNumber": "#WC-8938",
            "customerName": "David Kalu",
            "customerEmail": "david.kalu@craftstudio.co",
            "total": 420.0,
            "currency": "$",
            "status": "completed",
            "date": "2026-10-12 17:04",
            "itemsCount": 4,
            "source": "WooCommerce"
        },
        {
            "id": "ord-1005",
            "orderNumber": "#WC-8937",
            "customerName": "Amara Chen",
            "customerEmail": "amara.c@designworks.net",
            "total": 135.25,
            "currency": "$",
            "status": "cancelled",
            "date": "2026-10-12 14:22",
            "itemsCount": 2,
            "source": "WooCommerce"
        },
        {
            "id": "ord-1006",
            "orderNumber": "#WC-8936",
            "customerName": "Liam O'Connor",
            "customerEmail": "liam.oc@peakfitness.org",
            "total": 512.0,
            "currency": "$",
            "status": "completed",
            "date": "2026-10-12 11:10",
            "itemsCount": 2,
            "source": "WooCommerce"
        }
    ]
}

def load_data() -> dict:
    if not STORAGE_FILE.exists():
        save_data(DEFAULT_DATA)
        return DEFAULT_DATA
    try:
        with open(STORAGE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return DEFAULT_DATA

def save_data(data: dict):
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# -----------------------------------------------------------------------------
# Data Models / Pydantic Schemas
# -----------------------------------------------------------------------------

class HealthStatus(BaseModel):
    status: str
    service: str
    timestamp: str
    environment: str

class DashboardStats(BaseModel):
    total_customers: int
    total_orders: int
    pending_orders: int
    followups_due: int
    currency: str
    source: str
    notes: str

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=30)
    company: Optional[str] = Field(None, max_length=100)
    tier: Optional[str] = Field("New Customer", max_length=50)

class Customer(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    tier: str
    orders_count: int = 0
    total_spent: float = 0.0
    source: str = "Manual Entry"
    created_at: Optional[str] = None

class CustomerFollowUp(BaseModel):
    id: str
    customerName: str
    email: str
    dueDate: str
    reason: str
    priority: str
    status: str
    completed_at: Optional[str] = None

class FollowUpStatusUpdate(BaseModel):
    status: str = Field("completed", pattern="^(completed|pending)$")

class OrderItemModel(BaseModel):
    id: str
    orderNumber: str
    customerName: str
    customerEmail: str
    total: float
    currency: str
    status: str
    date: str
    itemsCount: int
    source: str

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(completed|processing|pending|cancelled)$")

class IntegrationTestRequest(BaseModel):
    store_url: str
    consumer_key: str
    consumer_secret: Optional[str] = None

# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------

@app.get("/", summary="Root Status", tags=["General"])
def root():
    return {
        "message": "Welcome to ConnectCRM API",
        "status": "online",
        "version": "0.2.1",
        "docs_url": "/docs",
        "data_mode": "Local JSON Persisted Storage (Survives server restart)",
    }

@app.get("/health", response_model=HealthStatus, summary="Health Check", tags=["System"])
def get_health():
    return HealthStatus(
        status="healthy",
        service="connectcrm-backend",
        timestamp=datetime.utcnow().isoformat() + "Z",
        environment="development",
    )

@app.get("/api/dashboard/stats", response_model=DashboardStats, summary="Get Dashboard Statistics", tags=["Dashboard"])
def get_dashboard_stats():
    data = load_data()
    customers = data.get("customers", [])
    orders = data.get("orders", [])
    followups = data.get("followups", [])

    pending_orders_count = sum(1 for o in orders if o.get("status") == "pending")
    followups_due_count = sum(1 for f in followups if f.get("status") == "pending")

    return DashboardStats(
        total_customers=len(customers),
        total_orders=len(orders),
        pending_orders=pending_orders_count,
        followups_due=followups_due_count,
        currency="USD",
        source="ConnectCRM Local Data Store",
        notes="Dynamic statistics calculated from current customer, order, and follow-up states.",
    )

# --- Customers Endpoints ---

@app.get("/api/customers", response_model=List[Customer], summary="List Customers", tags=["Customers"])
def get_customers(
    search: Optional[str] = None,
    limit: Optional[int] = 100
):
    data = load_data()
    customers = data.get("customers", [])

    if search and isinstance(search, str):
        s = search.lower().strip()
        customers = [
            c for c in customers
            if s in c.get("name", "").lower()
            or s in c.get("email", "").lower()
            or s in (c.get("company") or "").lower()
        ]

    return customers[:limit] if limit else customers

@app.post("/api/customers", response_model=Customer, status_code=status.HTTP_201_CREATED, summary="Create Customer", tags=["Customers"])
def create_customer(payload: CustomerCreate):
    data = load_data()
    customers = data.get("customers", [])

    # Duplicate check on email
    existing = next((c for c in customers if c.get("email").lower() == payload.email.lower()), None)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A customer with email '{payload.email}' already exists.",
        )

    # Generate sequential unique customer ID
    next_id_num = len(customers) + 101
    new_customer = {
        "id": f"cust-{next_id_num}",
        "name": payload.name.strip(),
        "email": payload.email.strip().lower(),
        "phone": payload.phone.strip() if payload.phone else None,
        "company": payload.company.strip() if payload.company else None,
        "tier": payload.tier or "New Customer",
        "orders_count": 0,
        "total_spent": 0.0,
        "source": "Manual Entry (CRM)",
        "created_at": datetime.utcnow().isoformat() + "Z"
    }

    customers.insert(0, new_customer)
    data["customers"] = customers
    save_data(data)

    return new_customer

# --- Follow-ups Endpoints ---

@app.get("/api/follow-ups", response_model=List[CustomerFollowUp], summary="List Follow-ups", tags=["Follow-ups"])
def get_followups():
    data = load_data()
    return data.get("followups", [])

@app.patch("/api/follow-ups/{followup_id}/mark-done", response_model=CustomerFollowUp, summary="Mark Follow-up Done", tags=["Follow-ups"])
def mark_followup_done(followup_id: str):
    data = load_data()
    followups = data.get("followups", [])

    target = next((f for f in followups if f["id"] == followup_id), None)
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Follow-up with ID '{followup_id}' not found.",
        )

    # Idempotent handling: If already completed, return gracefully
    if target.get("status") == "completed":
        return target

    target["status"] = "completed"
    target["completed_at"] = datetime.utcnow().isoformat() + "Z"

    save_data(data)
    return target

# --- Orders Endpoints ---

@app.get("/api/orders", response_model=List[OrderItemModel], summary="List Orders", tags=["Orders"])
def get_orders():
    data = load_data()
    return data.get("orders", [])

@app.patch("/api/orders/{order_id}/status", response_model=OrderItemModel, summary="Update Order Status", tags=["Orders"])
def update_order_status(order_id: str, payload: OrderStatusUpdate):
    data = load_data()
    orders = data.get("orders", [])

    order = next((o for o in orders if o["id"] == order_id), None)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID '{order_id}' not found.",
        )

    order["status"] = payload.status
    save_data(data)
    return order

# --- Integrations Test Endpoint ---

@app.post("/api/integrations/test-connection", summary="Test WooCommerce Connection", tags=["Integrations"])
def test_woocommerce_connection(payload: IntegrationTestRequest):
    if not payload.store_url or not payload.consumer_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Store URL and Consumer Key are required to test connection.",
        )
    # Check if this is the default placeholder or demo credentials
    if "demo" in payload.consumer_key.lower() or "example" in payload.store_url.lower() or "local" in payload.store_url.lower():
        return {
            "status": "connected_sandbox",
            "message": "Connected to WooCommerce demo sandbox simulation. Live production store credentials require a valid HTTPS endpoint and REST API key pair.",
            "store_url": payload.store_url,
            "version": "WooCommerce REST API v3"
        }
    return {
        "status": "ready",
        "message": f"Parameters validated for {payload.store_url}. Ready for Stage 3 live API credentials exchange.",
        "store_url": payload.store_url
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
