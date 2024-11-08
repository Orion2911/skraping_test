# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
import logging

# Configurar logging
logging.basicConfig(
    filename=settings.LOG_FILE,
    level=logging.INFO,
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Criar engine do SQLAlchemy
try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False}  # Necessário para SQLite
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Error creating database engine: {str(e)}")
    raise

# Criar SessionLocal
try:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("Database session maker created successfully")
except Exception as e:
    logger.error(f"Error creating session maker: {str(e)}")
    raise

# Criar Base para os modelos
Base = declarative_base()

# Função para obter uma sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para inicializar o banco de dados
def init_db():
    try:
        # Importar todos os modelos aqui para que o SQLAlchemy os reconheça
        from models.search import Search
        from models.competitor import Competitor
        from models.contact import Contact
        from models.keyword import Keyword
        from models.execution import Execution
        from models.competitor_appearance import CompetitorAppearance
        
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Inicializar dados padrão se necessário
        db = SessionLocal()
        try:
            # Verificar se já existem palavras-chave
            existing_keywords = db.query(Keyword).first()
            if not existing_keywords:
                # Inserir palavras-chave padrão
                for keyword in settings.DEFAULT_KEYWORDS:
                    db_keyword = Keyword(text=keyword)
                    db.add(db_keyword)
                db.commit()
                logger.info("Default keywords inserted successfully")
        except Exception as e:
            logger.error(f"Error initializing default data: {str(e)}")
            db.rollback()
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

# Função para limpar o banco de dados (útil para testes)
def clear_db():
    try:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        logger.info("Database cleared successfully")
    except Exception as e:
        logger.error(f"Error clearing database: {str(e)}")
        raise

# Função para verificar a conexão com o banco de dados
def check_db_connection():
    try:
        # Tentar criar uma sessão e executar uma query simples
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        logger.info("Database connection check successful")
        return True
    except Exception as e:
        logger.error(f"Database connection check failed: {str(e)}")
        return False

if __name__ == "__main__":
    # Se este arquivo for executado diretamente, inicializar o banco de dados
    init_db()