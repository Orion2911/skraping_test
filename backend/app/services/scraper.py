# backend/app/services/scraper.py

import time
import random
import logging
from typing import Optional, List, Dict, Tuple
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException, 
    NoSuchElementException, 
    ElementClickInterceptedException,
    WebDriverException
)
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from config import settings
from models import (
    Execution, 
    Keyword, 
    Search, 
    Competitor, 
    CompetitorAppearance, 
    Contact
)

logger = logging.getLogger(__name__)

class GoogleScraper:
    def __init__(self, db: Session, execution_id: int, headless: bool = False):
        """
        Inicializa o scraper do Google.
        
        Args:
            db (Session): Sessão do banco de dados
            execution_id (int): ID da execução atual
            headless (bool): Se deve executar em modo headless
        """
        self.db = db
        self.execution_id = execution_id
        self.headless = headless
        self.driver = None
        self.current_keyword = None
        self.current_search = None

    def configure_driver(self) -> None:
        """Configura o driver do Chrome com as opções necessárias."""
        try:
            chrome_options = Options()
            
            # Configuração de emulação mobile
            mobile_emulation = {
                "deviceName": "iPhone X"
            }
            chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
            
            # Modo incognito e headless (se solicitado)
            chrome_options.add_argument("--incognito")
            if self.headless:
                chrome_options.add_argument("--headless")
            
            # Outras configurações úteis
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument(f"user-agent={settings.USER_AGENT}")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.set_page_load_timeout(settings.PAGE_LOAD_TIMEOUT)
            
            logger.info("Chrome driver configured successfully")
        except Exception as e:
            logger.error(f"Error configuring Chrome driver: {str(e)}")
            raise

    def human_like_delay(self, min_time: float = 1.0, max_time: float = 3.0) -> None:
        """Simula um atraso humanizado entre ações."""
        time.sleep(random.uniform(min_time, max_time))

    def extract_domain(self, url: str) -> str:
        """Extrai o domínio base de uma URL."""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc
            return domain.replace("www.", "")
        except Exception:
            return url

    def find_whatsapp_number(self, page_source: str) -> Optional[str]:
        """
        Procura por números de WhatsApp na página.
        Retorna o primeiro número encontrado ou None.
        """
        # Implementação básica - pode ser expandida com regex mais complexos
        for pattern in settings.WHATSAPP_PATTERNS:
            if pattern in page_source.lower():
                # Aqui você pode implementar a lógica para extrair o número
                # Por enquanto, retornamos apenas uma indicação de que encontramos
                return "found_whatsapp"
        return None

    def process_ad(self, ad_element, position: int) -> Optional[Dict]:
        """Processa um único anúncio e retorna seus dados."""
        try:
            # Extrair URL e texto do anúncio
            url = ad_element.get_attribute('href')
            ad_text = ""
            
            try:
                text_element = ad_element.find_element(
                    By.XPATH, 
                    f"div[1]/div/div/span[2]"
                )
                ad_text = text_element.get_attribute('data-dtld')
            except NoSuchElementException:
                try:
                    text_element = ad_element.find_element(
                        By.XPATH, 
                        f"div[1]/div/div"
                    )
                    ad_text = text_element.get_attribute('aria-label')
                except NoSuchElementException:
                    pass

            domain = self.extract_domain(url)
            
            return {
                "url": url,
                "domain": domain,
                "position": position,
                "text": ad_text
            }
            
        except Exception as e:
            logger.error(f"Error processing ad at position {position}: {str(e)}")
            return None

    async def handle_competitor(self, ad_data: Dict) -> Tuple[Competitor, bool]:
        """
        Processa um competidor, criando ou atualizando seu registro.
        Retorna o competidor e um booleano indicando se é a Lidery.
        """
        try:
            domain = ad_data["domain"]
            is_lidery = settings.LIDERY_DOMAIN in domain
            
            competitor = self.db.query(Competitor).filter(
                Competitor.domain == domain
            ).first()
            
            if not competitor:
                competitor = Competitor(
                    domain=domain,
                    business_name=ad_data.get("text", "")
                )
                self.db.add(competitor)
            else:
                competitor.last_seen = datetime.utcnow()
                competitor.total_appearances += 1
                
            self.db.commit()
            
            return competitor, is_lidery
            
        except Exception as e:
            logger.error(f"Error handling competitor: {str(e)}")
            self.db.rollback()
            raise

    async def navigate_and_collect(self, url: str, competitor_id: int) -> None:
        """
        Navega até a página do anúncio e coleta informações adicionais.
        """
        try:
            # Guardar a janela original
            original_window = self.driver.current_window_handle
            
            # Simular comportamento humano antes de clicar
            self.human_like_delay(2, 4)
            
            # Abrir em nova aba
            self.driver.execute_script(f"window.open('{url}', '_blank');")
            
            # Mudar para a nova aba
            new_window = [window for window in self.driver.window_handles if window != original_window][0]
            self.driver.switch_to.window(new_window)
            
            # Esperar carregamento inicial
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Simular navegação humana
            scroll_height = self.driver.execute_script("return document.body.scrollHeight;")
            for i in range(3):  # Scroll 3 vezes
                scroll_to = random.randint(0, scroll_height)
                self.driver.execute_script(f"window.scrollTo(0, {scroll_to});")
                self.human_like_delay(1, 2)
            
            # Procurar WhatsApp
            page_source = self.driver.page_source.lower()
            whatsapp = self.find_whatsapp_number(page_source)
            
            if whatsapp:
                contact = Contact(
                    competitor_id=competitor_id,
                    type="whatsapp",
                    value=whatsapp
                )
                self.db.add(contact)
                self.db.commit()
            
            # Simular comportamento humano antes de fechar
            self.human_like_delay(
                settings.NAVIGATION_TIME["MIN"],
                settings.NAVIGATION_TIME["MAX"]
            )
            
            # Fechar aba e voltar à original
            self.driver.close()
            self.driver.switch_to.window(original_window)
            
        except Exception as e:
            logger.error(f"Error navigating to {url}: {str(e)}")
            # Tentar voltar à janela original em caso de erro
            try:
                self.driver.switch_to.window(original_window)
            except:
                pass

    async def run_search(self, keyword: Keyword) -> None:
        """
        Executa uma pesquisa para uma palavra-chave específica.
        """
        try:
            self.current_keyword = keyword
            
            # Criar registro de pesquisa
            search = Search(
                keyword_id=keyword.id,
                execution_id=self.execution_id
            )
            self.db.add(search)
            self.db.commit()
            self.current_search = search
            
            # Acessar Google e fazer a pesquisa
            self.driver.get("https://www.google.com")
            self.human_like_delay()
            
            # Encontrar campo de busca e inserir keyword
            search_box = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "q"))
            )
            search_box.clear()
            for char in keyword.text:
                search_box.send_keys(char)
                self.human_like_delay(0.1, 0.3)
            search_box.send_keys(Keys.RETURN)
            
            # Esperar carregar os anúncios
            self.human_like_delay(2, 4)
            
            # Processar anúncios
            for position in range(1, settings.MAX_ADS_PER_SEARCH + 1):
                try:
                    ad_xpath = settings.XPATH_CONFIG["ad_link_pattern"].format(
                        index=position + 2
                    )
                    ad_element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, ad_xpath))
                    )
                    
                    ad_data = self.process_ad(ad_element, position)
                    if not ad_data:
                        continue
                    
                    competitor, is_lidery = await self.handle_competitor(ad_data)
                    
                    appearance = CompetitorAppearance(
                        competitor_id=competitor.id,
                        search_id=search.id,
                        position=position
                    )
                    self.db.add(appearance)
                    
                    if is_lidery:
                        search.lidery_position = position
                        self.db.commit()
                        continue
                    
                    # Navegar até o site se não for Lidery
                    await self.navigate_and_collect(
                        ad_data["url"], 
                        competitor.id
                    )
                    appearance.clicked = 1
                    
                except Exception as e:
                    logger.error(f"Error processing ad {position}: {str(e)}")
                    continue
                
                finally:
                    self.db.commit()
            
            # Atualizar estatísticas da keyword
            keyword.last_used = datetime.utcnow()
            keyword.use_count += 1
            self.db.commit()
            
        except Exception as e:
            logger.error(f"Error in search execution: {str(e)}")
            raise

    def close(self) -> None:
        """Fecha o driver e limpa recursos."""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass