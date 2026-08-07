CREATE DATABASE IF NOT EXISTS basketball_camp_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS basketball_camp_dev.courses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  level VARCHAR(64) NOT NULL,
  coach_name VARCHAR(120) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  seats_available INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO basketball_camp_dev.courses
  (name, level, coach_name, price, seats_available)
VALUES
  ('U12 Ball Handling Lab', 'Beginner', 'Coach Miller', 299.00, 8),
  ('Shooting Form Builder', 'Intermediate', 'Coach Lee', 349.00, 5),
  ('Elite Footwork Camp', 'Advanced', 'Coach Carter', 399.00, 0);
