import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Index, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), default="")
    target_exam = Column(String(50), default="General") # General, IELTS, VSTEP
    daily_new_target = Column(Integer, default=20) # 20 words per day minimum
    study_mode = Column(String(50), default="manual") # manual, time_budget, adaptive
    streak_count = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_active_date = Column(String(10), default="") # YYYY-MM-DD
    timezone = Column(String(50), default="Asia/Ho_Chi_Minh")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserItemProgress", back_populates="user", cascade="all, delete-orphan")
    events = relationship("ReviewEvent", back_populates="user", cascade="all, delete-orphan")
    saved_items = relationship("UserSavedItem", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(String(64), primary_key=True) # Token hash or UUID
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    device_name = Column(String(100), default="Unknown Device") # "Chrome on Windows", "Safari on iPhone"
    device_type = Column(String(50), default="desktop") # desktop, mobile, tablet
    ip_address = Column(String(45), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_active_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="sessions")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SourceDocument(Base):
    __tablename__ = "source_documents"
    
    id = Column(String(64), primary_key=True) # Slug or hash
    name = Column(String(255), nullable=False)
    file_path = Column(String(500), default="")
    source_type = Column(String(50), default="pdf") # pdf, excel, csv, web
    sha256 = Column(String(64), default="")
    total_items = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    items = relationship("KnowledgeItem", back_populates="source")

class KnowledgeItem(Base):
    __tablename__ = "knowledge_items"
    
    id = Column(String(64), primary_key=True) # slug or unique key
    word = Column(String(255), nullable=False, index=True)
    pos = Column(String(50), default="") # part of speech
    pron = Column(String(100), default="") # IPA pronunciation
    meaning_en = Column(Text, default="")
    meaning_vi = Column(Text, default="")
    example = Column(Text, default="")
    example_vi = Column(Text, default="")
    level = Column(String(20), default="B1", index=True) # A2, B1, B1+, B2, C1, C2
    gse = Column(Integer, nullable=True) # Global Scale of English (Speakout)
    item_type = Column(String(50), default="word", index=True) # word, collocation, idiom, phrasal_verb
    topic = Column(String(100), default="", index=True)
    unit = Column(String(100), default="", index=True)
    source_id = Column(String(64), ForeignKey("source_documents.id"), nullable=True)
    source_page = Column(String(50), default="")
    status = Column(String(50), default="approved") # approved, pending_review
    is_custom = Column(Boolean, default=False)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    source = relationship("SourceDocument", back_populates="items")
    progress_records = relationship("UserItemProgress", back_populates="item", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_word_level_type", "word", "level", "item_type"),
    )

class UserItemProgress(Base):
    __tablename__ = "user_item_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(String(64), ForeignKey("knowledge_items.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(50), default="recognition") # recognition (flashcard), cued_recall (typing), cloze
    
    # SM-2 Algorithm State
    ease_factor = Column(Float, default=2.5) # SM-2 standard default
    interval_days = Column(Integer, default=0) # 0 = same day
    repetitions = Column(Integer, default=0) # successful consecutive recalls
    lapses = Column(Integer, default=0) # times forgotten
    due_date = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    last_reviewed = Column(DateTime, nullable=True)
    state = Column(String(20), default="new", index=True) # new, learning, review, relearning, suspended
    is_favorite = Column(Boolean, default=False)
    user_notes = Column(Text, default="")
    
    user = relationship("User", back_populates="progress")
    item = relationship("KnowledgeItem", back_populates="progress_records")
    
    __table_args__ = (
        UniqueConstraint("user_id", "item_id", "test_type", name="uq_user_item_test"),
        Index("idx_user_due_state", "user_id", "due_date", "state")
    )

class ReviewEvent(Base):
    __tablename__ = "review_events"
    
    id = Column(Integer, primary_key=True, index=True)
    client_event_id = Column(String(64), unique=True, index=True, nullable=False) # For idempotent offline replay
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(String(64), ForeignKey("knowledge_items.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(50), default="recognition")
    rating = Column(Integer, nullable=False) # 1=Again(Quên), 2=Hard(Khó), 3=Good(Nhớ), 4=Easy(Dễ)
    response_time_ms = Column(Integer, default=0)
    used_hint = Column(Boolean, default=False)
    device_id = Column(String(64), default="")
    created_at_client = Column(DateTime, nullable=False)
    received_at_server = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="events")

class ReadingPassage(Base):
    __tablename__ = "reading_passages"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="hot_reads") # hot_reads, story, textbook
    level = Column(String(20), default="B1+")
    content = Column(Text, nullable=False)
    source_reference = Column(String(255), default="")
    target_words_json = Column(Text, default="[]") # JSON list of words to highlight
    questions_json = Column(Text, default="[]") # JSON list of comprehension questions
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GrammarTopic(Base):
    __tablename__ = "grammar_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, nullable=False, unique=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, default="")
    sections_json = Column(Text, default="[]") # JSON array of { subtitle, content }
    quiz_json = Column(Text, default="[]") # JSON array of { q, options, answer, explain }
    fill_blanks_json = Column(Text, default="[]") # JSON array of { sentence, answer, alternatives, hint, explain }
    source_verified = Column(Boolean, default=True)
    source_reference = Column(String(255), default="Tài liệu khóa học Chuyên đề Ngữ pháp 11 - Cô Trang Anh")

class UserSavedItem(Base):
    __tablename__ = "user_saved_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(String(64), ForeignKey("knowledge_items.id", ondelete="CASCADE"), nullable=False)
    context_sentence = Column(Text, default="")
    passage_id = Column(Integer, ForeignKey("reading_passages.id", ondelete="SET NULL"), nullable=True)
    save_type = Column(String(20), default="learn_now") # learn_now, save_for_later
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="saved_items")

class DailyActivity(Base):
    __tablename__ = "daily_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date_str = Column(String(10), nullable=False, index=True) # YYYY-MM-DD
    reviews_count = Column(Integer, default=0)
    new_words_count = Column(Integer, default=0)
    time_spent_seconds = Column(Integer, default=0)
    goal_reached = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="activities")
    
    __table_args__ = (
        UniqueConstraint("user_id", "date_str", name="uq_user_date"),
    )

class UserNotificationSetting(Base):
    __tablename__ = "user_notification_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    telegram_bot_token = Column(String(255), default="")
    telegram_chat_id = Column(String(100), default="")
    remind_morning = Column(Boolean, default=True)
    remind_evening = Column(Boolean, default=True)
    remind_deadline = Column(Boolean, default=True)
    deadline_time = Column(String(10), default="21:30")
    is_active = Column(Boolean, default=True)
    last_sent_date = Column(String(10), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

