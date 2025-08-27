import logging
from flask import Blueprint, request, jsonify, current_app
from app import db
from functools import wraps

logger = logging.getLogger(__name__)
rules_bp = Blueprint('rules', __name__)

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
    """Decorator to require admin role"""
    def decorated_function(*args, **kwargs):
        # For demo purposes, create a mock user based on X-User-ID header
        user_id = request.headers.get('X-User-ID', '1')
        if user_id == '1':
            # Mock admin user
            class MockUser:
                id = 1
                role = 'ADMIN'
            user = MockUser()
        else:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(user, *args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@rules_bp.route('/', methods=['GET'])
@require_auth
def list_rules(user):
    ProcessingRule = current_app.ProcessingRule
    
    if user.role == 'ADMIN':
        # Admin can see all active rules
        rules = ProcessingRule.query.filter_by(is_active=True).all()
    else:
        # Regular users can only see active rules
        rules = ProcessingRule.query.filter_by(is_active=True).all()
    
    return jsonify({
        'rules': [rule.to_dict() for rule in rules]
    })

@rules_bp.route('/', methods=['POST'])
@require_admin
def create_rule(user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('instruction') or not data.get('category'):
        return jsonify({'error': 'Name, instruction, and category are required'}), 400
    
    ProcessingRule = current_app.ProcessingRule
    rule = ProcessingRule(
        user_id=user.id,
        name=data['name'],
        instruction=data['instruction'],
        category=data['category'],
        is_active=True
    )
    
    db.session.add(rule)
    db.session.commit()
    
    return jsonify({
        'message': 'Rule created successfully',
        'rule': rule.to_dict()
    }), 201

@rules_bp.route('/<int:rule_id>', methods=['GET'])
@require_auth
def get_rule(user, rule_id):
    ProcessingRule = current_app.ProcessingRule
    rule = ProcessingRule.query.get(rule_id)
    
    if not rule:
        return jsonify({'error': 'Rule not found'}), 404
    
    if not rule.is_active:
        return jsonify({'error': 'Rule not found'}), 404
    
    return jsonify({
        'rule': rule.to_dict()
    })

@rules_bp.route('/<int:rule_id>', methods=['PUT'])
@require_admin
def update_rule(user, rule_id):
    data = request.get_json()
    
    ProcessingRule = current_app.ProcessingRule
    rule = ProcessingRule.query.get(rule_id)
    
    if not rule:
        return jsonify({'error': 'Rule not found'}), 404
    
    if rule.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Update fields
    if 'name' in data:
        rule.name = data['name']
    if 'instruction' in data:
        rule.instruction = data['instruction']
    if 'category' in data:
        rule.category = data['category']
    if 'is_active' in data:
        rule.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Rule updated successfully',
        'rule': rule.to_dict()
    })

@rules_bp.route('/<int:rule_id>', methods=['DELETE'])
@require_admin
def delete_rule(user, rule_id):
    ProcessingRule = current_app.ProcessingRule
    rule = ProcessingRule.query.get(rule_id)
    
    if not rule:
        return jsonify({'error': 'Rule not found'}), 404
    
    if rule.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Hard delete the rule
    db.session.delete(rule)
    db.session.commit()
    
    return jsonify({'message': 'Rule deleted successfully'})

@rules_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get available rule categories"""
    categories = [
        'Term Modification',
        'Party Information',
        'Firm Details',
        'Signature Requirements',
        'Confidentiality',
        'Liability',
        'Other'
    ]
    
    return jsonify({'categories': categories})

@rules_bp.route('/templates', methods=['GET'])
def get_rule_templates():
    """Get rule templates for common scenarios"""
    templates = [
        {
            'name': 'Standard NDA Terms',
            'instruction': 'Ensure standard NDA terms are present and properly defined',
            'category': 'Term Modification'
        },
        {
            'name': 'Confidentiality Duration',
            'instruction': 'Verify confidentiality obligations extend for appropriate duration',
            'category': 'Confidentiality'
        },
        {
            'name': 'Liability Limitations',
            'instruction': 'Check for reasonable liability limitations and exclusions',
            'category': 'Liability'
        }
    ]
    
    return jsonify({'templates': templates})
