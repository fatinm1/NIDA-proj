import logging
from flask import Blueprint, request, jsonify
from app.models import ProcessingRule, User, UserRole
from app import db
from functools import wraps

logger = logging.getLogger(__name__)
rules_bp = Blueprint('rules', __name__)

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        # For demo purposes, create mock users
        if user_id == '1':
            user = type('MockUser', (), {'id': 1, 'role': 'admin'})()
        elif user_id == '2':
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

@rules_bp.route('/', methods=['GET'])
@require_auth
def list_rules(user):
    """List processing rules - users see global rules, admins see all"""
    try:
        if user.role == 'admin':
            # Admins see all rules
            rules = ProcessingRule.query.filter_by(is_active=True).all()
        else:
            # Regular users only see global rules created by admins
            rules = ProcessingRule.query.filter_by(is_active=True, is_global=True).all()
        
        return jsonify({
            'rules': [rule.to_dict() for rule in rules],
            'user_role': user.role
        })
        
    except Exception as e:
        logger.error(f"Error listing rules: {str(e)}")
        return jsonify({'error': 'Failed to list rules'}), 500

@rules_bp.route('/', methods=['POST'])
@require_admin
def create_rule(user):
    """Create a new processing rule - admin only"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('instruction') or not data.get('category'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create the rule
        rule = ProcessingRule(
            user_id=user.id,
            name=data['name'],
            instruction=data['instruction'],
            category=data['category'],
            is_active=data.get('is_active', True),
            is_global=data.get('is_global', True)  # Admin rules are global by default
        )
        
        db.session.add(rule)
        db.session.commit()
        
        return jsonify({
            'message': 'Rule created successfully',
            'rule': rule.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating rule: {str(e)}")
        return jsonify({'error': 'Failed to create rule'}), 500

@rules_bp.route('/<int:rule_id>', methods=['GET'])
@require_auth
def get_rule(user, rule_id):
    """Get a specific rule - users can only see global rules"""
    try:
        rule = ProcessingRule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        
        # Check access - users can only see global rules
        if user.role != 'admin' and not rule.is_global:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({'rule': rule.to_dict()})
        
    except Exception as e:
        logger.error(f"Error getting rule: {str(e)}")
        return jsonify({'error': 'Failed to get rule'}), 500

@rules_bp.route('/<int:rule_id>', methods=['PUT'])
@require_admin
def update_rule(user, rule_id):
    """Update a rule - admin only"""
    try:
        rule = ProcessingRule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            rule.name = data['name']
        if 'instruction' in data:
            rule.instruction = data['instruction']
        if 'category' in data:
            rule.category = data['category']
        if 'is_active' in data:
            rule.is_active = data['is_active']
        if 'is_global' in data:
            rule.is_global = data['is_global']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Rule updated successfully',
            'rule': rule.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Error updating rule: {str(e)}")
        return jsonify({'error': 'Failed to update rule'}), 500

@rules_bp.route('/<int:rule_id>', methods=['DELETE'])
@require_admin
def delete_rule(user, rule_id):
    """Delete a rule - admin only"""
    try:
        rule = ProcessingRule.query.get(rule_id)
        if not rule:
            return jsonify({'error': 'Rule not found'}), 404
        
        db.session.delete(rule)
        db.session.commit()
        
        return jsonify({'message': 'Rule deleted successfully'})
        
    except Exception as e:
        logger.error(f"Error deleting rule: {str(e)}")
        return jsonify({'error': 'Failed to delete rule'}), 500

@rules_bp.route('/categories', methods=['GET'])
@require_auth
def get_categories(user):
    """Get available rule categories"""
    categories = [
        {'value': 'term', 'label': 'Term Duration', 'description': 'Time-based terms and conditions'},
        {'value': 'parties', 'label': 'Parties', 'description': 'Entity and party definitions'},
        {'value': 'firm', 'label': 'Firm Details', 'description': 'Company and firm information'},
        {'value': 'signature', 'label': 'Signature', 'description': 'Signature blocks and authority'},
        {'value': 'other', 'label': 'Other', 'description': 'General modifications and clauses'}
    ]
    
    return jsonify({'categories': categories})

@rules_bp.route('/templates', methods=['GET'])
@require_auth
def get_rule_templates(user):
    """Get rule templates - users see global templates, admins see all"""
    try:
        if user.role == 'admin':
            # Admins see all templates
            templates = ProcessingRule.query.filter_by(is_active=True, is_global=True).all()
        else:
            # Regular users see global templates
            templates = ProcessingRule.query.filter_by(is_active=True, is_global=True).all()
        
        template_list = [
            {
                'name': template.name,
                'instruction': template.instruction,
                'category': template.category,
                'description': f'Global rule: {template.instruction[:100]}...'
            }
            for template in templates
        ]
        
        return jsonify({'templates': template_list})
        
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        return jsonify({'error': 'Failed to get templates'}), 500
