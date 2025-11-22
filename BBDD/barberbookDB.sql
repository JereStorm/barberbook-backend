-- ==========================================
-- BarberBook Database Schema
-- ==========================================

DROP DATABASE IF EXISTS barberbook;
CREATE DATABASE barberbook;
USE barberbook;

-- ======================
-- Tabla: SALONS
-- ======================
CREATE TABLE salons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    address VARCHAR(255),
    mobile VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Tabla: USERS 
-- ======================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NULL, -- NULL para super_admin
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'recepcionista', 'estilista') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
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
-- Tabla: APPOINTMENTS (Actualizada)
-- ======================
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    finish_time TIMESTAMP NOT NULL,
    duration INT NOT NULL, -- Duración total calculada
    total_price DECIMAL(10,2) DEFAULT 0, -- Nuevo campo: Precio total congelado
    client_id INT NOT NULL,
    employee_id INT NULL,
    -- service_id ELIMINADO (ahora es N:N)
    status ENUM('activo', 'pendiente', 'confirmado', 'cancelado', 'completado') DEFAULT 'pendiente',
    notes TEXT NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_salon FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE NO ACTION,
    CONSTRAINT fk_appointments_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE NO ACTION
);

-- ======================
-- Tabla Intermedia: APPOINTMENTS_SERVICES (Nueva relación N:N)
-- ======================
CREATE TABLE appointments_services (
    appointment_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (appointment_id, service_id),
    CONSTRAINT fk_as_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_as_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- ======================
-- Indexes para optimizar búsquedas
-- ======================
CREATE INDEX idx_users_salon ON users(salon_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_services_salon ON services(salon_id);
CREATE INDEX idx_appointments_salon ON appointments(salon_id);
CREATE INDEX idx_appointments_status ON appointments(status);
-- NOTA: en esta version, no se esta indexando notes

-- ======================
-- INSERTAR SUPER ADMIN INICIAL (SEED)
-- ======================
-- Password: SuperAdmin123!
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) 
VALUES (
    NULL, 
    'Super Administrador',
    'superadmin@barberbook.com', 
    NULL,
    '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', 
    'super_admin', 
    TRUE,
    NULL
);
