import datetime
import jwt
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from backend.app.database import db
from backend.app.models import AdminUser, Project, Skill, ContactMessage

api = Blueprint('api', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = db.session.get(AdminUser, data['id'])
            if not current_user:
                return jsonify({'message': 'Invalid user token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        # Call the original function passing current_user as the first argument
        return f(current_user, *args, **kwargs)
        
    return decorated

# --- AUTH ROUTES ---

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required!'}), 400
        
    user = AdminUser.query.filter_by(username=data.get('username')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Invalid credentials!'}), 401
        
    # Generate JWT Token (valid for 24 hours)
    token = jwt.encode({
        'id': user.id,
        'username': user.username,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'username': user.username
    }), 200

@api.route('/auth/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    return jsonify({
        'status': 'valid',
        'username': current_user.username
    }), 200


# --- PROJECT ROUTES ---

@api.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.order_by(Project.display_order.asc(), Project.id.asc()).all()
    return jsonify([p.to_dict() for p in projects]), 200

@api.route('/projects', methods=['POST'])
@token_required
def add_project(current_user):
    data = request.get_json()
    if not data or not data.get('name') or not data.get('bio') or not data.get('img'):
        return jsonify({'message': 'Name, bio, and img are required!'}), 400
        
    new_project = Project(
        name=data.get('name'),
        bio=data.get('bio'),
        img=data.get('img'),
        previewLink=data.get('previewLink'),
        codeLink=data.get('codeLink'),
        display_order=data.get('display_order', 0)
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@api.route('/projects/<int:project_id>', methods=['PUT'])
@token_required
def update_project(current_user, project_id):
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'message': 'Project not found!'}), 404
        
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided!'}), 400
        
    project.name = data.get('name', project.name)
    project.bio = data.get('bio', project.bio)
    project.img = data.get('img', project.img)
    project.previewLink = data.get('previewLink', project.previewLink)
    project.codeLink = data.get('codeLink', project.codeLink)
    project.display_order = data.get('display_order', project.display_order)
    
    db.session.commit()
    return jsonify(project.to_dict()), 200

@api.route('/projects/<int:project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'message': 'Project not found!'}), 404
        
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully!'}), 200


# --- SKILL ROUTES ---

@api.route('/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.order_by(Skill.display_order.asc(), Skill.id.asc()).all()
    return jsonify([s.to_dict() for s in skills]), 200

@api.route('/skills', methods=['POST'])
@token_required
def add_skill(current_user):
    data = request.get_json()
    if not data or not data.get('name') or not data.get('category'):
        return jsonify({'message': 'Name and category are required!'}), 400
        
    new_skill = Skill(
        name=data.get('name'),
        category=data.get('category'),
        icon_class=data.get('icon_class'),
        display_order=data.get('display_order', 0)
    )
    db.session.add(new_skill)
    db.session.commit()
    return jsonify(new_skill.to_dict()), 201

@api.route('/skills/<int:skill_id>', methods=['PUT'])
@token_required
def update_skill(current_user, skill_id):
    skill = db.session.get(Skill, skill_id)
    if not skill:
        return jsonify({'message': 'Skill not found!'}), 404
        
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided!'}), 400
        
    skill.name = data.get('name', skill.name)
    skill.category = data.get('category', skill.category)
    skill.icon_class = data.get('icon_class', skill.icon_class)
    skill.display_order = data.get('display_order', skill.display_order)
    
    db.session.commit()
    return jsonify(skill.to_dict()), 200

@api.route('/skills/<int:skill_id>', methods=['DELETE'])
@token_required
def delete_skill(current_user, skill_id):
    skill = db.session.get(Skill, skill_id)
    if not skill:
        return jsonify({'message': 'Skill not found!'}), 404
        
    db.session.delete(skill)
    db.session.commit()
    return jsonify({'message': 'Skill deleted successfully!'}), 200


# --- CONTACT ROUTES ---

@api.route('/contact', methods=['POST'])
def create_message():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'message': 'Name, email, and message are required!'}), 400
        
    new_message = ContactMessage(
        name=data.get('name'),
        email=data.get('email'),
        message=data.get('message')
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'Message sent successfully!'}), 201

@api.route('/contact', methods=['GET'])
@token_required
def get_messages(current_user):
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([m.to_dict() for m in messages]), 200

@api.route('/contact/<int:msg_id>', methods=['DELETE'])
@token_required
def delete_message(current_user, msg_id):
    msg = db.session.get(ContactMessage, msg_id)
    if not msg:
        return jsonify({'message': 'Message not found!'}), 404
        
    db.session.delete(msg)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully!'}), 200

@api.route('/contact/<int:msg_id>/read', methods=['PUT'])
@token_required
def mark_message_read(current_user, msg_id):
    msg = db.session.get(ContactMessage, msg_id)
    if not msg:
        return jsonify({'message': 'Message not found!'}), 404
        
    data = request.get_json()
    msg.read = data.get('read', True)
    db.session.commit()
    return jsonify(msg.to_dict()), 200
