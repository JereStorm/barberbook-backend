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
    created_by INT NULL, -- NULL para el primer super_admin
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
-- Tabla: APPOINTMENTS
-- ======================
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_min INT NOT NULL,
    client_id INT NOT NULL,
    employee_id INT NULL,
    service_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'canceled', 'completed') DEFAULT 'pending',
    notes TEXT NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_salon FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE NO ACTION,
    CONSTRAINT fk_appointments_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE NO ACTION
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

-- ======================
-- INSERTAR SUPER ADMIN INICIAL (SEED)
-- ======================
-- Password: SuperAdmin123!->El hash se genero con bs
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) 
VALUES (
    NULL, 
    'Super Administrador',
    'superadmin@barberbook.com', 
    NULL,
    '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', -- SuperAdmin123!
    'super_admin', 
    TRUE,
    NULL
);

-- ======================
-- DATOS DE EJEMPLO->Lo utilice para cargar un usuario de cada tipo, despues los limpie, y los cargue desde el rol de superadmin
-- ======================

-- Ejemplo de salón
INSERT INTO salons (name, address, mobile) 
VALUES ('Salón Elegante', 'Av. Corrientes 1234, Buenos Aires', '+54 11 1234-5678');

-- Ejemplo de admin del salón (password: Admin123!)
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) 
VALUES (
    1, 
    'Juan Pérez',
    'admin@salonelegante.com', 
    '+54 11 8765-4321',
    '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', -- SuperAdmin123!
    'admin', 
    TRUE,
    1
);

-- Ejemplo de recepcionista (password: Recep123!)
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) 
VALUES (
    1, 
    'María González',
    'maria@salonelegante.com', 
    '+54 11 5555-1234',
    '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', -- SuperAdmin123!
    'recepcionista', 
    TRUE,
    2
);

-- Ejemplo de estilista (password: Estil123!)
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) 
VALUES (
    1, 
    'Carlos Rodríguez',
    'carlos@salonelegante.com', 
    '+54 11 9999-8888',
    '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', -- SuperAdmin123!
    'estilista', 
    TRUE,
    3
);
