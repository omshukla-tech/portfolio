import sys
import os

# Add current directory to path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.app.database import db
from backend.app.models import AdminUser, Project, Skill

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing tables first to prevent constraint / duplicate clashes
        print("Clearing existing tables...")
        db.drop_all()
        db.create_all()

        # Create admin user from environment variables or local fallback
        print("Creating admin user...")
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        
        admin = AdminUser(username=admin_username)
        admin.set_password(admin_password)
        db.session.add(admin)
            
        # Seed Projects
        print("Seeding projects...")
        projects_data = [
            {
                "name": "Vlog Verse - Real-Time Blog Website",
                "bio": "A full-stack blogging platform built with Flask, SQLAlchemy, and PostgreSQL. Features secure user authentication, email OTP verification, password recovery, trending posts, a role-based admin panel, and an elegant glassmorphism UI.",
                "img": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
                "previewLink": "#",
                "codeLink": "https://github.com/omshukla-tech/vlog-verse",
                "display_order": 1
            },
            {
                "name": "Online Job Portal System",
                "bio": "A dual-interface platform for employers and job seekers built with Flask, SQLAlchemy, and PostgreSQL (Neon). Features secure Role-Based Access Control (RBAC), password hashing, resume uploads, advanced job filtering, and seamless deployment.",
                "img": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
                "previewLink": "#",
                "codeLink": "https://github.com/omshukla-tech/job-portal",
                "display_order": 2
            }
        ]
        for p_data in projects_data:
            proj = Project(**p_data)
            db.session.add(proj)
            
        # Seed Skills
        print("Seeding skills capabilities matrix...")
        skills_data = [
            # Languages
            {"name": "Python", "category": "primary", "icon_class": "fab fa-python", "display_order": 1},
            {"name": "JavaScript", "category": "primary", "icon_class": "fab fa-js", "display_order": 2},
            {"name": "SQL", "category": "primary", "icon_class": "fas fa-database", "display_order": 3},
            {"name": "C Language", "category": "primary", "icon_class": "fas fa-code", "display_order": 4},
            
            # Frontend
            {"name": "HTML5 & CSS3", "category": "secondary", "icon_class": "fab fa-html5", "display_order": 5},
            {"name": "Bootstrap", "category": "secondary", "icon_class": "fab fa-bootstrap", "display_order": 6},
            {"name": "React.js", "category": "secondary", "icon_class": "fab fa-react", "display_order": 7},
            
            # Backend & Databases
            {"name": "Flask & Jinja2", "category": "backend", "icon_class": "fas fa-server", "display_order": 8},
            {"name": "PostgreSQL", "category": "backend", "icon_class": "fas fa-database", "display_order": 9},
            {"name": "SQLite & MongoDB", "category": "backend", "icon_class": "fas fa-leaf", "display_order": 10},
            
            # Core Concepts
            {"name": "REST API Development", "category": "strength", "icon_class": "fas fa-project-diagram", "display_order": 11},
            {"name": "Authentication & Sessions", "category": "strength", "icon_class": "fas fa-user-lock", "display_order": 12},
            {"name": "CRUD Operations", "category": "strength", "icon_class": "fas fa-tasks", "display_order": 13},
            {"name": "Database Design & Security", "category": "strength", "icon_class": "fas fa-shield-alt", "display_order": 14},
            
            # Certifications
            {"name": "Google for Startups (Prompt to Prototype)", "category": "certification", "icon_class": "fab fa-google", "display_order": 15},
            {"name": "Deloitte Cyber Job Simulation", "category": "certification", "icon_class": "fas fa-user-shield", "display_order": 16},
            {"name": "Simplilearn Python for Beginners", "category": "certification", "icon_class": "fas fa-certificate", "display_order": 17}
        ]
        for s_data in skills_data:
            sk = Skill(**s_data)
            db.session.add(sk)
            
        db.session.commit()
        print("Database seeded with Om Shukla's professional resume datasets successfully!")

if __name__ == '__main__':
    seed_database()
