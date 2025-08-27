import os
import json
import logging
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from app.models import Document, ProcessingRule, ProcessingJob, DocumentStatus, User
from app.services.ai_redlining import AIRedliningService, DocumentProcessor
from app import db
from functools import wraps

logger = logging.getLogger(__name__)
documents_bp = Blueprint('documents', __name__)

# File upload configuration
ALLOWED_EXTENSIONS = {'docx'}
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get user from JWT token (simplified for now)
        # In production, implement proper JWT validation
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        # For demo purposes, create a mock user if ID is 1 (admin)
        if user_id == '1':
            # Create a demo admin user object
            user = type('MockUser', (), {'id': 1, 'role': 'admin'})()
        elif user_id == '2':
            # Create a demo regular user object
            user = type('MockUser', (), {'id': 2, 'role': 'user'})()
        else:
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
        
        return f(user, *args, **kwargs)
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
    """Upload a new NDA document"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only .docx files are allowed'}), 400
        
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Secure filename and save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{filename}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        
        # Create document record
        document = Document(
            user_id=user.id,
            filename=unique_filename,
            original_filename=filename,
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
        
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        return jsonify({'error': 'Failed to upload document'}), 500

@documents_bp.route('/<int:document_id>/process', methods=['POST'])
@require_auth
def process_document(user, document_id):
    """Process a document with AI redlining"""
    try:
        # Get document
        document = Document.query.filter_by(id=document_id, user_id=user.id).first()
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        if document.status != 'uploaded':
            return jsonify({'error': 'Document already processed or processing'}), 400
        
        # Get request data
        data = request.get_json()
        custom_rules = data.get('custom_rules', [])
        firm_details = data.get('firm_details', {})
        
        # Update document status
        document.status = 'processing'
        db.session.commit()
        
        # Create processing job
        processing_job = ProcessingJob(
            document_id=document.id,
            status='processing'
        )
        db.session.add(processing_job)
        db.session.commit()
        
        try:
            # Initialize AI service and processor
            ai_service = AIRedliningService()
            processor = DocumentProcessor(ai_service)
            
            # Process the document
            result = processor.process_document(
                document.file_path,
                custom_rules,
                firm_details
            )
            
            if result['success']:
                # Update document with success
                document.status = 'completed'
                document.processed_at = datetime.utcnow()
                document.output_path = result['output_path']
                
                # Update processing job
                processing_job.status = 'completed'
                processing_job.completed_at = datetime.utcnow()
                processing_job.processing_log = json.dumps({
                    'modifications_applied': result['modifications_applied'],
                    'ai_analysis': result['ai_analysis']
                })
                
                db.session.commit()
                
                return jsonify({
                    'message': 'Document processed successfully',
                    'document': document.to_dict(),
                    'processing_result': result
                })
            else:
                # Update document with error
                document.status = 'error'
                document.error_message = result['error']
                
                # Update processing job
                processing_job.status = 'failed'
                processing_job.error_message = result['error']
                processing_job.completed_at = datetime.utcnow()
                
                db.session.commit()
                
                return jsonify({'error': result['error']}), 500
                
        except Exception as e:
            # Update document with error
            document.status = 'error'
            document.error_message = str(e)
            
            # Update processing job
            processing_job.status = 'failed'
            processing_job.error_message = str(e)
            processing_job.completed_at = datetime.utcnow()
            
            db.session.commit()
            
            logger.error(f"Error processing document {document_id}: {str(e)}")
            return jsonify({'error': 'Failed to process document'}), 500
            
    except Exception as e:
        logger.error(f"Error in process_document: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@documents_bp.route('/<int:document_id>/download', methods=['GET'])
@require_auth
def download_document(user, document_id):
    """Download a processed document"""
    try:
        document = Document.query.filter_by(id=document_id, user_id=user.id).first()
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        if document.status != 'completed':
            return jsonify({'error': 'Document not ready for download'}), 400
        
        if not document.output_path or not os.path.exists(document.output_path):
            return jsonify({'error': 'Output file not found'}), 404
        
        # Get the filename for the download
        filename = os.path.basename(document.output_path)
        
        # Return the actual file for download
        return send_file(
            document.output_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        logger.error(f"Error downloading document: {str(e)}")
        return jsonify({'error': 'Failed to prepare download'}), 500

@documents_bp.route('/<int:document_id>', methods=['GET'])
@require_auth
def get_document(user, document_id):
    """Get document details"""
    try:
        document = Document.query.filter_by(id=document_id, user_id=user.id).first()
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        return jsonify({
            'document': document.to_dict(),
            'processing_jobs': [job.to_dict() for job in document.processing_jobs]
        })
        
    except Exception as e:
        logger.error(f"Error getting document: {str(e)}")
        return jsonify({'error': 'Failed to get document'}), 500

@documents_bp.route('/', methods=['GET'])
@require_auth
def list_documents(user):
    """List user's documents"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        documents = Document.query.filter_by(user_id=user.id)\
            .order_by(Document.uploaded_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'documents': [doc.to_dict() for doc in documents.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': documents.total,
                'pages': documents.pages
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        return jsonify({'error': 'Failed to list documents'}), 500

@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@require_auth
def delete_document(user, document_id):
    """Delete a document"""
    try:
        document = Document.query.filter_by(id=document_id, user_id=user.id).first()
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        # Delete files
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        if document.output_path and os.path.exists(document.output_path):
            os.remove(document.output_path)
        
        # Delete from database
        db.session.delete(document)
        db.session.commit()
        
        return jsonify({'message': 'Document deleted successfully'})
        
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        return jsonify({'error': 'Failed to delete document'}), 500
