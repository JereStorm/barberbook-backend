-- ======================
-- Una vez creada la BDD y teniendo los esquemas, cargar con la siguiente info.
-- ======================
USE barberbook;

-- ======================
-- Datos para CLIENTS
-- ======================
INSERT INTO clients (salon_id, name, email, mobile) VALUES
(1, 'Carlos Gómez', 'carlos.gomez@mail.com', '1167891234'),
(1, 'María Pérez', 'maria.perez@mail.com', '1176543210'),
(1, 'Jorge Sánchez', 'jorge.sanchez@mail.com', '1188887777'),
(1, 'Ana López', 'ana.lopez@mail.com', '1199996666');

-- ======================
-- Datos para SERVICES
-- ======================
INSERT INTO services (salon_id, name, duration_min, price, is_active) VALUES
(1, 'Corte de cabello clásico', 30, 15.00, TRUE),
(1, 'Afeitado premium', 20, 10.00, TRUE),
(1, 'Coloración', 60, 40.00, TRUE),
(1, 'Corte moderno', 30, 20.00, TRUE),
(1, 'Tratamiento capilar', 45, 35.00, TRUE);

-- ======================
-- Datos para APPOINTMENTS
-- ======================
INSERT INTO appointments 
(salon_id, start_time, duration_min, client_id, employee_id, service_id, status, notes, created_by, updated_by) 
VALUES
(1, '2025-09-15 10:00:00', 30, 5, 2, 1, 'confirmed', 'Cliente puntual', 2, NULL),
(1, '2025-09-15 11:00:00', 20, 6, 2, 2, 'pending', NULL, 2, NULL),
(1, '2025-09-16 15:00:00', 30, 7, 2, 4, 'confirmed', 'Prefiere corte degradado', 2, NULL),
(1, '2025-09-16 16:30:00', 45, 8, 2, 5, 'completed', 'Aplicado tratamiento nutritivo', 2, 2);