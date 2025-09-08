create schema barberbook;
use barberbook;

-- ==========================================
-- BarberBook Database Schema
-- ==========================================

CREATE DATABASE IF NOT EXISTS barberbook;
USE barberbook;

-- ======================
-- Tabla: SALONS
-- ======================
CREATE TABLE salons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Tabla: USERS
-- ======================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
	mobile VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
);

-- ======================
-- Tabla: CLIENTS
-- ======================
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    mobile VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
);

-- ======================
-- Tabla: SERVICES
-- ======================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    duration_min INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
);

-- ======================
-- Tabla: APPOINTMENTS
-- ======================
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_min INT NOT NULL,
    client_id INT NOT NULL,
    employee_id INT,
    service_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'canceled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_by INT NOT NULL,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ======================
-- Indexes para optimizar búsquedas
-- ======================
CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_services_salon ON services(salon_id);
CREATE INDEX idx_appointments_salon ON appointments(salon_id);
CREATE INDEX idx_appointments_status ON appointments(status);