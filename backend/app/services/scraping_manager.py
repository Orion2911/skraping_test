# backend/app/services/scraping_manager.py

import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from services.scraper import GoogleScraper
from models import Execution, Keyword
from config import settings

logger = logging.getLogger(__name__)

class ScrapingManager:
    def __init__(self, db: Session):
        self.db = db
        self.current_execution: Optional[Execution] = None
        self.scraper: Optional[GoogleScraper] = None

    async def start_execution(self, headless: bool = False) -> Execution:
        """Inicia uma nova execução do scraper."""
        try:
            # Criar novo registro de execução
            execution = Execution(
                execution_mode="headless" if headless else "visible"
            )
            self.db.add(execution)
            self.db.commit()
            
            self.current_execution = execution
            
            # Inicializar scraper
            self.scraper = GoogleScraper(
                self.db, 
                execution.id, 
                headless
            )
            self.scraper.configure_driver()
            
            logger.info(f"Started new execution with ID {execution.id}")
            return execution
            
        except Exception as e:
            logger.error(f"Error starting execution: {str(e)}")
            if execution:
                execution.status = "error"
                execution.error_message = str(e)
                self.db.commit()
            raise

    async def stop_execution(self) -> None:
        """Para a execução atual do scraper."""
        try:
            if self.current_execution:
                self.current_execution.end_time = datetime.utcnow()
                self.current_execution.is_running = False
                self.current_execution.status = "completed"
                self.db.commit()
            
            if self.scraper:
                self.scraper.close()
                
            logger.info("Execution stopped successfully")
            
        except Exception as e:
            logger.error(f"Error stopping execution: {str(e)}")
            raise

    async def run_scraping(self) -> None:
        """Executa o processo de scraping para todas as keywords ativas."""
        try:
            # Obter keywords ativas
            keywords = self.db.query(Keyword).filter(
                Keyword.is_active == True
            ).all()
            
            if not keywords:
                logger.warning("No active keywords found")
                return
            
            # Embaralhar keywords para parecer mais natural
            import random
            random.shuffle(keywords)
            
            # Executar pesquisa para cada keyword
            for keyword in keywords:
                if not self.current_execution.is_running:
                    break
                    
                try:
                    await self.scraper.run_search(keyword)
                    
                    # Atualizar estatísticas da execução
                    self.current_execution.total_searches += 1
                    self.db.commit()
                    
                except Exception as e:
                    logger.error(f"Error processing keyword {keyword.text}: {str(e)}")
                    continue
                
        except Exception as e:
            logger.error(f"Error in scraping execution: {str(e)}")
            raise