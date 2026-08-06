# Basketball Camp 数据库设计与测试数据

> 技术栈：MySQL  
> 适用范围：Basketball Camp Web 前端从 Mock 数据切换为真实后端数据。  
> 说明：本文只做数据库设计和测试数据设计，不包含 .NET C# 后端代码。

## 1. 设计原则

- 使用 `BIGINT` 自增主键作为内部 ID。
- 对外展示编号使用业务编码，例如 `C-101`、`CL-201`、`BC-1024`、`V-3001`。
- 所有核心业务表保留 `created_at`、`updated_at`。
- 状态字段使用 `VARCHAR`，便于先快速开发；后续可沉淀为字典表或枚举。
- 金额字段使用 `DECIMAL(10,2)`。
- 视频、AI、报告相关数据分层保存：视频上传记录、AI 分析任务、AI 分析结果、教练复核报告。

## 2. 表关系概览

| 模块 | 核心表 |
|---|---|
| 机构与账号 | `organizations`, `users`, `roles`, `user_roles`, `permissions`, `role_permissions` |
| 学员与家长 | `students`, `parent_student_links` |
| 教练 | `coaches` |
| 课程与班级 | `courses`, `courts`, `classes`, `class_sessions`, `class_students` |
| 报名与支付 | `enrollments`, `orders`, `payments` |
| 点名 | `attendance_records` |
| 训练任务 | `training_task_templates`, `training_tasks`, `training_task_assignments` |
| 视频与 AI | `video_uploads`, `ai_analysis_jobs`, `ai_analysis_reports`, `ai_report_metrics`, `ai_report_suggestions` |
| 教练标注与反馈 | `coach_annotations`, `feedback_reports` |
| 成长趋势 | `growth_metric_records` |
| 通知与设置 | `notifications`, `system_settings` |

## 3. 建表 SQL

```sql
CREATE DATABASE IF NOT EXISTS basketball_camp
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE basketball_camp;

CREATE TABLE organizations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/New_York',
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40),
  avatar_url VARCHAR(500),
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  last_login_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_org (organization_id),
  CONSTRAINT fk_users_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(40) NOT NULL,
  name VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_roles_code (code)
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(120) NOT NULL,
  module VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_permissions_code (code)
);

CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  user_id BIGINT,
  student_code VARCHAR(40) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  age_group VARCHAR(40),
  emergency_contact VARCHAR(80),
  video_consent_status VARCHAR(30) NOT NULL DEFAULT 'Active',
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_students_code (student_code),
  KEY idx_students_org (organization_id),
  CONSTRAINT fk_students_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE parent_student_links (
  parent_user_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  relationship VARCHAR(40) NOT NULL DEFAULT 'Parent',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (parent_user_id, student_id),
  CONSTRAINT fk_parent_student_parent FOREIGN KEY (parent_user_id) REFERENCES users(id),
  CONSTRAINT fk_parent_student_student FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE coaches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  coach_code VARCHAR(40) NOT NULL,
  specialties VARCHAR(500),
  available_courts VARCHAR(300),
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_coaches_code (coach_code),
  CONSTRAINT fk_coaches_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_coaches_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE courts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  name VARCHAR(80) NOT NULL,
  location VARCHAR(160),
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_courts_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  course_code VARCHAR(40) NOT NULL,
  name VARCHAR(160) NOT NULL,
  level VARCHAR(40) NOT NULL,
  age_group VARCHAR(40),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_courses_code (course_code),
  KEY idx_courses_status (status),
  CONSTRAINT fk_courses_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE classes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  coach_id BIGINT NOT NULL,
  court_id BIGINT,
  class_code VARCHAR(40) NOT NULL,
  name VARCHAR(160) NOT NULL,
  schedule_text VARCHAR(160),
  start_date DATE,
  end_date DATE,
  capacity INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_classes_code (class_code),
  CONSTRAINT fk_classes_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_classes_course FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_classes_coach FOREIGN KEY (coach_id) REFERENCES coaches(id),
  CONSTRAINT fk_classes_court FOREIGN KEY (court_id) REFERENCES courts(id)
);

CREATE TABLE class_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  coach_id BIGINT NOT NULL,
  court_id BIGINT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_class_sessions_date (session_date),
  CONSTRAINT fk_class_sessions_class FOREIGN KEY (class_id) REFERENCES classes(id),
  CONSTRAINT fk_class_sessions_coach FOREIGN KEY (coach_id) REFERENCES coaches(id),
  CONSTRAINT fk_class_sessions_court FOREIGN KEY (court_id) REFERENCES courts(id)
);

CREATE TABLE class_students (
  class_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (class_id, student_id),
  CONSTRAINT fk_class_students_class FOREIGN KEY (class_id) REFERENCES classes(id),
  CONSTRAINT fk_class_students_student FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  enrollment_code VARCHAR(40) NOT NULL,
  student_id BIGINT NOT NULL,
  parent_user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  class_id BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_enrollments_code (enrollment_code),
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_enrollments_parent FOREIGN KEY (parent_user_id) REFERENCES users(id),
  CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(40) NOT NULL,
  enrollment_id BIGINT NOT NULL,
  family_name VARCHAR(120) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  order_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_orders_no (order_no),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'Stripe',
  provider_payment_id VARCHAR(120),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL,
  paid_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE attendance_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_session_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL,
  note VARCHAR(500),
  checked_by BIGINT,
  checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_attendance_session_student (class_session_id, student_id),
  CONSTRAINT fk_attendance_session FOREIGN KEY (class_session_id) REFERENCES class_sessions(id),
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_attendance_checked_by FOREIGN KEY (checked_by) REFERENCES users(id)
);

CREATE TABLE training_task_templates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  title VARCHAR(160) NOT NULL,
  drill_type VARCHAR(80) NOT NULL,
  default_requirement VARCHAR(300),
  default_instruction TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_templates_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE training_tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  template_id BIGINT,
  class_id BIGINT NOT NULL,
  assigned_by BIGINT NOT NULL,
  title VARCHAR(160) NOT NULL,
  requirement VARCHAR(300),
  instruction TEXT,
  due_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'Assigned',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_training_tasks_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_training_tasks_template FOREIGN KEY (template_id) REFERENCES training_task_templates(id),
  CONSTRAINT fk_training_tasks_class FOREIGN KEY (class_id) REFERENCES classes(id),
  CONSTRAINT fk_training_tasks_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id)
);

CREATE TABLE training_task_assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  training_task_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  submit_status VARCHAR(30) NOT NULL DEFAULT 'Not Submitted',
  coach_status VARCHAR(30) NOT NULL DEFAULT 'Assigned',
  ai_status VARCHAR(40) NOT NULL DEFAULT 'Not Submitted',
  submitted_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_task_assignment_student (training_task_id, student_id),
  CONSTRAINT fk_task_assignments_task FOREIGN KEY (training_task_id) REFERENCES training_tasks(id),
  CONSTRAINT fk_task_assignments_student FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE video_uploads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_code VARCHAR(40) NOT NULL,
  task_assignment_id BIGINT,
  student_id BIGINT NOT NULL,
  uploaded_by BIGINT NOT NULL,
  drill_title VARCHAR(160) NOT NULL,
  file_url VARCHAR(600),
  thumbnail_url VARCHAR(600),
  upload_status VARCHAR(40) NOT NULL DEFAULT 'Processing',
  duration_seconds INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_video_code (video_code),
  CONSTRAINT fk_video_task_assignment FOREIGN KEY (task_assignment_id) REFERENCES training_task_assignments(id),
  CONSTRAINT fk_video_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_video_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE ai_analysis_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id BIGINT NOT NULL,
  engine VARCHAR(40) NOT NULL DEFAULT 'MMPose',
  status VARCHAR(40) NOT NULL DEFAULT 'Waiting',
  confidence DECIMAL(5,2),
  error_message VARCHAR(1000),
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_jobs_video FOREIGN KEY (video_id) REFERENCES video_uploads(id)
);

CREATE TABLE ai_analysis_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id BIGINT NOT NULL,
  ai_job_id BIGINT NOT NULL,
  title VARCHAR(160) NOT NULL,
  overall_score INT,
  summary TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'AI Draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_reports_video FOREIGN KEY (video_id) REFERENCES video_uploads(id),
  CONSTRAINT fk_ai_reports_job FOREIGN KEY (ai_job_id) REFERENCES ai_analysis_jobs(id)
);

CREATE TABLE ai_report_metrics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ai_report_id BIGINT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value VARCHAR(100) NOT NULL,
  metric_unit VARCHAR(40),
  trend_text VARCHAR(160),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_metrics_report FOREIGN KEY (ai_report_id) REFERENCES ai_analysis_reports(id)
);

CREATE TABLE ai_report_suggestions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ai_report_id BIGINT NOT NULL,
  suggestion_text TEXT NOT NULL,
  visibility_status VARCHAR(40) NOT NULL DEFAULT 'Pending Coach Review',
  coach_decision VARCHAR(40) NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_suggestions_report FOREIGN KEY (ai_report_id) REFERENCES ai_analysis_reports(id)
);

CREATE TABLE coach_annotations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id BIGINT NOT NULL,
  coach_id BIGINT NOT NULL,
  timestamp_seconds INT NOT NULL,
  marker_type VARCHAR(80) NOT NULL,
  guidance TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_annotations_video FOREIGN KEY (video_id) REFERENCES video_uploads(id),
  CONSTRAINT fk_annotations_coach FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE feedback_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  report_code VARCHAR(40) NOT NULL,
  ai_report_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  coach_id BIGINT NOT NULL,
  title VARCHAR(160) NOT NULL,
  final_note TEXT,
  coach_status VARCHAR(40) NOT NULL DEFAULT 'Draft',
  family_status VARCHAR(40) NOT NULL DEFAULT 'Not visible',
  published_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_feedback_report_code (report_code),
  CONSTRAINT fk_feedback_ai_report FOREIGN KEY (ai_report_id) REFERENCES ai_analysis_reports(id),
  CONSTRAINT fk_feedback_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_feedback_coach FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE growth_metric_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,2),
  metric_unit VARCHAR(40),
  trend_text VARCHAR(160),
  recorded_date DATE NOT NULL,
  source_report_id BIGINT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_growth_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_growth_report FOREIGN KEY (source_report_id) REFERENCES feedback_reports(id)
);

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(160) NOT NULL,
  message VARCHAR(500) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Unread',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE system_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT NOT NULL,
  setting_key VARCHAR(100) NOT NULL,
  setting_value VARCHAR(1000) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_settings_org_key (organization_id, setting_key),
  CONSTRAINT fk_settings_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

## 4. 测试数据 SQL

```sql
USE basketball_camp;

INSERT INTO organizations (id, name, currency, timezone, status) VALUES
(1, 'Basketball Camp Academy', 'USD', 'America/New_York', 'Active');

INSERT INTO roles (id, code, name) VALUES
(1, 'student', 'Student / Parent'),
(2, 'coach', 'Coach'),
(3, 'admin', 'Administrator');

INSERT INTO users (id, organization_id, email, password_hash, full_name, phone, status) VALUES
(1, 1, 'alex@example.com', 'TEST_HASH_ONLY', 'Alex Morgan', '+1 555 0101', 'Active'),
(2, 1, 'dana@example.com', 'TEST_HASH_ONLY', 'Dana Morgan', '+1 555 0134', 'Active'),
(3, 1, 'coach@example.com', 'TEST_HASH_ONLY', 'Coach Miller', '+1 555 0201', 'Active'),
(4, 1, 'coach.lee@example.com', 'TEST_HASH_ONLY', 'Coach Lee', '+1 555 0202', 'Active'),
(5, 1, 'admin@example.com', 'TEST_HASH_ONLY', 'Taylor Admin', '+1 555 0301', 'Active'),
(6, 1, 'mia@example.com', 'TEST_HASH_ONLY', 'Mia Chen', '+1 555 0102', 'Active'),
(7, 1, 'noah@example.com', 'TEST_HASH_ONLY', 'Noah Brooks', '+1 555 0103', 'Active'),
(8, 1, 'sofia@example.com', 'TEST_HASH_ONLY', 'Sofia Rivera', '+1 555 0104', 'Active'),
(9, 1, 'ethan@example.com', 'TEST_HASH_ONLY', 'Ethan Patel', '+1 555 0105', 'Active');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3), (6, 1), (7, 1), (8, 1), (9, 1);

INSERT INTO permissions (id, code, name, module) VALUES
(1, 'courses.view', 'View Courses', 'Courses'),
(2, 'courses.manage', 'Manage Courses', 'Courses'),
(3, 'attendance.manage', 'Manage Attendance', 'Attendance'),
(4, 'ai.review', 'Review AI Drafts', 'AI Review'),
(5, 'payments.manage', 'Manage Payments', 'Payments'),
(6, 'reports.view', 'View Reports', 'Reports'),
(7, 'reports.manage', 'Manage Reports', 'Reports'),
(8, 'settings.manage', 'Manage System Settings', 'Settings');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 6),
(2, 1), (2, 3), (2, 4), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8);

INSERT INTO students (id, organization_id, user_id, student_code, full_name, age_group, emergency_contact, video_consent_status, status) VALUES
(1, 1, 1, 'S-1001', 'Alex Morgan', 'U12', '+1 555 0134', 'Active', 'Active'),
(2, 1, 6, 'S-1002', 'Mia Chen', 'U12', '+1 555 0140', 'Active', 'Active'),
(3, 1, 7, 'S-1003', 'Noah Brooks', 'U14', '+1 555 0141', 'Active', 'Needs follow-up'),
(4, 1, 8, 'S-1004', 'Sofia Rivera', 'U14', '+1 555 0142', 'Active', 'Active'),
(5, 1, 9, 'S-1005', 'Ethan Patel', 'U16', '+1 555 0143', 'Active', 'Alert');

INSERT INTO parent_student_links (parent_user_id, student_id, relationship, is_primary) VALUES
(2, 1, 'Parent', TRUE);

INSERT INTO coaches (id, organization_id, user_id, coach_code, specialties, available_courts, status) VALUES
(1, 1, 3, 'CO-201', 'Ball handling, youth development, layup footwork', 'Court A, Court B', 'Active'),
(2, 1, 4, 'CO-202', 'Shooting form, free throw rhythm', 'Court B', 'Active');

INSERT INTO courts (id, organization_id, name, location, status) VALUES
(1, 1, 'Court A', 'Main Gym', 'Active'),
(2, 1, 'Court B', 'Main Gym', 'Active'),
(3, 1, 'Court C', 'Training Center', 'Active');

INSERT INTO courses (id, organization_id, course_code, name, level, age_group, description, price, capacity, status) VALUES
(1, 1, 'C-101', 'U12 Ball Handling Lab', 'Beginner', 'U12', 'Foundational ball control and footwork.', 299.00, 24, 'Open'),
(2, 1, 'C-102', 'Shooting Form Builder', 'Intermediate', 'U14', 'Shooting mechanics and release consistency.', 349.00, 20, 'Open'),
(3, 1, 'C-103', 'Elite Footwork Camp', 'Advanced', 'U16', 'Advanced footwork and game-speed movement.', 399.00, 20, 'Waitlist');

INSERT INTO classes (id, organization_id, course_id, coach_id, court_id, class_code, name, schedule_text, start_date, end_date, capacity, status) VALUES
(1, 1, 1, 1, 1, 'CL-201', 'U12 Skills Development', 'Tue & Thu 5:30 PM', '2026-08-10', '2026-10-01', 24, 'Active'),
(2, 1, 2, 2, 2, 'CL-202', 'Shooting Lab Weekend', 'Sat 10:00 AM', '2026-08-15', '2026-10-03', 20, 'Open'),
(3, 1, 3, 1, 3, 'CL-203', 'Elite Footwork', 'Mon & Wed 6:00 PM', '2026-08-12', '2026-10-05', 20, 'Waitlist');

INSERT INTO class_students (class_id, student_id, status) VALUES
(1, 1, 'Active'), (1, 2, 'Active'), (2, 3, 'Active'), (2, 4, 'Active'), (3, 5, 'Active');

INSERT INTO class_sessions (id, class_id, coach_id, court_id, session_date, start_time, end_time, status) VALUES
(1, 1, 1, 1, '2026-08-06', '17:30:00', '18:30:00', 'Scheduled'),
(2, 2, 2, 2, '2026-08-08', '10:00:00', '11:30:00', 'Scheduled'),
(3, 3, 1, 3, '2026-08-10', '18:00:00', '19:30:00', 'Scheduled');

INSERT INTO enrollments (id, enrollment_code, student_id, parent_user_id, course_id, class_id, status) VALUES
(1, 'EN-1001', 1, 2, 1, 1, 'Paid'),
(2, 'EN-1002', 2, 2, 2, 2, 'Pending'),
(3, 'EN-1003', 3, 2, 3, 3, 'Failed');

INSERT INTO orders (id, order_no, enrollment_id, family_name, amount, discount_amount, currency, status, order_date) VALUES
(1, 'BC-1024', 1, 'Morgan Family', 279.00, 20.00, 'USD', 'Paid', '2026-08-06'),
(2, 'BC-1025', 2, 'Chen Family', 349.00, 0.00, 'USD', 'Pending', '2026-08-05'),
(3, 'BC-1026', 3, 'Brooks Family', 399.00, 0.00, 'USD', 'Failed', '2026-08-04');

INSERT INTO payments (order_id, provider, provider_payment_id, amount, status, paid_at) VALUES
(1, 'Stripe', 'pi_test_1024', 279.00, 'Paid', '2026-08-06 10:20:00'),
(2, 'Stripe', NULL, 349.00, 'Pending', NULL),
(3, 'Stripe', 'pi_test_1026', 399.00, 'Failed', NULL);

INSERT INTO attendance_records (class_session_id, student_id, status, note, checked_by) VALUES
(1, 1, 'Present', NULL, 3),
(1, 2, 'Present', NULL, 3),
(2, 3, 'Late', 'Arrived after warmup.', 4),
(2, 4, 'Present', NULL, 4),
(3, 5, 'Absent', 'Makeup needed.', 3);

INSERT INTO training_task_templates (id, organization_id, title, drill_type, default_requirement, default_instruction, status) VALUES
(1, 1, 'Layup footwork sequence', 'Footwork', 'Video required', 'Record from the side. Keep both feet visible before takeoff.', 'Active'),
(2, 1, 'Shooting release angle', 'Shooting', 'Video required', 'Record the full shooting motion from the front.', 'Active'),
(3, 1, 'Dribble control ladder', 'Ball Handling', '3 sets', 'Use both hands and keep the ball below waist height.', 'Active');

INSERT INTO training_tasks (id, organization_id, template_id, class_id, assigned_by, title, requirement, instruction, due_date, status) VALUES
(1, 1, 1, 1, 3, 'Layup footwork, 5 attempts', 'Video required', 'Record from the right side.', '2026-08-15', 'Assigned'),
(2, 1, 3, 1, 3, 'Left-hand dribble ladder', '3 sets', 'Complete 3 controlled sets.', '2026-08-17', 'Assigned'),
(3, 1, 2, 2, 4, 'Free throw release rhythm', 'AI analyzed', 'Upload 10 free throws.', '2026-08-06', 'Coach reviewed');

INSERT INTO training_task_assignments (id, training_task_id, student_id, submit_status, coach_status, ai_status, submitted_at) VALUES
(1, 1, 1, 'In Progress', 'Assigned', 'Ready for upload', NULL),
(2, 2, 1, 'Not Submitted', 'Assigned', 'Not submitted', NULL),
(3, 3, 2, 'Submitted', 'Coach reviewed', 'AI draft ready', '2026-08-06 15:00:00');

INSERT INTO video_uploads (id, video_code, task_assignment_id, student_id, uploaded_by, drill_title, file_url, thumbnail_url, upload_status, duration_seconds) VALUES
(1, 'V-3001', 3, 2, 6, 'Free Throw Set Point', '/videos/V-3001.mp4', '/thumbs/V-3001.jpg', 'Uploaded', 38),
(2, 'V-3002', 1, 1, 1, 'Layup Footwork', '/videos/V-3002.mp4', '/thumbs/V-3002.jpg', 'Uploaded', 42),
(3, 'V-3003', NULL, 3, 7, 'Release Angle', '/videos/V-3003.mp4', '/thumbs/V-3003.jpg', 'Processing', 31);

INSERT INTO ai_analysis_jobs (id, video_id, engine, status, confidence, started_at, completed_at) VALUES
(1, 1, 'MMPose', 'Analyzing', 88.50, '2026-08-06 15:05:00', NULL),
(2, 2, 'MMPose', 'Draft Ready', 91.00, '2026-08-06 15:10:00', '2026-08-06 15:16:00'),
(3, 3, 'MMPose', 'Waiting', NULL, NULL, NULL);

INSERT INTO ai_analysis_reports (id, video_id, ai_job_id, title, overall_score, summary, status) VALUES
(1, 2, 2, 'Layup Footwork Review', 82, 'Approach speed improved while takeoff timing needs confirmation.', 'AI Draft'),
(2, 1, 1, 'Free Throw Set Point', 78, 'Release height is improving, elbow angle needs coach review.', 'Needs Coach Review');

INSERT INTO ai_report_metrics (ai_report_id, metric_name, metric_value, metric_unit, trend_text) VALUES
(1, 'Approach Speed', '+12', 'percent', '+12% vs baseline'),
(1, 'Body Balance', '82', 'score', 'Stable in 4 of 5 attempts'),
(2, 'Elbow Angle', '73', 'degree', 'Needs lift'),
(2, 'Release Height', '+8', 'percent', '+8% arc');

INSERT INTO ai_report_suggestions (ai_report_id, suggestion_text, visibility_status, coach_decision) VALUES
(1, 'Plant the outside foot earlier before takeoff.', 'Pending Coach Review', 'Pending'),
(2, 'Raise elbow before release and hold follow-through longer.', 'Pending Coach Review', 'Pending');

INSERT INTO coach_annotations (video_id, coach_id, timestamp_seconds, marker_type, guidance) VALUES
(2, 1, 14, 'Footwork', 'Plant the outside foot earlier and keep shoulders square to the basket.'),
(1, 2, 9, 'Shooting', 'Keep the guide hand steady and finish with a higher hold.');

INSERT INTO feedback_reports (id, report_code, ai_report_id, student_id, coach_id, title, final_note, coach_status, family_status, published_at) VALUES
(1, 'R-4001', 1, 1, 1, 'Layup Footwork Review', 'Good progress. Keep the plant foot stable before takeoff.', 'Published', 'Viewed', '2026-08-06 18:00:00'),
(2, 'R-4002', 2, 2, 2, 'Free Throw Set Point', 'Draft hidden until coach confirms elbow guidance.', 'Draft Hidden', 'Not visible', NULL);

INSERT INTO growth_metric_records (student_id, metric_name, metric_value, metric_unit, trend_text, recorded_date, source_report_id) VALUES
(1, 'Balance', 14.00, 'percent', '+14% balance', '2026-08-06', 1),
(1, 'Shooting Arc', 11.00, 'percent', '+11% arc', '2026-08-01', 1),
(2, 'Release Height', 8.00, 'percent', '+8% arc', '2026-08-06', 2);

INSERT INTO notifications (user_id, title, message, status) VALUES
(1, 'Coach feedback published', 'Your layup footwork report is ready.', 'Unread'),
(3, 'AI draft ready', 'Alex Morgan has a new AI draft for review.', 'Unread'),
(5, 'Payment failed', 'Order BC-1026 needs follow-up.', 'Unread');

INSERT INTO system_settings (organization_id, setting_key, setting_value) VALUES
(1, 'organizationName', 'Basketball Camp Academy'),
(1, 'defaultCurrency', 'USD'),
(1, 'reportReviewPolicy', 'Coach approval required before publish'),
(1, 'hideAiSuggestionsUntilCoachApproval', 'true'),
(1, 'parentConsentRequiredForVideoUpload', 'true');
```

## 5. 前端 Mock 字段对应关系

| 前端 Mock | 后端表 |
|---|---|
| `courses` | `courses`, `classes`, `coaches` |
| `students` | `students`, `class_students`, `attendance_records`, `growth_metric_records` |
| `tasks` | `training_tasks`, `training_task_assignments` |
| `reports` | `ai_analysis_reports`, `feedback_reports`, `growth_metric_records` |
| `enrollments` | `enrollments`, `orders`, `payments` |
| `videoQueue` | `video_uploads`, `ai_analysis_jobs`, `ai_analysis_reports` |
| `roleMenus` | 前端可保留；若动态权限化，则来自 `permissions`, `role_permissions` |
| 登录 Mock Token | `users`, `roles`, `user_roles` |
