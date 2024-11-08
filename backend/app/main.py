# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import execution, keywords, performance, competition, contacts
from database import init_db
from config import settings

app = FastAPI(
    title="Google Ads Tracker API",
    description="API para rastreamento e análise de anúncios do Google",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(execution.router, prefix=settings.API_V1_STR)
app.include_router(keywords.router, prefix=settings.API_V1_STR)
app.include_router(performance.router, prefix=settings.API_V1_STR)
app.include_router(competition.router, prefix=settings.API_V1_STR)
app.include_router(contacts.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    """Executa ações necessárias na inicialização da API."""
    init_db()

@app.get("/")
async def root():
    """Rota raiz para verificar se a API está funcionando."""
    return {
        "message": "Google Ads Tracker API",
        "version": "1.0.0",
        "status": "running"
    }