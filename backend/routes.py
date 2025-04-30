from flask import Blueprint, request, jsonify
from backend.app import app, db
from backend.models import User, Student, Module, Question, Progress
from werkzeug.security import generate_password_hash, check_password_hash
import os

api = Blueprint('api', __name__)

# User registration (teacher)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'error': 'Missing fields'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    password_hash = generate_password_hash(password)
    user = User(username=username, password_hash=password_hash, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

# User login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # For simplicity, return user info (token-based auth can be added later)
    return jsonify({'username': user.username, 'role': user.role})

# Get all students (for teacher)
@app.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    result = []
    for s in students:
        result.append({
            'id': s.id,
            'username': s.username,
            'grade': s.grade,
            'approved': s.approved
        })
    return jsonify(result)

# Register student (adds to registration requests)
@app.route('/api/students/register', methods=['POST'])
def register_student():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    grade = data.get('grade')

    if not username or not password or not grade:
        return jsonify({'error': 'Missing fields'}), 400

    if Student.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    password_hash = generate_password_hash(password)
    student = Student(username=username, password_hash=password_hash, grade=grade, approved=False)
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'Student registration request submitted'})

# Approve student registration (teacher)
@app.route('/api/students/approve/<int:student_id>', methods=['POST'])
def approve_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    student.approved = True
    db.session.commit()
    return jsonify({'message': 'Student approved'})

# Upload module
@app.route('/api/modules', methods=['POST'])
def upload_module():
    title = request.form.get('title')
    description = request.form.get('description')
    grade = request.form.get('grade')
    file = request.files.get('file')

    if not title or not description or not grade or not file:
        return jsonify({'error': 'Missing fields'}), 400

    # Save file to uploads directory
    uploads_dir = os.path.join(os.getcwd(), 'backend', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    module = Module(title=title, description=description, grade=grade, file_path=file_path)
    db.session.add(module)
    db.session.commit()
    return jsonify({'message': 'Module uploaded successfully', 'module_id': module.id})

# Get modules
@app.route('/api/modules', methods=['GET'])
def get_modules():
    modules = Module.query.all()
    result = []
    for m in modules:
        result.append({
            'id': m.id,
            'title': m.title,
            'description': m.description,
            'grade': m.grade,
            'file_url': '/api/modules/file/' + str(m.id)
        })
    return jsonify(result)

# Serve module file
@app.route('/api/modules/file/<int:module_id>', methods=['GET'])
def serve_module_file(module_id):
    module = Module.query.get(module_id)
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    return app.send_static_file(module.file_path)

# Add question to module
@app.route('/api/modules/<int:module_id>/questions', methods=['POST'])
def add_question(module_id):
    module = Module.query.get(module_id)
    if not module:
        return jsonify({'error': 'Module not found'}), 404

    data = request.json
    text = data.get('text')
    answer = data.get('answer')
    hint = data.get('hint')

    if not text or not answer:
        return jsonify({'error': 'Missing fields'}), 400

    question = Question(module_id=module_id, text=text, answer=answer, hint=hint)
    db.session.add(question)
    db.session.commit()
    return jsonify({'message': 'Question added'})

# Get questions for module
@app.route('/api/modules/<int:module_id>/questions', methods=['GET'])
def get_questions(module_id):
    questions = Question.query.filter_by(module_id=module_id).all()
    result = []
    for q in questions:
        result.append({
            'id': q.id,
            'text': q.text,
            'answer': q.answer,
            'hint': q.hint
        })
    return jsonify(result)
