from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole, name='userrole'), default=UserRole.USER)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    documents = db.relationship('Document', backref='user', lazy=True)
    processing_rules = db.relationship('ProcessingRule', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def has_role(self, role):
        return self.role == role
    
    def is_admin(self):
        return self.role == UserRole.ADMIN
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class DocumentStatus(enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)  # in bytes
    status = db.Column(db.Enum('uploaded', 'processing', 'completed', 'error', name='documentstatus'), default='uploaded')
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)
    output_path = db.Column(db.String(500))  # Path to processed document
    error_message = db.Column(db.Text)
    
    # Relationships
    processing_jobs = db.relationship('ProcessingJob', backref='document', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'status': self.status,
            'uploaded_at': self.uploaded_at.isoformat(),
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'output_path': self.output_path,
            'error_message': self.error_message
        }

class ProcessingRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    instruction = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # term, parties, firm, signature, other
    is_active = db.Column(db.Boolean, default=True)
    is_global = db.Column(db.Boolean, default=False)  # Admin rules are global
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'instruction': self.instruction,
            'category': self.category,
            'is_active': self.is_active,
            'is_global': self.is_global,
            'created_at': self.created_at.isoformat()
        }

class ProcessingJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, processing, completed, failed
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    error_message = db.Column(db.Text)
    processing_log = db.Column(db.Text)  # JSON string of processing steps
    
    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'status': self.status,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'error_message': self.error_message,
            'processing_log': self.processing_log
        }
