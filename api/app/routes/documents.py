import os
import json
import logging
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from functools import wraps
import uuid
from app import db

logger = logging.getLogger(__name__)
documents_bp = Blueprint('documents', __name__)

# File upload configuration
ALLOWED_EXTENSIONS = {'docx'}
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def require_auth(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        # For demo purposes, create a mock user based on X-User-ID header
        user_id = request.headers.get('X-User-ID', '1')
        if user_id == '1':
            # Mock admin user
            class MockUser:
                id = 1
                role = 'ADMIN'
            user = MockUser()
        elif user_id == '2':
            # Mock regular user
            class MockUser:
                id = 2
                role = 'USER'
            user = MockUser()
        else:
            return jsonify({'error': 'Unauthorized'}), 401
        
        return f(user, *args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        # For demo purposes, check if user is admin
        if user_id == '1':
            user = type('MockUser', (), {'id': 1, 'role': 'admin'})()
        else:
            # For non-demo users, check against database
            User = current_app.User
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if not user.is_admin():
                return jsonify({'error': 'Admin access required'}), 403
        
        return f(user, *args, **kwargs)
    return decorated_function

@documents_bp.route('/upload', methods=['POST'])
@require_auth
def upload_document(user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file:
        return jsonify({'error': 'Invalid file'}), 400
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}_{secure_filename(file.filename)}"
    
    # Ensure uploads directory exists
    upload_dir = 'uploads'
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, filename)
    file.save(file_path)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create document record
    Document = current_app.Document
    document = Document(
        user_id=user.id,
        filename=filename,
        original_filename=secure_filename(file.filename),
        file_path=file_path,
        file_size=file_size,
        status='uploaded'
    )
    
    db.session.add(document)
    db.session.commit()
    
    return jsonify({
        'message': 'Document uploaded successfully',
        'document': document.to_dict()
    }), 201

@documents_bp.route('/<int:document_id>/process', methods=['POST'])
@require_auth
def process_document(user, document_id):
    Document = current_app.Document
    document = Document.query.get(document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    if document.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get request data for custom rules and firm details
    data = request.get_json() or {}
    custom_rules = data.get('custom_rules', [])
    firm_details = data.get('firm_details', {})
    
    # Update status to processing
    document.status = 'processing'
    db.session.commit()
    
    try:
        # Validate file exists and is readable
        if not os.path.exists(document.file_path):
            raise Exception(f"Document file not found: {document.file_path}")
        
        # Check file size
        file_size = os.path.getsize(document.file_path)
        if file_size == 0:
            raise Exception("Document file is empty")
        
        # Validate file is a valid .docx file
        try:
            from docx import Document as DocxDocument
            # Try to open the document to validate it's a proper .docx file
            test_doc = DocxDocument(document.file_path)
            # If we get here, the file is valid
            test_doc = None  # Close the test document
        except Exception as e:
            raise Exception(f"Invalid .docx file: {str(e)}")
        
        # Import AI service
        from app.services.ai_redlining import AIRedliningService, DocumentProcessor
        
        # Initialize AI service
        ai_service = AIRedliningService()
        
        # Extract text from Word document
        try:
            doc = DocxDocument(document.file_path)
            document_text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
            
            # Validate we extracted some text
            if not document_text.strip():
                raise Exception("No text content found in document")
                
        except Exception as e:
            # Fallback: try to read as text file
            try:
                with open(document.file_path, 'r', encoding='utf-8') as f:
                    document_text = f.read()
            except:
                # If all else fails, create a basic text representation
                document_text = f"Document: {document.original_filename}\nFile size: {document.file_size} bytes\nProcessing timestamp: {datetime.utcnow()}"
        
        # Process document with AI and apply modifications
        processor = DocumentProcessor(ai_service)
        result = processor.process_document(document.file_path, custom_rules, firm_details)
        
        if not result.get('success'):
            raise Exception(result.get('error', 'Document processing failed'))
        
        # Get the output path from the processor
        output_path = result.get('output_path')
        
        # Update document status
        document.status = 'completed'
        document.processed_at = datetime.utcnow()
        document.output_path = output_path
        db.session.commit()
        
        return jsonify({
            'message': 'Document processed successfully',
            'result': result,
            'document': document.to_dict()
        })
        
    except Exception as e:
        document.status = 'error'
        document.error_message = str(e)
        db.session.commit()
        
        return jsonify({
            'error': f'Error processing document: {str(e)}'
        }), 500

@documents_bp.route('/<int:document_id>/download')
@require_auth
def download_document(user, document_id):
    Document = current_app.Document
    document = Document.query.get(document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    if document.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if not document.output_path or not os.path.exists(document.output_path):
        return jsonify({'error': 'No processed document available for download'}), 404
    
    from flask import send_file
    return send_file(
        document.output_path,
        as_attachment=True,
        download_name=f"processed_{document.original_filename}"
    )

@documents_bp.route('/', methods=['GET'])
@require_auth
def list_documents(user):
    Document = current_app.Document
    documents = Document.query.filter_by(user_id=user.id).order_by(Document.uploaded_at.desc()).all()
    
    return jsonify({
        'documents': [doc.to_dict() for doc in documents]
    })

@documents_bp.route('/<int:document_id>', methods=['GET'])
@require_auth
def get_document(user, document_id):
    Document = current_app.Document
    document = Document.query.get(document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    if document.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'document': document.to_dict()
    })

@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@require_auth
def delete_document(user, document_id):
    Document = current_app.Document
    document = Document.query.get(document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    if document.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete file from filesystem
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    if document.output_path and os.path.exists(document.output_path):
        os.remove(document.output_path)
    
    # Delete from database
    db.session.delete(document)
    db.session.commit()
    
    return jsonify({'message': 'Document deleted successfully'})
