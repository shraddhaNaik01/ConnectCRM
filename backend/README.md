# ConnectCRM — Backend Service (Stage 2)

FastAPI REST backend service for **ConnectCRM — Customer Relationship Management & WooCommerce Integration**.

---

## 📌 Overview

This backend service provides API endpoints for customer relationship management, order metadata, and eventual WooCommerce store synchronization.

In **Stage 2**, the backend provides:
- Core FastAPI app lifecycle and configuration.
- Cross-Origin Resource Sharing (CORS) configured for `http://localhost:3000`.
- Health check and API root verification endpoints.
- Clearly identified demonstration data for dashboard statistics and customer directories.
- Auto-generated Swagger documentation at `/docs` and ReDoc at `/redoc`.

*(PostgreSQL database connections and live WooCommerce API endpoints will be connected in future stages).*

---

## 🛠️ Prerequisites (Windows)

- **Python 3.10+** (Python 3.13 or 3.14 recommended)
- **PowerShell** or **Command Prompt**

---

## 🚀 Setup & Run Instructions (Windows PowerShell)

Open PowerShell and follow these exact steps:

### 1. Navigate to the `backend` folder
```powershell
cd C:\Users\naiks\Desktop\Killowott\backend
```

### 2. Create a Python Virtual Environment
```powershell
python -m venv venv
```

### 3. Activate the Virtual Environment
```powershell
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# (Note: If you receive a script execution policy error, run once:
#  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser)
#
# Alternatively, you can activate via Command Prompt:
# .\venv\Scripts\activate.bat
```

### 4. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 5. Start the FastAPI Development Server
```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at **http://127.0.0.1:8000** with hot-reload enabled.

---

## 🧪 Testing the Endpoints

Once the server is running, open a separate terminal or web browser to test:

### 1. In Browser:
- **Root Status:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Dashboard Stats:** [http://127.0.0.1:8000/api/dashboard/stats](http://127.0.0.1:8000/api/dashboard/stats)
- **Customer Directory:** [http://127.0.0.1:8000/api/customers](http://127.0.0.1:8000/api/customers)
- **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Using PowerShell `Invoke-RestMethod`:
```powershell
# Root endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8000/"

# Health endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health"

# Dashboard statistics
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/dashboard/stats"

# Customers list
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/customers"
```

---

## 📁 Backend Directory Structure

```
backend/
├── main.py              # FastAPI app, CORS middleware, routes & demo schemas
├── requirements.txt     # Python package requirements
├── .env.example         # Environment template for ports, hosts, and future keys
├── README.md            # Setup and testing instructions
└── venv/                # Local Python virtual environment (ignored in git)
```
