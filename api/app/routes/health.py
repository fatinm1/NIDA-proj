from flask import Blueprint, jsonify
import os

health_bp = Blueprint('health', __name__)

@health_bp.route('/healthz', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@health_bp.route('/debug', methods=['GET'])
def debug_info():
    """Debug endpoint to check configuration without exposing sensitive data"""
    api_key = os.getenv('OPENAI_API_KEY')
    
    # Check if we're in mock mode
    is_mock_mode = not api_key or api_key == 'mock-key-for-development'
    
    return jsonify({
        'status': 'ok',
        'openai_mode': 'mock' if is_mock_mode else 'real',
        'api_key_set': bool(api_key),
        'api_key_is_mock': api_key == 'mock-key-for-development' if api_key else True
    })
