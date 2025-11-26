-- ======================
-- SEEDS INICIALES
-- ======================
USE barberbook;

-- 1. Salon
INSERT INTO salons (name, address, mobile) 
VALUES ('Salón Elegante', 'Av. Corrientes 1234, Buenos Aires', '+54 11 1234-5678');

-- 2. Usuarios
-- Password para todos: SuperAdmin123!
INSERT INTO users (salon_id, name, email, mobile, password_hash, role, is_active, created_by) VALUES 
(1, 'Juan Pérez', 'admin@salonelegante.com', '+541187654321', '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', 'admin', TRUE, 1),
(1, 'María González', 'maria@salonelegante.com', '+541155551234', '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', 'recepcionista', TRUE, 2),
(1, 'Carlos Rodríguez', 'carlos@salonelegante.com', '+541199998888', '$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6', 'estilista', TRUE, 3);

-- 3. Clientes
INSERT INTO clients (salon_id, name, email, mobile) VALUES
(1, 'Carlos Gómez', 'carlos.gomez@mail.com', '+541167891234'),
(1, 'María Pérez', 'maria.perez@mail.com', '+541176543210'),
(1, 'Jorge Sánchez', 'jorge.sanchez@mail.com', '+541188887777'),
(1, 'Ana López', 'ana.lopez@mail.com', '+541199996666');

-- 4. Servicios
-- ID 1: Corte clásico ($10000, 30min)
-- ID 2: Afeitado ($5000, 20min)
-- ID 3: Coloración ($40000, 60min)
-- ID 4: Corte moderno ($20000, 30min)
-- ID 5: Tratamiento ($35000, 45min)
INSERT INTO services (salon_id, name, duration_min, price, is_active) VALUES
(1, 'Corte de cabello clásico', 30, 10000.00, TRUE),
(1, 'Afeitado premium', 20, 5000.00, TRUE),
(1, 'Coloración', 60, 40000.00, TRUE),
(1, 'Corte moderno', 30, 20000.00, TRUE),
(1, 'Tratamiento capilar', 45, 35000.00, TRUE);

-- 5. Turnos (Sin service_id, con total_price y duration)
INSERT INTO appointments 
(id, salon_id, start_time, finish_time, duration, total_price, client_id, employee_id, status, notes, created_by) 
VALUES
-- Turno 1: Carlos Gómez (Corte Clásico) -> ID 1
(1, 1, '2025-11-25 10:00:00', '2025-11-25 10:30:00', 30, 10000.00, 1, 4, 'activo', 'Cliente pidió rebajar laterales.', 3),

-- Turno 2: María Pérez (Afeitado) -> ID 2
(2, 1, '2025-11-25 11:00:00', '2025-11-25 11:20:00', 20, 5000.00, 2, 4, 'activo', 'Afeitado completo.', 3),

-- Turno 3: Jorge Sánchez (Coloración) -> ID 3
(3, 1, '2025-11-25 14:00:00', '2025-11-25 15:00:00', 60, 40000.00, 3, NULL, 'activo', 'Tono castaño oscuro.', 3),

-- Turno 4: Ana López (Corte Moderno) -> ID 4
(4, 1, '2025-11-26 09:30:00', '2025-11-26 10:00:00', 30, 20000.00, 4, 4, 'activo', NULL, 3),

-- Turno 5: Carlos Gómez (Tratamiento) -> ID 5
(5, 1, '2025-11-26 10:15:00', '2025-11-26 11:00:00', 45, 35000.00, 1, 4, 'activo', 'Solicita producto hidratante.', 3);

-- 6. Relacionar Turnos con Servicios (Tabla Intermedia)
INSERT INTO appointments_services (appointment_id, service_id) VALUES
(1, 1), -- Turno 1 tiene Servicio 1 (Corte Clásico)
(2, 2), -- Turno 2 tiene Servicio 2 (Afeitado)
(3, 3), -- Turno 3 tiene Servicio 3 (Coloración)
(4, 4), -- Turno 4 tiene Servicio 4 (Corte Moderno)
(5, 5); -- Turno 5 tiene Servicio 5 (Tratamiento)

-- Turno con multiples servicios (nuevo esquema)
-- Creo el turno ID 6
INSERT INTO appointments 
(id, salon_id, start_time, finish_time, duration, total_price, client_id, employee_id, status, notes, created_by) 
VALUES
(6, 1, '2025-11-27 15:00:00', '2025-11-27 15:50:00', 50, 15000.00, 3, 4, 'completado', 'Paquete completo', 3);

-- Asigno los dos servicios al turno 6
INSERT INTO appointments_services (appointment_id, service_id) VALUES
(6, 1), -- Corte (30min, $10000)
(6, 2); -- Afeitado (20min, $5000) -> Total 50min, $15000