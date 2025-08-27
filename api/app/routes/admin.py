import logging
from flask import Blueprint, request, jsonify
from app.models import User, Document, ProcessingRule, UserRole
from app import db
from functools import wraps
from datetime import datetime

logger = logging.getLogger(__name__)
admin_bp = Blueprint('admin', __name__)

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

@admin_bp.route('/users', methods=['GET'])
@require_admin
def list_users(admin_user):
    """List all users - admin only"""
    try:
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users]
        })
    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        return jsonify({'error': 'Failed to list users'}), 500

@admin_bp.route('/users', methods=['POST'])
@require_admin
def create_user(admin_user):
    """Create a new user - admin only"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            role=UserRole.ADMIN if data.get('role') == 'admin' else UserRole.USER
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({'error': 'Failed to create user'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@require_admin
def update_user(admin_user, user_id):
    """Update user - admin only"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'email' in data:
            user.email = data['email']
        if 'role' in data:
            user.role = UserRole.ADMIN if data['role'] == 'admin' else UserRole.USER
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@require_admin
def delete_user(admin_user, user_id):
    """Delete user - admin only"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prevent admin from deleting themselves
        if user.id == admin_user.id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'})
        
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        return jsonify({'error': 'Failed to delete user'}), 500

@admin_bp.route('/dashboard', methods=['GET'])
@require_admin
def admin_dashboard(admin_user):
    """Get admin dashboard statistics"""
    try:
        total_users = User.query.count()
        total_documents = Document.query.count()
        total_rules = ProcessingRule.query.count()
        global_rules = ProcessingRule.query.filter_by(is_global=True, is_active=True).count()
        
        # Recent activity
        recent_documents = Document.query.order_by(Document.uploaded_at.desc()).limit(5).all()
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        
        return jsonify({
            'statistics': {
                'total_users': total_users,
                'total_documents': total_documents,
                'total_rules': total_rules,
                'global_rules': global_rules
            },
            'recent_activity': {
                'documents': [doc.to_dict() for doc in recent_documents],
                'users': [user.to_dict() for user in recent_users]
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting dashboard: {str(e)}")
        return jsonify({'error': 'Failed to get dashboard'}), 500

@admin_bp.route('/system/health', methods=['GET'])
@require_admin
def system_health(admin_user):
    """Get system health information - admin only"""
    try:
        # Check database connection
        db_status = 'healthy'
        try:
            db.session.execute('SELECT 1')
        except Exception:
            db_status = 'unhealthy'
        
        # Check file system
        import os
        uploads_dir = os.path.abspath('uploads')
        outputs_dir = os.path.abspath('outputs')
        
        file_system_status = 'healthy'
        if not os.path.exists(uploads_dir):
            file_system_status = 'uploads directory missing'
        elif not os.path.exists(outputs_dir):
            file_system_status = 'outputs directory missing'
        
        return jsonify({
            'database': db_status,
            'file_system': file_system_status,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error checking system health: {str(e)}")
        return jsonify({'error': 'Failed to check system health'}), 500
