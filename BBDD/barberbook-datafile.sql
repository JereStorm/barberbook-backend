-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: barberbook
-- ------------------------------------------------------
-- Server version	8.0.41
-- ======================

-- SEEDS COMPLETOS (6 salones) - IDs FIJOS
-- SUPER ADMIN ID=1 SE MANTIENE

-- Password para todos los usuarios: 12345nN!

-- HASH REAL bcrypt (10 rounds):
-- $2b$10$gBmvbihFfB3OfzHnZhO/OeYFfHecHiV3OxQmMQSj4fj8MgDVmqvXW

-- ======================
-- ==========================================
-- BarberBook Database Schema
-- ==========================================

DROP schema IF EXISTS barberbook;
CREATE schema barberbook;
USE barberbook;
DROP DATABASE IF EXISTS barberbook;
CREATE DATABASE barberbook;
USE barberbook;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salon_id` int NOT NULL,
  `start_time` timestamp NOT NULL,
  `finish_time` timestamp NOT NULL,
  `duration` int NOT NULL,
  `total_price` decimal(10,2) DEFAULT '0.00',
  `client_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `status` enum('activo','cancelado','completado','caducado') DEFAULT 'activo',
  `notes` text,
  `created_by` int NOT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_appointments_client` (`client_id`),
  KEY `fk_appointments_employee` (`employee_id`),
  KEY `fk_appointments_created_by` (`created_by`),
  KEY `fk_appointments_updated_by` (`updated_by`),
  KEY `idx_appointments_salon` (`salon_id`),
  KEY `idx_appointments_status` (`status`),
  CONSTRAINT `fk_appointments_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointments_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_appointments_employee` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointments_salon` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointments_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,1,'2025-12-01 11:00:00','2025-12-01 11:30:00',30,12000.00,1,3,'activo','Corte clásico',2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(2,1,'2025-12-01 17:00:00','2025-12-01 17:20:00',20,15000.00,2,3,'activo','Afeitado premium',2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(3,1,'2025-12-02 11:00:00','2025-12-02 11:30:00',30,12000.00,3,3,'activo',NULL,2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(4,1,'2025-12-02 17:30:00','2025-12-02 17:45:00',15,10000.00,4,3,'activo','Corte rápido',2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(5,1,'2025-12-03 11:30:00','2025-12-03 12:00:00',30,12000.00,5,3,'activo',NULL,2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(6,1,'2025-12-03 18:00:00','2025-12-03 18:20:00',20,15000.00,6,3,'activo',NULL,2,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(7,2,'2025-12-01 11:00:00','2025-12-01 11:30:00',30,20000.00,7,6,'activo','Corte moderno',5,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(8,2,'2025-12-01 13:00:00','2025-12-01 14:00:00',60,22000.00,8,6,'activo','Coloración completa',5,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(9,2,'2025-12-02 12:00:00','2025-12-02 12:30:00',30,20000.00,9,6,'activo',NULL,5,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(10,2,'2025-12-03 14:00:00','2025-12-03 14:30:00',30,20000.00,10,6,'activo',NULL,5,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(11,2,'2025-12-04 11:00:00','2025-12-04 11:30:00',30,20000.00,11,6,'activo',NULL,5,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(12,3,'2025-12-01 11:00:00','2025-12-01 11:30:00',30,13000.00,12,8,'activo',NULL,7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(13,3,'2025-12-01 17:00:00','2025-12-01 17:25:00',25,18000.00,13,8,'activo','Barba y corte',7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(14,3,'2025-12-02 12:00:00','2025-12-02 12:20:00',20,17000.00,14,8,'activo','Color express',7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(15,3,'2025-12-02 18:00:00','2025-12-02 18:30:00',30,25000.00,15,8,'activo','Tratamiento',7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(16,3,'2025-12-03 11:30:00','2025-12-03 12:00:00',30,13000.00,16,8,'activo',NULL,7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(17,3,'2025-12-04 17:00:00','2025-12-04 17:45:00',45,18000.00,17,8,'activo',NULL,7,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(18,4,'2025-12-01 11:00:00','2025-12-01 11:30:00',30,12000.00,19,10,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(19,4,'2025-12-01 11:30:00','2025-12-01 12:15:00',45,18000.00,20,11,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(20,4,'2025-12-02 12:00:00','2025-12-02 12:30:00',30,12000.00,21,10,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(21,4,'2025-12-02 13:00:00','2025-12-02 13:30:00',30,15000.00,22,11,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(22,4,'2025-12-03 11:00:00','2025-12-03 11:30:00',30,12000.00,23,10,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(23,4,'2025-12-03 12:00:00','2025-12-03 12:30:00',30,15000.00,24,11,'activo',NULL,9,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(24,5,'2025-12-01 11:00:00','2025-12-01 11:20:00',20,11000.00,25,12,'activo',NULL,12,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(25,5,'2025-12-01 11:30:00','2025-12-01 11:50:00',20,10000.00,26,NULL,'activo','Sin estilista asignado',12,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(26,5,'2025-12-02 12:00:00','2025-12-02 12:20:00',20,11000.00,27,12,'activo',NULL,12,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(27,5,'2025-12-03 13:00:00','2025-12-03 13:20:00',20,10000.00,28,NULL,'activo','Sin estilista asignado',12,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(28,5,'2025-12-04 11:00:00','2025-12-04 11:20:00',20,11000.00,29,12,'activo',NULL,12,NULL,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(29,6,'2025-12-01 11:00:00','2025-12-01 11:20:00',20,5000.00,31,NULL,'activo',NULL,34,NULL,'2025-11-27 23:53:45','2025-11-27 23:53:45'),(30,6,'2025-12-02 11:00:00','2025-12-02 12:50:00',110,55000.00,32,34,'activo',NULL,34,NULL,'2025-11-27 23:54:31','2025-11-27 23:54:31'),(31,6,'2025-12-03 11:00:00','2025-12-03 13:15:00',135,85000.00,30,34,'activo',NULL,34,NULL,'2025-11-27 23:56:31','2025-11-27 23:56:31');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments_services`
--

DROP TABLE IF EXISTS `appointments_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments_services` (
  `appointment_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`appointment_id`,`service_id`),
  KEY `fk_as_service` (`service_id`),
  CONSTRAINT `fk_as_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_as_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments_services`
--

LOCK TABLES `appointments_services` WRITE;
/*!40000 ALTER TABLE `appointments_services` DISABLE KEYS */;
INSERT INTO `appointments_services` VALUES (1,1),(3,1),(5,1),(2,2),(6,2),(4,3),(7,4),(9,4),(10,4),(11,4),(8,5),(12,6),(16,6),(13,7),(17,7),(14,8),(15,9),(18,10),(20,10),(22,10),(19,11),(21,11),(23,11),(24,13),(26,13),(28,13),(25,14),(27,14),(30,15),(31,15),(29,16),(30,16),(30,17),(31,17),(31,19);
/*!40000 ALTER TABLE `appointments_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salon_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_clients_salon` (`salon_id`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,1,'Carlos Gómez','carlos.gomez@email.com','+542284101001','2025-11-27 23:28:39'),(2,1,'María Pérez','maria.perez@email.com','+542284101002','2025-11-27 23:28:39'),(3,1,'Jorge Sánchez','jorge.sanchez@email.com','+542284101003','2025-11-27 23:28:39'),(4,1,'Ana López','ana.lopez@email.com','+542284101004','2025-11-27 23:28:39'),(5,1,'Lucía Fernández','lucia.fernandez@email.com','+542284101005','2025-11-27 23:28:39'),(6,1,'Mateo Rodríguez','mateo.rodriguez@email.com','+542284101006','2025-11-27 23:28:39'),(7,2,'Bruno Díaz','bruno.diaz@email.com','+542284201001','2025-11-27 23:28:39'),(8,2,'Sofía Morales','sofia.morales@email.com','+542284201002','2025-11-27 23:28:39'),(9,2,'Tomás Herrera','tomas.herrera@email.com','+542284201003','2025-11-27 23:28:39'),(10,2,'Valentina Ruiz','valentina.ruiz@email.com','+542284201004','2025-11-27 23:28:39'),(11,2,'Facundo Silva','facundo.silva@email.com','+542284201005','2025-11-27 23:28:39'),(12,3,'Martina Castro','martina.castro@email.com','+542284301001','2025-11-27 23:28:39'),(13,3,'Nicolás Vega','nicolas.vega@email.com','+542284301002','2025-11-27 23:28:39'),(14,3,'Agustín Romero','agustin.romero@email.com','+542284301003','2025-11-27 23:28:39'),(15,3,'Camila Herrera','camila.herrera@email.com','+542284301004','2025-11-27 23:28:39'),(16,3,'Diego Sosa','diego.sosa@email.com','+542284301005','2025-11-27 23:28:39'),(17,3,'Mariana Ortiz','mariana.ortiz@email.com','+542284301006','2025-11-27 23:28:39'),(18,3,'Pablo Luna','pablo.luna@email.com','+542284301007','2025-11-27 23:28:39'),(19,4,'Laura Blanco','laura.blanco@email.com','+542284401001','2025-11-27 23:28:39'),(20,4,'Gonzalo Prieto','gonzalo.prieto@email.com','+542284401002','2025-11-27 23:28:39'),(21,4,'Florencia Ruiz','florencia.ruiz@email.com','+542284401003','2025-11-27 23:28:39'),(22,4,'Sebastián Marín','sebastian.marin@email.com','+542284401004','2025-11-27 23:28:39'),(23,4,'Irene Vega','irene.vega@email.com','+542284401005','2025-11-27 23:28:39'),(24,4,'Santiago Rojas','santiago.rojas@email.com','+542284401006','2025-11-27 23:28:39'),(25,5,'Clara Méndez','clara.mendez@email.com','+542284501001','2025-11-27 23:28:39'),(26,5,'Lucas Palma','lucas.palma@email.com','+542284501002','2025-11-27 23:28:39'),(27,5,'Paula Ferrer','paula.ferrer@email.com','+542284501003','2025-11-27 23:28:39'),(28,5,'Ernesto Gil','ernesto.gil@email.com','+542284501004','2025-11-27 23:28:39'),(29,5,'Marcos Díaz','marcos.diaz@email.com','+542284501005','2025-11-27 23:28:39'),(30,6,'Valeria White','valeria.white@mail.com','+541199998888','2025-11-27 23:40:25'),(31,6,'Franco Peralta','fran@peralta.com','+541176543210','2025-11-27 23:41:10'),(32,6,'Ana Maria Cruz','ana@email.com','+542284567896','2025-11-27 23:42:22');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salons`
--

DROP TABLE IF EXISTS `salons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salons`
--

LOCK TABLES `salons` WRITE;
/*!40000 ALTER TABLE `salons` DISABLE KEYS */;
INSERT INTO `salons` VALUES (1,'Salón Aurora','Calle Falsa 123, Buenos Aires','+542284000001','2025-11-27 23:28:39'),(2,'Salón Brisa','Av. Libertador 200, Buenos Aires','+542284000002','2025-11-27 23:28:39'),(3,'Salón Cielo','Calle Luna 45, Buenos Aires','+542284000003','2025-11-27 23:28:39'),(4,'Salón Delta','Av. Rivadavia 500, Buenos Aires','+542284000004','2025-11-27 23:28:39'),(5,'Salón Eclipse','Calle Sol 77, Buenos Aires','+542284000005','2025-11-27 23:28:39'),(6,'Salón Elegante','Av. Corrientes 1234, Buenos Aires','+542284602566','2025-11-27 23:34:00');
/*!40000 ALTER TABLE `salons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salon_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `duration_min` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_services_salon` (`salon_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Corte clásico',30,12000.00,1),(2,1,'Afeitado premium',20,15000.00,1),(3,1,'Corte rápido',15,10000.00,1),(4,2,'Corte moderno',30,20000.00,1),(5,2,'Coloración completa',30,22000.00,1),(6,3,'Corte ejecutivo',30,13000.00,1),(7,3,'Barba y corte',25,18000.00,1),(8,3,'Coloración express',20,17000.00,1),(9,3,'Tratamiento intensivo',30,25000.00,1),(10,4,'Corte clásico',30,12000.00,1),(11,4,'Corte y barba',30,18000.00,1),(12,4,'Peinado',20,15000.00,1),(13,5,'Corte rápido',20,11000.00,1),(14,5,'Afeitado clásico',15,10000.00,1),(15,6,'Corte de cabello clásico',30,10000.00,1),(16,6,'Afeitado premium',20,5000.00,1),(17,6,'Coloración',60,40000.00,1),(18,6,'Corte moderno',30,20000.00,1),(19,6,'Tratamiento capilar',45,35000.00,1);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salon_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','recepcionista','estilista') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `created_by` (`created_by`),
  KEY `idx_users_salon` (`salon_id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'Super Administrador','superadmin@barberbook.com',NULL,'$2b$10$hv5oMu5hbP9mGW2ZUE5ib.R//Ly3kL24O8hlbviHic299P1EsgZj6','super_admin',1,NULL,'2025-11-27 23:28:35','2025-11-27 23:28:35'),(2,1,'Admin Aurora','admin.aurora@email.com','+542284100001','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','admin',1,1,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(3,1,'Estilista Aurora','estilista.aurora@email.com','+542284100002','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,2,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(4,1,'Recepcionista Aurora','recepcionista.aurora@email.com','+542284100003','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,2,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(5,2,'Admin Brisa','admin.brisa@email.com','+542284200001','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','admin',1,1,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(6,2,'Estilista Brisa','estilista.brisa@email.com','+542284200002','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(7,3,'Admin Cielo','admin.cielo@email.com','+542284300001','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','admin',1,1,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(8,3,'Estilista Cielo','estilista.cielo@email.com','+542284300002','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(9,4,'Admin Delta','admin.delta@email.com','+542284400001','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','admin',1,1,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(10,4,'Estilista Delta 1','estilista.delta1@email.com','+542284400002','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(11,4,'Estilista Delta 2','estilista.delta2@email.com','+542284400003','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(12,5,'Admin Eclipse','admin.eclipse@email.com','+542284500001','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','admin',1,1,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(13,1,'Federico Ramos','federico.ramos@email.com','+542284100101','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,2,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(14,1,'Rocío Medina','rocio.medina@email.com','+542284100102','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,2,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(15,2,'Julián Torres','julian.torres@email.com','+542284200101','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(16,2,'Alejandro Díaz','alejandro.diaz@email.com','+542284200102','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(17,3,'Santiago Paredes','santiago.paredes@email.com','+542284300101','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(18,3,'Agustina Rios','agustina.rios@email.com','+542284300102','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(19,3,'Franco Navarro','franco.navarro@email.com','+542284300103','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(20,4,'Luciana Ponce','luciana.ponce@email.com','+542284400101','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(21,4,'Tomás Varela','tomas.varela@email.com','+542284400102','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(22,5,'Brenda Martínez','brenda.martinez@email.com','+542284500101','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,12,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(23,5,'Leandro Gómez','leandro.gomez@email.com','+542284500102','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,12,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(24,5,'Victoria Cabrera','victoria.cabrera@email.com','+542284500103','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,12,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(25,2,'Milagros Herrera','milagros.herrera@email.com','+542284200201','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(26,2,'Nicolás Ferreyra','nicolas.ferreyra@email.com','+542284200202','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(27,2,'Sofía Blanco','sofia.blanco@email.com','+542284200203','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,5,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(28,3,'Gonzalo Bustos','gonzalo.bustos@email.com','+542284300201','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(29,3,'Julieta Cabrera','julieta.cabrera@email.com','+542284300202','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(30,3,'Matías Reynoso','matias.reynoso@email.com','+542284300203','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,7,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(31,4,'Martina Benítez','martina.benitez@email.com','+542284400201','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','recepcionista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(32,4,'Diego Aramayo','diego.aramayo@email.com','+542284400202','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(33,4,'Camila Maldonado','camila.maldonado@email.com','+542284400203','$2b$10$4XXf6CvQBFaW7BeAXgmq1.gAkN9dRGna2dPpbMQCHzx3Vz.XV/KuO','estilista',1,9,'2025-11-27 23:28:39','2025-11-27 23:28:39'),(34,6,'Agustin Sau','admin@salonelegante.com','+542284602657','$2b$10$V5WH4xjImcs/9JQqKlPJr.VzdcF.Yq0sswLe/UfopSHicxjprPicG','admin',1,1,'2025-11-27 23:34:00','2025-11-27 23:34:00'),(36,6,'Juana','maria@salonelegante.co','+542317485472','$2b$10$O6mqwJ9YVD985sFOBEIPXuO9eKthI3hMwOVohn6yDLv81OiqxY.CS','recepcionista',1,1,'2025-11-27 23:38:00','2025-11-27 23:38:00'),(37,6,'Josefa','carlos@salonelegante.com','+542284565654','$2b$10$wZkUaJ1JxVtwydJ7uJgl4ejGkaXAND7WWaFcAs/MFlFdMYaMiJR9S','estilista',1,1,'2025-11-27 23:38:30','2025-11-27 23:38:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 20:58:17
