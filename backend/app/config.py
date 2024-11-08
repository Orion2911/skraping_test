# backend/app/config.py

import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict

class Settings:
    def __init__(self):
        # Configurações básicas
        self.APP_NAME = "Google Ads Tracker"
        self.DEBUG = True
        self.API_VERSION = "v1"
        self.API_PREFIX = f"/api/{self.API_VERSION}"

        # Configurações de diretórios
        self.BASE_DIR = Path(__file__).resolve().parent.parent
        self.LOGS_DIR = self.BASE_DIR / "logs"
        self.DATA_DIR = self.BASE_DIR / "data"
        self.DATABASE_DIR = self.BASE_DIR / "database"

        # Criar diretórios necessários
        self.LOGS_DIR.mkdir(exist_ok=True)
        self.DATA_DIR.mkdir(exist_ok=True)
        self.DATABASE_DIR.mkdir(exist_ok=True)

        # Configurações do banco de dados
        self.DATABASE_URL = f"sqlite:///{self.DATABASE_DIR}/google_ads.db"

        # Configurações do Selenium
        self.CHROME_DRIVER_PATH = os.getenv("CHROME_DRIVER_PATH", "chromedriver")
        self.HEADLESS = False  # Modo headless desativado por padrão
        self.USER_AGENT = (
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) "
            "Version/14.1.2 Mobile/15E148 Safari/604.1"
        )

        # Configurações de tempo (em segundos)
        self.PAGE_LOAD_TIMEOUT = 30
        self.NAVIGATION_TIME = {
            "MIN": 20,
            "MAX": 30
        }
        self.WHATSAPP_WAIT = {
            "MIN": 2,
            "MAX": 5
        }
        self.BETWEEN_SEARCHES = {
            "MIN": 5,
            "MAX": 25
        }

        # Configurações de pesquisa
        self.MAX_ADS_PER_SEARCH = 4
        self.LIDERY_DOMAIN = "lideryodontologia.com.br"
        
        # Configurações de logging
        self.LOG_FILE = self.LOGS_DIR / f"ads_tracker_{datetime.now().strftime('%Y%m%d')}.log"
        self.LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        
        # XPath patterns para scraping
        self.XPATH_PATTERNS = {
            'search_box': '//input[@name="q"]',
            'ads_container': '//*[@id="main"]',
            'ad_link_pattern': '//*[@id="main"]/div[{index}]/div/div/div/div[1]/a',
            'ad_text_pattern': '//*[@id="main"]/div[{index}]/div/div/div/div[1]/a/div[1]/div/div/span[2]',
            'ad_text_alternative': '//*[@id="main"]/div[{index}]/div/div/div/div[1]/a/div[1]/div/div'
        }

        # Padrões para identificação de WhatsApp
        self.WHATSAPP_PATTERNS = [
            "whatsapp",
            "whats-app",
            "whats app",
            "wapp",
            "wpp",
            "wa.me",
            "api.whatsapp.com"
        ]

# Instância global das configurações
settings = Settings()

# Lista de palavras-chave para pesquisa
DEFAULT_KEYWORDS = [
    "dentista emergência",
    "dentista curitiba centro",
    "odontologia emergência",
    "clínica odontológica em curitiba",
    "melhores dentistas curitiba",
    "dentista perto de mim",
    "dentista emergência curitiba",
    "dentista portão curitiba",
    "clinica odontológica curitiba",
    "dentista portão",
    "especialista em canal dentário",
    "emergência odontológica curitiba",
    "dentista vila izabel",
    "dentista agua verde curitiba",
    "melhores dentistas de curitiba",
    "especialista em ortodontia",
    "ortodontista curitiba",
    "dentista curitiba",
    "clinica odontológica",
    "dentista agua verde",
    "dentista",
    "periodontista curitiba",
    "tratamento de canal curitiba",
    "consultório de odontologia",
    "dentista portão",
    "consultório dentista",
    "periodontista",
    "consultório odontológico curitiba",
    "emergência dentista",
    "endodontista curitiba"
]