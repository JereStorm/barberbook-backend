-- ======================
-- Una vez creada la BDD y teniendo los esquemas, cargar con la siguiente info.
-- ======================
USE barberbook;

-- ======================
-- Datos para CLIENTS
-- ======================
INSERT INTO clients (salon_id, name, email, mobile) VALUES
(1, 'Carlos Gómez', 'carlos.gomez@mail.com', '+541167891234'),
(1, 'María Pérez', 'maria.perez@mail.com', '+541176543210'),
(1, 'Jorge Sánchez', 'jorge.sanchez@mail.com', '+541188887777'),
(1, 'Ana López', 'ana.lopez@mail.com', '+541199996666');

-- ======================
-- Datos para SERVICES
-- ======================
INSERT INTO services (salon_id, name, duration_min, price, is_active) VALUES
(1, 'Corte de cabello clásico', 30, 10000.00, TRUE),
(1, 'Afeitado premium', 20, 5000.00, TRUE),
(1, 'Coloración', 60, 40000.00, TRUE),
(1, 'Corte moderno', 30, 20000.00, TRUE),
(1, 'Tratamiento capilar', 45, 35000.00, TRUE);

-- ======================
-- Datos para APPOINTMENTS
-- ======================
INSERT INTO appointments 
(salon_id, start_time, finish_time, duration, client_id, employee_id, service_id, status, notes, created_by, updated_by) 
VALUES
-- 1) Corte clásico a Carlos Gómez con Carlos Rodríguez
(1, 
 '2025-11-25 10:00:00',
 '2025-11-25 10:30:00',   -- 30 min (service 1)
 30,
 1,                       -- client: Carlos Gómez
 4,                       -- employee: estilista Carlos Rodríguez
 1,                       -- Corte clásico
 "pendiente",
 'Cliente pidió rebajar laterales.',
 3,                       -- creado por recepcionista María
 NULL),

-- 2) Afeitado premium a María Pérez con Carlos Rodríguez
(1,
 '2025-11-25 11:00:00',
 '2025-11-25 11:20:00',   -- 20 min (service 2)
 20,
 2,
 4,                       -- estilista
 2,
  "pendiente",
 'Afeitado completo con toalla caliente.',
 3,
 NULL),

-- 3) Coloración para Jorge Sánchez (sin empleado asignado aún)
(1,
 '2025-11-25 14:00:00',
 '2025-11-25 15:00:00',   -- 60 min (service 3)
 60,
 3,
 NULL,                    -- sin estilista todavía
 3,
  "pendiente",
 'Coloración tono castaño oscuro.',
 3,
 NULL),

-- 4) Corte moderno para Ana López con Carlos Rodríguez
(1,
 '2025-11-26 09:30:00',
 '2025-11-26 10:00:00',   -- 30 min (service 4)
 30,
 4,
 4,
 4,
  "pendiente",
 NULL,
 3,
 NULL),

-- 5) Tratamiento capilar para Carlos Gómez con Carlos Rodríguez
(1,
 '2025-11-26 10:15:00',
 '2025-11-26 11:00:00',   -- 45 min (service 5)
 45,
 1,
 4,
 5,
  "pendiente",
 'Solicita producto hidratante.',
 3,
 NULL);
