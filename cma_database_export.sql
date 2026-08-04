/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.23-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: cma_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `text_en` text NOT NULL,
  `text_si` text DEFAULT NULL,
  `text_ta` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` timestamp NULL DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'Vacancies: Applications invited for Architect, Mason, Caretaker & Book Binder. Deadline: 20 Feb 2026','පුරප්පාඩු: ගෘහ නිර්මාණ ශිල්පී, කොන්ත්‍රාත්කරු, භාරකරු සඳහා අයඳුම්','காலி இடங்கள்: கட்டிட வல்லுனர், கொத்தனார் பதவிகளுக்கு விண்ணப்பங்கள்','/careers',1,NULL,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(2,'Special Announcement for all Apartment Unit Owners & Residents – Click to view','සියලු මහල් නිවාස හිමිකරුවන් සඳහා විශේෂ නිවේදනය','அனைத்து அடுக்குமாடி உரிமையாளர்களுக்கு சிறப்பு அறிவிப்பு','/news',1,NULL,2,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(3,'Condominium History Page Updated by Nadeemal',NULL,NULL,'/about/history',1,NULL,3,'2026-06-25 01:12:50','2026-06-25 01:14:03');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_forms`
--

DROP TABLE IF EXISTS `application_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_forms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL DEFAULT 'PDF',
  `file_size` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_forms`
--

LOCK TABLES `application_forms` WRITE;
/*!40000 ALTER TABLE `application_forms` DISABLE KEYS */;
INSERT INTO `application_forms` VALUES (1,'dfgs edhf','fhg dhfd','f hgdfhg','uploads/rUHzKeWigA8EqdpKxZkxhwLC1JyJzOrBxo8dcti9.pdf','PDF','2.0 MB',1,0,'2026-06-15 00:05:58','2026-06-15 00:05:58');
/*!40000 ALTER TABLE `application_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_tariffs`
--

DROP TABLE IF EXISTS `application_tariffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_tariffs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `item_no` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'General',
  `description_en` varchar(255) NOT NULL,
  `description_si` varchar(255) DEFAULT NULL,
  `description_ta` varchar(255) DEFAULT NULL,
  `scale` varchar(255) DEFAULT NULL,
  `fee` varchar(255) NOT NULL,
  `fee_display` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_tariffs`
--

LOCK TABLES `application_tariffs` WRITE;
/*!40000 ALTER TABLE `application_tariffs` DISABLE KEYS */;
INSERT INTO `application_tariffs` VALUES (1,'1','1. FEES IN RESPECT OF ISSUING CERTIFICATES','Application Fee for Certificate',NULL,NULL,'All properties','500','','Applicable for Condominium, Semi-Condominium, or Provisional Condominium Plans.',10,1,'2026-06-24 04:13:18','2026-07-01 08:20:12'),(2,'2','1. FEES IN RESPECT OF ISSUING CERTIFICATES','Processing Fee for Preliminary Clearance Letter',NULL,NULL,'Advance payment','0','25%','25% of the processing fee to be paid at the time of obtaining the letter.',20,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(3,NULL,'2. APPLICATION TO TERMINATE CONDOMINIUM STATUS OR DEMOLISH PROPERTY','Units from 2 - 5',NULL,NULL,'Termination Fee','2000',NULL,'Subject to Authority approval and government taxes.',30,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(4,NULL,'2. APPLICATION TO TERMINATE CONDOMINIUM STATUS OR DEMOLISH PROPERTY','Units from 6 - 10',NULL,NULL,'Termination Fee','5000',NULL,'Subject to Authority approval and government taxes.',40,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(5,NULL,'2. APPLICATION TO TERMINATE CONDOMINIUM STATUS OR DEMOLISH PROPERTY','Units from 11 - 25',NULL,NULL,'Termination Fee','7500',NULL,'Subject to Authority approval and government taxes.',50,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(6,NULL,'2. APPLICATION TO TERMINATE CONDOMINIUM STATUS OR DEMOLISH PROPERTY','More than 26 units',NULL,NULL,'Termination Fee','15000',NULL,'Subject to Authority approval and government taxes.',60,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(7,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 0 - 500 m²',NULL,NULL,'Residential','30',NULL,'Fee calculated per 1 m²',70,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(8,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 0 - 500 m²',NULL,NULL,'Commercial','50',NULL,'Fee calculated per 1 m²',80,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(9,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 501 - 1,000 m²',NULL,NULL,'Residential','75',NULL,'Fee calculated per 1 m²',90,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(10,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 501 - 1,000 m²',NULL,NULL,'Commercial','150',NULL,'Fee calculated per 1 m²',100,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(11,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 1,001 - 3,000 m²',NULL,NULL,'Residential','250',NULL,'Fee calculated per 1 m²',110,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(12,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 1,001 - 3,000 m²',NULL,NULL,'Commercial','450',NULL,'Fee calculated per 1 m²',120,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(13,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 3,001 - 5,000 m²',NULL,NULL,'Residential','300',NULL,'Fee calculated per 1 m²',130,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(14,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: 3,001 - 5,000 m²',NULL,NULL,'Commercial','500',NULL,'Fee calculated per 1 m²',140,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(15,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: More than 5,001 m²',NULL,NULL,'Residential','600',NULL,'Fee calculated per 1 m²',150,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(16,NULL,'3. Processing Fees of Applications Submitted in Respect of a Condominium Property','Floor Area: More than 5,001 m²',NULL,NULL,'Commercial','850',NULL,'Fee calculated per 1 m²',160,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(17,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 500 - 1,000 m²',NULL,NULL,'Fixed Rate','2000',NULL,'Government taxes applicable.',170,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(18,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 1,001 - 3,000 m²',NULL,NULL,'Fixed Rate','110000',NULL,'Government taxes applicable.',180,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(19,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 3,001 - 5,000 m²',NULL,NULL,'Fixed Rate','150000',NULL,'Government taxes applicable.',190,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(20,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 5,001 - 10,000 m²',NULL,NULL,'Fixed Rate','200000',NULL,'Government taxes applicable.',200,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(21,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 10,001 - 20,000 m²',NULL,NULL,'Fixed Rate','250000',NULL,'Government taxes applicable.',210,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(22,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 20,001 - 30,000 m²',NULL,NULL,'Fixed Rate','300000',NULL,'Government taxes applicable.',220,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(23,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 30,001 - 40,000 m²',NULL,NULL,'Fixed Rate','350000',NULL,'Government taxes applicable.',230,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(24,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: 40,001 - 50,000 m²',NULL,NULL,'Fixed Rate','400000',NULL,'Government taxes applicable.',240,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(25,NULL,'4. Final Certificate Fees (After completion of construction following Provisional/Semi Certificate)','Floor Area: More than 50,001 m²',NULL,NULL,'Fixed Rate','450000',NULL,'Government taxes applicable.',250,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(26,NULL,'5. Field Inspection Fees (Constructed Outside the Boundary of Western Province)','≤ 5 Condominium Units within a Parcel',NULL,NULL,'Transport Charge','12',NULL,'Rate per Kilometer. Government taxes applicable.',260,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(27,NULL,'5. Field Inspection Fees (Constructed Outside the Boundary of Western Province)','> 5 Condominium Units within a Parcel',NULL,NULL,'Transport Charge','20',NULL,'Rate per Kilometer. Government taxes applicable.',270,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(28,NULL,'6. Inspection Fees (Constructed in Colombo, Gampaha, and Kalutara Districts)','Gampaha & Kalutara Districts (Outside Colombo)',NULL,NULL,'Transport Charge','20',NULL,'Rate per Kilometer. Together with government taxes.',280,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(29,NULL,'7. Renewal of a Semi or Provisional Condominium Plan (Annually)','Floor Area: Up to 1,000 m²',NULL,NULL,'Annual Rate','2000',NULL,'Government taxes applicable.',290,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(30,NULL,'7. Renewal of a Semi or Provisional Condominium Plan (Annually)','Floor Area: 1,001 - 3,000 m²',NULL,NULL,'Annual Rate','7500',NULL,'Government taxes applicable.',300,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(31,NULL,'7. Renewal of a Semi or Provisional Condominium Plan (Annually)','Floor Area: 3,001 - 5,000 m²',NULL,NULL,'Annual Rate','15000',NULL,'Government taxes applicable.',310,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(32,NULL,'7. Renewal of a Semi or Provisional Condominium Plan (Annually)','Floor Area: 5,001 - 10,000 m²',NULL,NULL,'Annual Rate','20000',NULL,'Government taxes applicable.',320,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(33,NULL,'7. Renewal of a Semi or Provisional Condominium Plan (Annually)','Floor Area: More than 10,001 m²',NULL,NULL,'Annual Rate','25000',NULL,'Government taxes applicable.',330,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(34,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Less than 5 units',NULL,NULL,'Nominal Rate','1000',NULL,'Area in square meters remains unchanged. Taxes added.',340,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(35,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Units from 06 - 10',NULL,NULL,'Nominal Rate','2500',NULL,'Area in square meters remains unchanged. Taxes added.',350,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(36,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Units from 11 - 20',NULL,NULL,'Nominal Rate','5000',NULL,'Area in square meters remains unchanged. Taxes added.',360,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(37,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Units from 21 - 30',NULL,NULL,'Nominal Rate','15000',NULL,'Area in square meters remains unchanged. Taxes added.',370,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(38,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Units from 31 - 40',NULL,NULL,'Nominal Rate','2500',NULL,'Area in square meters remains unchanged. Taxes added.',380,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(39,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','Units from 41 - 50',NULL,NULL,'Nominal Rate','30000',NULL,'Area in square meters remains unchanged. Taxes added.',390,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(40,NULL,'8. Amendments with Unchanged Total Area (Nominal Fee Levying Scheme)','More than 50 units',NULL,NULL,'Nominal Rate','50000',NULL,'Area in square meters remains unchanged. Taxes added.',400,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(41,'9','9 & 10. Secondary Processing & Documentation Fees','Processing fee for Provisional or Semi',NULL,NULL,'Advance Payment','0','50%','50% of the fee paid at the time of obtaining the final certificate to be deducted.',410,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(42,'10','9 & 10. Secondary Processing & Documentation Fees','Obtaining a Certified True Copy of Certificates',NULL,NULL,'Fixed Rate','1500',NULL,'Government taxes applicable.',420,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(43,NULL,'Field Inspection Fees for De-registration/Dismantling','Properties located Outside Western Province',NULL,NULL,'Transport Charge','30',NULL,'Rate per Kilometer. Not applicable if transport facilities are provided.',430,1,'2026-06-24 04:13:18','2026-06-24 04:13:18'),(44,NULL,'Field Inspection Fees for De-registration/Dismantling','Properties located in Western Province (Outside Colombo)',NULL,NULL,'Fixed Field Fee','7500',NULL,'Flat field inspection fee. Government taxes applicable.',440,1,'2026-06-24 04:13:18','2026-06-24 04:13:18');
/*!40000 ALTER TABLE `application_tariffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(255) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`form_data`)),
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `applications_reference_no_unique` (`reference_no`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,'APP-YJGK4OX4','fgd bgedg','k@gmail.com','3432534353','amendment','{\"notes\":\"dsbvs bs fsd\"}','pending',NULL,'2026-06-18 04:47:41','2026-06-18 04:47:41'),(2,'APP-PXJ1FVJB','Sampath','it@cma.lk','022420530','mc_registration','{\"notes\":\"asdds\"}','processing',NULL,'2026-06-30 04:30:37','2026-06-30 04:33:15'),(3,'APP-NBZ1QDUK','vs xd','n@gmail.com','43253264436','mc_registration','{\"notes\":\"dsf sedf\"}','pending',NULL,'2026-06-30 07:33:51','2026-06-30 07:33:51');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `guest_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `nic` varchar(255) NOT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `unit_number` varchar(255) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `adults` int(11) NOT NULL DEFAULT 1,
  `children` int(11) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `amount` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `permanent_address` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `gov_letter` varchar(255) DEFAULT NULL,
  `is_cma_employee` tinyint(1) NOT NULL DEFAULT 0,
  `family_count` int(11) NOT NULL DEFAULT 0,
  `family_members` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_user_id_foreign` (`user_id`),
  CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,2,'Kamal dsgsgs','k@gmail.com','7687659957','4576476785685',NULL,'Room D – Budget','2026-06-05','2026-06-17',2,1,'Cancelled',54000.00,NULL,'2026-06-04 04:15:43','2026-06-07 23:37:33','dfgd gg dsg','dfgdgf',NULL,0,3,'[{\"name\":\"sg sdg\",\"nic\":\"43634\"},{\"name\":\"dfsdgds\",\"nic\":\"352554624\"},{\"name\":\"sdfsdfsd sfs\",\"nic\":\"23526466\"}]'),(2,2,'Kamal dsgsgs','k@gmail.com','7687659957','4576476785685',NULL,'Room B – Standard','2026-06-05','2026-06-17',2,1,'Cancelled',60000.00,NULL,'2026-06-04 04:15:43','2026-06-07 23:37:35','dfgd gg dsg','dfgdgf',NULL,0,3,'[{\"name\":\"sg sdg\",\"nic\":\"43634\"},{\"name\":\"dfsdgds\",\"nic\":\"352554624\"},{\"name\":\"sdfsdfsd sfs\",\"nic\":\"23526466\"}]'),(3,NULL,'adfsdfgdsaf','admin@condominium.lk','0112338146','BLOCK-0000',NULL,'Room B – Standard','2026-06-08','2026-06-11',0,0,'Cancelled',0.00,NULL,'2026-06-07 23:42:38','2026-06-30 07:30:52','Colombo, Sri Lanka','Official / Admin Block',NULL,0,0,'[]'),(4,2,'Kamal nimal','k@gmail.com','4235544254','67464665464656',NULL,'Room D – Budget','2026-06-18','2026-06-20',2,0,'Cancelled',9000.00,'hhmh','2026-06-14 23:39:46','2026-06-30 07:30:51','gbfhnnhzh','gfgfg',NULL,1,2,'[{\"name\":\"bfgbf\",\"nic\":\"647647647\"},{\"name\":\"nfhnfnh\",\"nic\":\"63636535\"}]'),(5,2,'Kamal nimal','k@gmail.com','4235544254','67464665464656',NULL,'Room B – Standard','2026-06-18','2026-06-20',2,0,'Cancelled',10000.00,'hhmh','2026-06-14 23:39:47','2026-06-30 07:30:50','gbfhnnhzh','gfgfg',NULL,1,2,'[{\"name\":\"bfgbf\",\"nic\":\"647647647\"},{\"name\":\"nfhnfnh\",\"nic\":\"63636535\"}]'),(6,5,'Thushara  002','it@cma.lk','0772503462','720523299v',NULL,'Room D – Budget','2026-07-05','2026-07-06',3,0,'Cancelled',4500.00,NULL,'2026-06-30 04:19:41','2026-06-30 07:30:50','zdsxzczc','zxcxcxc',NULL,1,0,'[]'),(7,5,'Thushara  002','it@cma.lk','0772503462','720523299v',NULL,'Room C – Suite','2026-07-05','2026-07-06',3,0,'Cancelled',7500.00,NULL,'2026-06-30 04:19:42','2026-06-30 07:30:49','zdsxzczc','zxcxcxc',NULL,1,0,'[]'),(8,4,'Nadeemal df sfsd','n@gmail.com','0712525256','200020600400',NULL,'Room B – Standard','2026-07-01','2026-07-14',2,0,'Cancelled',65000.00,'ds fsdfg','2026-06-30 07:25:46','2026-06-30 07:30:40','ds fsedfsd f','s dgfdsgf',NULL,0,0,'[]'),(9,4,'Nadeemal asdf asdfsfd wsf','n@gmail.com','0712525256','200020600400',NULL,'Room A – Deluxe','2026-07-02','2026-07-28',1,0,'Confirmed',156000.00,'df sgdsdgf sdg','2026-06-30 07:27:37','2026-07-01 05:49:35','sfdas fasfaf fa','dsfs sfsedfds',NULL,0,1,'[{\"name\":\"dsfsdvsdv\",\"nic\":\"23423535325342\"}]'),(10,4,'Nadeemal asdf asdfsfd wsf','n@gmail.com','0712525256','200020600400',NULL,'Room C – Suite','2026-07-15','2026-07-16',1,0,'Cancelled',7500.00,'df sgdsdgf sdg','2026-06-30 07:29:28','2026-06-30 07:30:47','sfdas fasfaf fa','dsfs sfsedfds',NULL,0,1,'[{\"name\":\"dsfsdvsdv\",\"nic\":\"23423535325342\"}]'),(11,4,'Nadeemal sdfsfdsdgs','n@gmail.com','0712525256','200020600400',NULL,'Room D – Budget','2026-07-01','2026-07-02',1,0,'Confirmed',4500.00,'sdf sdgf','2026-06-30 07:31:32','2026-07-01 05:49:34','r2w3r5343454','dfgdf fdhgdf',NULL,0,1,'[{\"name\":\"dfg dgdfgd g\",\"nic\":\"2342332533235\"}]'),(12,4,'Nadeemal dsgfdsg sdfsf','n@gmail.com','0712525256','200020600400',NULL,'Room B – Standard','2026-07-03','2026-07-13',1,0,'Confirmed',50000.00,'dsdsg','2026-07-01 05:49:05','2026-07-01 05:49:32','sdvdsrdsds','dsfssdgds',NULL,0,1,'[{\"name\":\"dgsgdgs\",\"nic\":\"32535535\"}]'),(13,4,'Nadeemal dsgfdsg sdfsf','n@gmail.com','0712525256','200020600400',NULL,'Room D – Budget','2026-07-03','2026-07-13',1,0,'Confirmed',45000.00,'dsdsg','2026-07-01 05:49:05','2026-07-01 05:49:33','sdvdsrdsds','dsfssdgds',NULL,0,1,'[{\"name\":\"dgsgdgs\",\"nic\":\"32535535\"}]');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bungalow_rooms`
--

DROP TABLE IF EXISTS `bungalow_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bungalow_rooms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `beds` varchar(255) NOT NULL,
  `capacity` varchar(255) NOT NULL,
  `ac` tinyint(1) NOT NULL DEFAULT 1,
  `view` varchar(255) NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `emp_price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bungalow_rooms`
--

LOCK TABLES `bungalow_rooms` WRITE;
/*!40000 ALTER TABLE `bungalow_rooms` DISABLE KEYS */;
INSERT INTO `bungalow_rooms` VALUES (1,'Room A – Deluxe','1 King Bed','2 Adults',1,'Garden View','🛏️',6000.00,4800.00,'uploads/nE9YO6OOOkEppnhnMNzOtNQ45OSSJJF80P9zyiN6.jpg','2026-06-03 21:57:32','2026-06-18 03:45:54'),(2,'Room B – Standard','1 Queen Bed','2 Adults',1,'Courtyard View','🛏️',5000.00,4000.00,'uploads/2q1pjSwHyUvR61KnShhlWqTLWTSQHwFY79dvvP3N.jpg','2026-06-03 21:57:32','2026-06-18 03:45:47'),(3,'Room C – Suite','1 King Bed + 1 Sofa Bed','3 Adults',1,'Panoramic View','🛋️',7500.00,6000.00,'uploads/v0l5GxK16laxF2AT06E4JNkDZBTj7BNTbRQzPxVc.jpg','2026-06-03 21:57:32','2026-06-18 03:46:01'),(4,'Room D – Budget','2 Single Beds','2 Adults',0,'No View','🛏️',4500.00,3600.00,'uploads/3hl79zX6x02NTg1KNUWpcgQccEyzkp49GmdpYAO7.jpg','2026-06-03 21:57:32','2026-06-18 03:45:39');
/*!40000 ALTER TABLE `bungalow_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_documents`
--

DROP TABLE IF EXISTS `certificate_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `certificate_type_id` bigint(20) unsigned NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `certificate_documents_certificate_type_id_foreign` (`certificate_type_id`),
  CONSTRAINT `certificate_documents_certificate_type_id_foreign` FOREIGN KEY (`certificate_type_id`) REFERENCES `certificate_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_documents`
--

LOCK TABLES `certificate_documents` WRITE;
/*!40000 ALTER TABLE `certificate_documents` DISABLE KEYS */;
INSERT INTO `certificate_documents` VALUES (1,1,'PPC Application Form','PPC අයදුම්පත','PPC விண்ணப்பப் படிவம்','documents/ppc_application.pdf','ppc_application.pdf','pdf',1,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(2,2,'Provisional Certificate Guide & Form','තත්කාලීන සහතික මාර්ගෝපදේශය සහ අයදුම්පත','தற்காலிக சான்றிதழ் வழிகாட்டி மற்றும் விண்ணப்பம்','documents/provisional_guide.pdf','provisional_guide.pdf','pdf',1,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(3,3,'Semi Condominium Registration Forms','අර්ධ සහාධිපත්‍ය ලියාපදිංචි කිරීමේ පත්‍රිකා','அரை அடுக்குமாடி பதிவு படிவங்கள்','documents/semi_forms.pdf','semi_forms.pdf','pdf',1,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(4,4,'Final Condominium Registration Forms & CoC Checklist','අවසාන සහාධිපත්‍ය ලියාපදිංචි කිරීමේ ආකෘති සහ ලේඛන ලැයිස්තුව','இறுதி அடுக்குமாடி பதிவு படிவங்கள் மற்றும் சரிபார்ப்பு பட்டியல்','documents/final_checklist.pdf','final_checklist.pdf','pdf',1,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(5,1,'test',NULL,NULL,'uploads/PFdzbzQY22TAku8IFlu4PGKe4FMaf94ipzSAs2kR.pdf','1123_20260602_28220_Jayawardhana_L__Request_Letter.pdf','PDF',2,1,'2026-06-03 22:02:08','2026-06-03 22:02:08'),(6,1,'test',NULL,NULL,'uploads/EYsRDpSjz6UxVyKrsCfrGq37xAvx1VbUrxTzpBta.png','logo.png','PNG',3,1,'2026-06-03 22:02:19','2026-06-03 22:02:19');
/*!40000 ALTER TABLE `certificate_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_payments`
--

DROP TABLE IF EXISTS `certificate_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(255) NOT NULL,
  `certificate_type_id` bigint(20) unsigned NOT NULL,
  `citizen_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_payments_reference_no_unique` (`reference_no`),
  KEY `certificate_payments_certificate_type_id_foreign` (`certificate_type_id`),
  CONSTRAINT `certificate_payments_certificate_type_id_foreign` FOREIGN KEY (`certificate_type_id`) REFERENCES `certificate_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_payments`
--

LOCK TABLES `certificate_payments` WRITE;
/*!40000 ALTER TABLE `certificate_payments` DISABLE KEYS */;
INSERT INTO `certificate_payments` VALUES (1,'CERT-TWVM0ZEZ-260604',1,2,5000.00,'completed','demo_bypass',NULL,'2026-06-03 22:03:13','2026-06-03 22:03:12','2026-06-03 22:03:13'),(2,'CERT-R7361MEP-260604',4,2,15000.00,'completed','demo_bypass',NULL,'2026-06-04 01:45:10','2026-06-04 01:45:10','2026-06-04 01:45:10'),(3,'CERT-JD63OW9B-260604',3,2,10000.00,'completed','demo_bypass',NULL,'2026-06-04 04:23:03','2026-06-04 04:23:02','2026-06-04 04:23:03');
/*!40000 ALTER TABLE `certificate_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_types`
--

DROP TABLE IF EXISTS `certificate_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `instructions_en` longtext DEFAULT NULL,
  `instructions_si` longtext DEFAULT NULL,
  `instructions_ta` longtext DEFAULT NULL,
  `document_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_types_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_types`
--

LOCK TABLES `certificate_types` WRITE;
/*!40000 ALTER TABLE `certificate_types` DISABLE KEYS */;
INSERT INTO `certificate_types` VALUES (1,'ppc','Preliminary Planning Clearance (PPC)','මූලික සැලසුම් අනුමැතිය (PPC)','முன்னோடி திட்டமிடல் அனுமதி (PPC)','# Requirements for Preliminary Planning Clearance (PPC)\n- Duly completed application form.\n- Copies of building plans approved by the local authority.\n- Survey plan of the land.\n- Copy of the deed.\n- Relevant clearances from other government authorities.\n\nPlease click \'Download Document\' below to pay the document fee and access the downloadable files.','# මූලික සැලසුම් අනුමැතිය (PPC) සඳහා අවශ්‍යතා\n- නිවැරදිව සම්පූර්ණ කරන ලද අයදුම්පත.\n- පළාත් පාලන ආයතනය විසින් අනුමත කරන ලද ගොඩනැගිලි සැලසුම්වල පිටපත්.\n- ඉඩමේ මිනින්දෝරු සැලැස්ම.\n- ඔප්පුවේ පිටපතක්.','# முன்னோடி திட்டமிடல் அனுமதி (PPC) க்கான தேவைகள்\n- முறையாக பூர்த்தி செய்யப்பட்ட விண்ணப்பப் படிவம்.\n- உள்ளூர் அதிகாரசபையால் அங்கீகரிக்கப்பட்ட கட்டிட திட்டங்களின் பிரதிகள்.\n- நிலத்தின் அளவீட்டு வரைபடம்.\n- பத்திரத்தின் நகல்.',5.00,1,1,'2026-06-03 21:54:17','2026-07-01 05:04:25'),(2,'provisional','Provisional Condominium Certificate','තත්කාලීන සහාධිපත්‍ය සහතිකය','தற்காலிக அடுக்குமாடி குடியிருப்பு சான்றிதழ்','# Requirements for Provisional Condominium Certificate\n- Approved architectural plans showing proposed units.\n- Draft declaration of the condominium.\n- Schedule of share values for each unit.\n- Receipt of the processing fee payment.\n\nPlease click \'Download Document\' below to pay the document fee and access the downloadable files.','# තත්කාලීන සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- යෝජිත ඒකක පෙන්වන අනුමත ගෘහ නිර්මාණ සැලසුම්.\n- සහාධිපත්‍යයේ කෙටුම්පත් ප්‍රකාශය.\n- එක් එක් ඒකකය සඳහා කොටස් අගයන්ගේ උපලේඛනය.','# தற்காலிக அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- முன்மொழியப்பட்ட அலகுகளைக் காட்டும் அங்கீகரிக்கப்பட்ட கட்டிடக்கலை திட்டங்கள்.\n- அடுக்குமாடி குடியிருப்பின் வரைவு பிரகடனம்.\n- ஒவ்வொரு அலகுக்குமான பங்கு மதிப்புகளின் அட்டவணை.',7500.00,2,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(3,'semi','Semi Condominium Certificate','අර්ධ සහාධිපත්‍ය සහතිකය','அரை அடுக்குமாடி குடியிருப்பு சான்றிதழ்','# Requirements for Semi Condominium Certificate\n- Certification of partially completed building.\n- Registered survey plan showing existing structures and common elements.\n- Draft condominium declaration.\n- Clearance from structural engineer.\n\nPlease click \'Download Document\' below to pay the document fee and access the downloadable files.','# අර්ධ සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- කොටසක් නිම කරන ලද ගොඩනැගිල්ලේ සහතිකය.\n- පවතින ව්‍යුහයන් සහ පොදු අංග පෙන්වන ලියාපදිංචි මිනින්දෝරු සැලැස්ම.\n- ව්‍යුහාත්මක ඉංජිනේරු නිශ්කාෂණය.','# அரை அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- பகுதி பூர்த்தி செய்யப்பட்ட கட்டிடத்தின் சான்றிதழ்.\n- தற்போதுள்ள கட்டமைப்புகள் மற்றும் பொதுவான கூறுகளைக் காட்டும் பதிவு செய்யப்பட்ட அளவீட்டு வரைபடம்.\n- கட்டமைப்பு பொறியியலாளரின் அனுமதி.',10000.00,3,1,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(4,'final','Final Condominium Certificate','අවසාන සහාධිපත්‍ය සහතිකය','இறுதி அடுக்குமாடி குடியிருப்பு சான்றிதழ்','# Requirements for Final Condominium Certificate\n- Certificate of Conformity (CoC) from local authority.\n- Final registered condominium survey plan prepared by a licensed surveyor.\n- Final declaration and articles of association of the Management Corporation.\n- Fire clearance certificate and structural stability report.\n\nPlease click \'Download Document\' below to pay the document fee and access the downloadable files.','# අවසාන සහාධිපත්‍ය සහතිකය සඳහා අවශ්‍යතා\n- පළාත් පාලන ආයතනයෙන් අනුකූලතා සහතිකය (CoC).\n- බලපත්‍රලාභී මිනින්දෝරුවෙකු විසින් සකස් කරන ලද අවසාන ලියාපදිංචි සහාධිපත්‍ය මිනින්දෝරු සැලැස්ම.\n- කළමනාකරණ සංගමයේ අවසාන ප්‍රකාශය.','# இறுதி அடுக்குமாடி குடியிருப்பு சான்றிதழுக்கான தேவைகள்\n- உள்ளூர் அதிகாரசபையின் இணக்கச் சான்றிதழ் (CoC).\n- உரிமம் பெற்ற அளவையாளரால் தயாரிக்கப்பட்ட இறுதி பதிவு செய்யப்பட்ட அடுக்குமாடி அளவீட்டு வரைபடம்.\n- நிர்வாகக் கழகத்தின் இறுதிப் பிரகடனம்.',15000.00,4,1,'2026-06-03 21:54:17','2026-06-03 21:54:17');
/*!40000 ALTER TABLE `certificate_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citizen_submissions`
--

DROP TABLE IF EXISTS `citizen_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `citizen_submissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `reference_no` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`form_data`)),
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `citizen_submissions_reference_no_unique` (`reference_no`),
  KEY `citizen_submissions_user_id_foreign` (`user_id`),
  CONSTRAINT `citizen_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citizen_submissions`
--

LOCK TABLES `citizen_submissions` WRITE;
/*!40000 ALTER TABLE `citizen_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `citizen_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'new',
  `reply` text DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complaints_user_id_foreign` (`user_id`),
  CONSTRAINT `complaints_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'Nadeemal','n@gmail.com','0712525256','fgdfhfdhbdf','fdhg dhdfhdfhr fhdfhsdf hdfh fhds','removed','Okeyyyyy we will call you later','2026-07-01 07:22:20','2026-07-01 07:19:12','2026-07-01 07:29:12',4),(2,'Nadeemal','n@gmail.com','0712525256','Kasun','IT ekt room ekk oni','removed',NULL,NULL,'2026-07-01 07:23:18','2026-07-01 07:29:10',4),(3,'lll','lll@gmail.com','188189393','Lakmal','Badagini','removed','Kanna denne','2026-07-01 07:31:24','2026-07-01 07:26:16','2026-07-01 07:31:32',3);
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condominiums`
--

DROP TABLE IF EXISTS `condominiums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `condominiums` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `registration_no` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `unit_count` int(11) DEFAULT NULL,
  `developer_name` varchar(255) DEFAULT NULL,
  `mc_name` varchar(255) DEFAULT NULL,
  `mc_registration_no` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'registered',
  `registered_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `condominiums_registration_no_unique` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condominiums`
--

LOCK TABLES `condominiums` WRITE;
/*!40000 ALTER TABLE `condominiums` DISABLE KEYS */;
/*!40000 ALTER TABLE `condominiums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL DEFAULT 'en',
  `year` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'Semi Certificate Application','තාවකාලික සහතික අයදුම්පත','அடுக்குமாடி சொத்து சட்டம்','form','application','uploads/csHQ0J2prFndLejQBXwByNk8b5OM8L7o5Q8fL1sH.pdf','en',2026,1,'2026-06-03 21:54:17','2026-06-04 02:03:22'),(2,'Final Certificate Application','අවසාන සහාධිපත්‍ය සහතිකපත් අයදුම්පත','குடியிருப்பு உரிமை சட்டம்','form','application','uploads/PAeHlcvqyscUitmtbnG4etDmG1MyFQxcpFuVjQzC.pdf','en',2026,1,'2026-06-03 21:54:17','2026-06-04 02:05:03'),(3,'Provisional Certificate Application','තාවකාලික සහතික අයදුම්පත','பொது வசதிகள் குழு சட்டம்','form','්චචකසජ්එසදබ','uploads/kyR3wxG4zC4hnEiltZGJtyDgHJ8Rq1Bl1Opvbs4A.pdf','en',2026,1,'2026-06-03 21:54:17','2026-06-04 02:01:31'),(4,'Extra Ordery Gazzate - 26/25 -  Sinhala','අති විශේෂ ගැසට් පත්‍රය - 26/25 - Sinhala','්‍ර','law','gazatte','uploads/kMKEyShOIwTVcZPHMBEIBU9ChOOfTaeTKHstrZlh.pdf','si',2026,1,'2026-06-03 21:54:17','2026-06-04 02:10:02'),(5,'Certificate Issuance Guideline','සහතික නිකුත් කිරීමේ මාර්ගෝපදේශ',NULL,'publication','leaflet','uploads/tyS3jYvZA4HeS7hB2coJSzHRaBJtF7BdEk6isvwE.pdf','en',2026,1,'2026-06-04 02:13:12','2026-06-04 02:13:12');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `message` text NOT NULL,
  `message_si` text DEFAULT NULL,
  `message_ta` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,'da','d@gmail.com',3,'aaaa','aaa','aaa','2026-06-23 01:05:15','2026-06-23 01:05:15'),(2,'aaaaaaaaa',NULL,5,'A','ඒ','ஏ','2026-06-23 01:05:35','2026-06-23 01:05:35'),(3,NULL,NULL,4,'EWWEWE','හරි හරී','சரி','2026-06-23 01:06:06','2026-06-23 01:06:06');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_slides`
--

DROP TABLE IF EXISTS `hero_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero_slides` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `subtitle_en` varchar(255) DEFAULT NULL,
  `subtitle_si` varchar(255) DEFAULT NULL,
  `subtitle_ta` varchar(255) DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `description_si` text DEFAULT NULL,
  `description_ta` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `button_text_en` varchar(255) DEFAULT NULL,
  `button_text_si` varchar(255) DEFAULT NULL,
  `button_text_ta` varchar(255) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_slides`
--

LOCK TABLES `hero_slides` WRITE;
/*!40000 ALTER TABLE `hero_slides` DISABLE KEYS */;
INSERT INTO `hero_slides` VALUES (1,'Sri Lanka\'s Urban Future Together','ශ්‍රී ලංකාවේ නාගරික අනාගතය ගොඩනඟමු','இலங்கையின் நகர்ப்புற எதிர்காலத்தை ஒன்றாக கட்டமைப்போம்','Condominium Management Authority','සහාධිපත්‍ය කළමනාකරණ අධිකාරිය','அடுக்குமாடி குடியிருப்பு மேலாண்மை ஆணையம்','Sri Lanka\'s premier regulatory body for condominium properties','ශ්‍රී ලංකාවේ සහාධිපත්‍ය දේපළ සඳහා ප්‍රමුඛ නියාමන ආයතනය','இலங்கையின் முன்னணி ஒழுங்குமுறை அமைப்பு','uploads/LK2HJ6r1Nc2HYc5uup2rv9TEh1PtDwt9iwr7npt8.jpg','Learn More','','','/about',1,1,'2026-06-03 21:54:17','2026-07-01 06:57:08'),(2,'Ensuring Excellence in Condominium Living','සහාධිපත්‍ය ජීවිතයේ විශිෂ්ටතාව සහතික කිරීම','அடுக்குமாடி வாழ்வில் சிறப்பை உறுதி செய்கிறோம்','Empowering Communities','ප්‍රජාවන් සවිබල ගැන්වීම','சமூகங்களை வலுப்படுத்துகிறோம்','Efficient, transparent and fair management practices across Sri Lanka','ශ්‍රී ලංකාව පුරා කාර්යක්ෂම, විනිවිද පෙනෙන කළමනාකරණය','திறமையான, வெளிப்படையான நிர்வாக நடைமுறைகள்','uploads/6Eo1yBwONhR1x24o898Bm8ufVH8z0ScbHtFIVhzE.jpg','Our Services',NULL,NULL,'/applications',2,1,'2026-06-03 21:54:17','2026-06-03 22:50:42');
/*!40000 ALTER TABLE `hero_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vacancy_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `cv_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_applications_vacancy_id_foreign` (`vacancy_id`),
  CONSTRAINT `job_applications_vacancy_id_foreign` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (2,5,'dddddddddddd','ddddddddddd@gmail.com',NULL,'eccd','cvs/4mIR2uaQNLjyJ8XcaLEYQtVpoNPUDf5V6dtGIQCb.pdf','2026-06-18 04:40:17','2026-06-18 04:40:17');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laws`
--

DROP TABLE IF EXISTS `laws`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `laws` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laws`
--

LOCK TABLES `laws` WRITE;
/*!40000 ALTER TABLE `laws` DISABLE KEYS */;
INSERT INTO `laws` VALUES (1,'Common Amenities Board Law, No. 10 of 1973','Establishes the Common Amenities Board (CAB) as a public authority responsible for controlling, managing, maintaining, and administering the common elements and shared amenities of multi-unit residential or commercial buildings.','laws/ltkWzQbCpLv4P57CjtmB78RFC4lxOMCr4zqXhAfY.pdf',1,1,'2026-06-24 03:45:55','2026-06-24 03:59:27'),(2,'Apartment Ownership Law, No. 11 of 1973','The principal enactment that governs the condominium concept in Sri Lanka. It provides the legal framework for subdividing multi-storey buildings into independent units (apartments) with separate legal ownership titles, while keeping shared zones (like hallways, roofs, and land) as common elements.','laws/IzieYyC8E3Chy310Ofa7YZriBLfolB42Pk0ghj73.pdf',2,1,'2026-06-24 03:45:55','2026-06-24 03:59:42'),(3,'Apartment Ownership (Amendment) Act, No. 45 of 1982','Amends the principal 1973 law to systematically regulate the Management Corporations (bodies formed by individual unit owners). It outlines statutory rules for things like council sizes, voting majorities, financial auditing, and meeting quorums.',NULL,3,1,'2026-06-24 03:45:55','2026-06-24 03:45:55'),(4,'Apartment Ownership (Amendment) Act, No. 39 of 2003','Significantly updated the law to handle changing real estate trends by introducing and regulating Provisional Condominium Plans (for properties under planning or construction) and Semi-Condominium Plans (for partially completed buildings). It made the registration of these completed plans legally mandatory before individual units could be sold or occupied.',NULL,4,1,'2026-06-24 03:45:55','2026-06-24 03:45:55'),(5,'Common Amenities Board (Amendment) Act, No. 24 of 2003','Amended the 1973 Common Amenities Board Law to re-establish and re-brand the entity as the Condominium Management Authority (CMA). It granted the authority expanded powers to regulate developers, register management corporations, and resolve maintenance disputes.',NULL,5,1,'2026-06-24 03:45:55','2026-06-24 03:45:55'),(6,'Apartment Ownership (Special Provisions) Act, No. 23 of 2018','A temporary, specialized piece of legislation enacted to expedite and facilitate the legal registration and title disposition of older or complex housing/condominium properties owned directly by the State or state agencies (such as public housing schemes).',NULL,6,1,'2026-06-24 03:45:55','2026-06-24 03:45:55'),(7,'Extraordinary Gazette No. 2026/25 of 05.07.2017','A specific regulatory directive issued by the relevant Ministry under the Condominium Management Authority framework. It officially outlines the updated administrative procedures, basic conformity requirements, guidelines, and structural fee schedules necessary for obtaining condominium certificates and approvals.',NULL,7,1,'2026-06-24 03:45:55','2026-06-24 03:45:55');
/*!40000 ALTER TABLE `laws` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaders`
--

DROP TABLE IF EXISTS `leaders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name_en` varchar(255) DEFAULT NULL,
  `name_si` varchar(255) DEFAULT NULL,
  `name_ta` varchar(255) DEFAULT NULL,
  `position_en` varchar(255) NOT NULL,
  `position_si` varchar(255) DEFAULT NULL,
  `position_ta` varchar(255) DEFAULT NULL,
  `bio_en` text DEFAULT NULL,
  `bio_si` text DEFAULT NULL,
  `bio_ta` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaders`
--

LOCK TABLES `leaders` WRITE;
/*!40000 ALTER TABLE `leaders` DISABLE KEYS */;
INSERT INTO `leaders` VALUES (1,'Hon. Anura Kumara Dissanayake','ගරු. අනුර කුමාර දිසානායක මහතා','அநுர குமார திசாநாயக்க','President of the Democratic Socialist Republic of Sri Lanka','ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජයේ ගරු ජනාධිපති','ஜனாதிபதி','','','','uploads/15yjNZZ0YBhVPWc4SOCcGhVFfLFTJFgUKDHFtxl8.jpg','ps@presidentsoffice.lk','',1,1,'2026-06-03 21:54:17','2026-07-01 02:39:56'),(2,'Hon.Harini Amarasooriya','Hon.Harini Amarasooriya','Hon.Harini Amarasooriya','Prime Minister of the Democratic Socialist Republic of Sri Lanka','ශ්‍රී ලංකා ප්‍රජාතන්ත්‍රවාදී සමාජවාදී ජනරජයේ ගරු අග්‍රාමාත්‍ය','கௌரவ பிரதமர்',NULL,NULL,NULL,'uploads/1r7wWaqwISnkcvlRwoqgClZ6RCIi63Odd8wzKR6Z.jpg','info@pmoffice.gov.lk',NULL,2,1,'2026-06-03 21:54:17','2026-06-29 23:38:50'),(3,'Hon.Bimal Rathnayaka','Hon.Bimal Rathnayaka','Hon.Bimal Rathnayaka','Minister of the Transport,Highways and Urban Development','ප්‍රවාහන,මහා මාර්ග සහ නාගරික සංවර්ධන ගරු අමාත්‍ය','கௌரவ அமைச்சர்',NULL,NULL,NULL,'uploads/uNnLJy30caddY2tnxYx5ompeaOi4OMtFsmiVBz4W.jpg',NULL,NULL,3,1,'2026-06-03 21:54:17','2026-06-29 23:39:56'),(4,'Hon. Eranga Gunasekara','Hon. Eranga Gunasekara','Hon. Eranga Gunasekara','Deputy Minister of Urban Development','නාගරික සංවර්ධන නියෝජ්‍ය අමාත්‍ය','துணை அமைச்சர்',NULL,NULL,NULL,'uploads/0OMSoABRvbuusDpPNvOChzpVJWPWMsB8wCPzNEcM.jpg',NULL,NULL,4,1,'2026-06-03 21:54:17','2026-06-29 23:40:10'),(5,'Mr.Nishan Nanayakkara','Mr.Nishan Nanayakkara','Mr.Nishan Nanayakkara','Chairman - Condominium Management Authority','සභාපති - සහාධිපත්‍ය කළමනාකරණ අධිකාරිය','தலைவர்','','','','uploads/wEGlJ9jbGAExvg5BnYsFvE0iWGekRyIYn4qY5rQP.png','','',5,1,'2026-06-03 21:54:17','2026-07-01 08:02:24'),(6,'Archt. Kapila Priyantha','','','General Manager','','','','','','uploads/yqWTPA9fIzk6LgtyH5IjX2ScpEZ7D7ValSCUZuiL.png','','',6,1,'2026-07-01 07:53:48','2026-07-01 08:14:01');
/*!40000 ALTER TABLE `leaders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mc_fee_settings`
--

DROP TABLE IF EXISTS `mc_fee_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mc_fee_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tax1_name` varchar(255) NOT NULL DEFAULT 'NBT',
  `tax1_rate` decimal(5,2) NOT NULL DEFAULT 2.00,
  `tax2_name` varchar(255) NOT NULL DEFAULT 'VAT',
  `tax2_rate` decimal(5,2) NOT NULL DEFAULT 12.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mc_fee_settings`
--

LOCK TABLES `mc_fee_settings` WRITE;
/*!40000 ALTER TABLE `mc_fee_settings` DISABLE KEYS */;
INSERT INTO `mc_fee_settings` VALUES (1,'NBT',2.00,'VAT',12.00,'2026-06-08 00:08:24','2026-06-08 00:14:42');
/*!40000 ALTER TABLE `mc_fee_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mc_fees`
--

DROP TABLE IF EXISTS `mc_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mc_fees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description_en` varchar(255) NOT NULL,
  `description_si` varchar(255) DEFAULT NULL,
  `description_ta` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `nbt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vat` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mc_fees`
--

LOCK TABLES `mc_fees` WRITE;
/*!40000 ALTER TABLE `mc_fees` DISABLE KEYS */;
INSERT INTO `mc_fees` VALUES (10,'Issue of Application Form','අයදුම්පත නිකුත් කිරීම','விண்ணப்பப் படிவம் வழங்குதல்','application',250.00,5.00,30.00,285.00,1,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(11,'Tsunami MC','සුනාමි කළමනාකරණ සංගමය','சுனாமி மேலாண்மைக் கழகம்','registration',200.00,4.00,24.00,228.00,2,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(12,'NHDA Management Committee','ජාතික නිවාස සංවර්ධන අධිකාරී කළමනාකරණ කමිටුව','NHDA மேலாண்மைக் குழு','registration',250.00,5.00,30.00,285.00,3,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(13,'NHDA Management Corporation','ජාතික නිවාස සංවර්ධන අධිකාරී කළමනාකරණ සංස්ථාව','NHDA மேலாண்மைக் கழகம்','registration',500.00,10.00,60.00,570.00,4,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(14,'10 Parcels','කොටස් 10','10 அலகுகள்','registration',1000.00,20.00,120.00,1140.00,5,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(15,'11-20 Parcels','කොටස් 11-20','11-20 அலகுகள்','registration',1500.00,30.00,180.00,1710.00,6,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(16,'21-30 Parcels','කොටස් 21-30','21-30 அலகுகள்','registration',2500.00,50.00,300.00,2850.00,7,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(17,'31-40 Parcels','කොටස් 31-40','31-40 அலகுகள்','registration',3500.00,70.00,420.00,3990.00,8,1,'2026-06-08 00:01:38','2026-06-08 00:14:42'),(18,'41 Above','කොටස් 41 හෝ ඊට වැඩි','41 இற்கு மேல்','registration',5000.00,100.00,600.00,5700.00,9,1,'2026-06-08 00:01:38','2026-06-08 00:14:42');
/*!40000 ALTER TABLE `mc_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2024_01_01_000001_create_cma_tables',1),(5,'2024_01_01_000002_add_role_to_users',1),(6,'2026_06_01_045620_create_personal_access_tokens_table',1),(7,'2026_06_01_114500_create_citizen_submissions_table',1),(8,'2026_06_01_142000_create_bookings_table',1),(9,'2026_06_01_143000_add_guesthouse_fields_to_bookings_table',1),(10,'2026_06_01_150000_create_bungalow_rooms_table',1),(11,'2026_06_01_160000_create_feedbacks_table',1),(12,'2026_06_02_170000_add_translations_to_feedbacks_table',1),(13,'2026_06_02_180000_create_staff_members_table',1),(14,'2026_06_03_100000_create_certificate_types_table',1),(15,'2026_06_03_100001_create_certificate_documents_table',1),(16,'2026_06_03_100002_create_certificate_payments_table',1),(17,'2026_06_08_120000_create_mc_fees_table',2),(18,'2026_06_08_130000_create_mc_fee_settings_table',3),(19,'2026_06_08_090936_create_application_tariffs_table',4),(20,'2026_06_09_053614_create_job_applications_table',5),(21,'2026_06_09_053722_add_document_path_to_vacancies_table',5),(22,'2026_06_15_045045_create_application_forms_table',6),(23,'2026_06_23_034158_add_phone_and_nic_to_users_table',7),(24,'2026_06_23_041033_add_profile_picture_to_users_table',8),(25,'2026_06_24_091432_create_laws_table',9),(27,'2026_06_24_093833_update_application_tariffs_table_for_pdf',10),(28,'2026_06_30_060000_add_name_translations_to_leaders_table',11),(29,'2026_07_01_181513_add_user_id_to_complaints_table',12);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_events`
--

DROP TABLE IF EXISTS `news_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `body_en` longtext DEFAULT NULL,
  `body_si` longtext DEFAULT NULL,
  `body_ta` longtext DEFAULT NULL,
  `excerpt_en` varchar(255) DEFAULT NULL,
  `excerpt_si` varchar(255) DEFAULT NULL,
  `excerpt_ta` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'news',
  `slug` varchar(255) NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_events_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_events`
--

LOCK TABLES `news_events` WRITE;
/*!40000 ALTER TABLE `news_events` DISABLE KEYS */;
INSERT INTO `news_events` VALUES (1,'Clean Sri Lanka Project Initiative','ශ්‍රී ලංකාව පිරිසිදු කිරීමේ ව්‍යාපෘතිය','சுத்தமான இலங்கை திட்டம்','<p>As part of the Clean Sri Lanka Project, the cleaning initiative for apartment schemes is scheduled to commence. The Condominium Management Authority is committed to maintaining clean and green living spaces across all registered condominiums.</p>',NULL,NULL,'CMA participates in the national Clean Sri Lanka initiative to beautify condominium complexes.',NULL,NULL,'uploads/C3P9RrlXB4MwuOOYQIF0ksvJphTIiI6D4T9P0dgM.jpg','news','clean-sri-lanka-project',1,'2026-01-14 18:30:00','2026-06-03 21:54:17','2026-06-22 23:51:27'),(2,'Real Estate Agents Advised to Ramp up AML Measures','දේපළ නියෝජිතයන්ට AML ක්‍රියාමාර්ග ශක්තිමත් කරන ලෙස උපදෙස්','ரியல் எஸ்டேட் முகவர்களுக்கு AML நடவடிக்கைகளை வலுப்படுத்த அறிவுரை','<p>The Financial Intelligence Unit (FIU) of the Central Bank of Sri Lanka organized an awareness program on AML/CFT Compliance Obligations. The Chairman of the Condominium Management Authority also attended.</p>',NULL,NULL,'FIU organized an awareness program on Anti-Money Laundering obligations for real estate sector.',NULL,NULL,'uploads/xajRPaipyyPKuQQXlTjSncl9P4746luUQjePNcoo.jpg','event','aml-awareness-2023',1,'2023-07-10 18:30:00','2026-06-03 21:54:17','2026-06-22 23:53:04'),(3,'Registration of Property Developers – 2026','දේපළ සංවර්ධකයන් ලියාපදිංචි කිරීම – 2026','சொத்து உருவாக்குனர்களின் பதிவு – 2026','<p>The Condominium Management Authority is gathering information of property developers for the year 2026. All registered and new developers are requested to submit their updated information.</p>',NULL,NULL,'Information gathering for property developers is now open. Download the application form.',NULL,NULL,'uploads/gHtPYZGjVHxoEeymen5ut7AHOy0JoXQrdIE4gS4E.jpg','announcement','property-developer-registration-2026',1,'2026-01-09 18:30:00','2026-06-03 21:54:17','2026-06-22 23:52:22');
/*!40000 ALTER TABLE `news_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (2,'App\\Models\\User',1,'cma-admin','d7edc9fd6f285999501356186c5159bc5e1c30969674a37fe35d04ec07a5c688','[\"*\"]','2026-06-03 21:58:13',NULL,'2026-06-03 21:58:04','2026-06-03 21:58:13'),(3,'App\\Models\\User',2,'cma-citizen','b666c774299e7acfee492ff21410d88f2ecc8fc60262a2f813491db5658bc3c7','[\"*\"]',NULL,NULL,'2026-06-03 22:03:00','2026-06-03 22:03:00'),(4,'App\\Models\\User',2,'cma-citizen','b2d89e69b98d095d250dc0668eba9d14084adf4db0880b2e9f7742096b5f79dc','[\"*\"]','2026-06-03 22:03:28',NULL,'2026-06-03 22:03:06','2026-06-03 22:03:28'),(5,'App\\Models\\User',1,'cma-admin','5c7a39948fb909fdc896132fed88f0a3eed8e290194b8b6c20b8e3f27b2dd523','[\"*\"]','2026-06-03 22:37:04',NULL,'2026-06-03 22:14:37','2026-06-03 22:37:04'),(6,'App\\Models\\User',2,'cma-citizen','b688e193c1ba2f4b712b8bb08c22bae47e653c91b022aa1dcd7b6e1e45eceac2','[\"*\"]','2026-06-03 22:32:39',NULL,'2026-06-03 22:32:09','2026-06-03 22:32:39'),(7,'App\\Models\\User',2,'cma-citizen','f86c99364b7c6cffa02c97d16f8f85a4a682554defb3bc36c77d0c4041922162','[\"*\"]','2026-06-04 01:45:12',NULL,'2026-06-04 01:44:51','2026-06-04 01:45:12'),(8,'App\\Models\\User',1,'cma-admin','db737da0ccae979b53906bfda04763d24f234f3adfd4a2c48b32d12f1fb19a9c','[\"*\"]','2026-07-01 06:02:04',NULL,'2026-06-04 01:46:32','2026-07-01 06:02:04'),(9,'App\\Models\\User',2,'cma-citizen','8e9f5eb45c1c0f658d48d533744fc7d6765d45d9957a8fca3952f5557198e204','[\"*\"]','2026-07-01 04:58:53',NULL,'2026-06-04 04:13:55','2026-07-01 04:58:53'),(10,'App\\Models\\User',2,'cma-citizen','6c3b7cfef1578453d49ad73bf045f120a842b946dba233a36898ab0f37e571e0','[\"*\"]','2026-06-08 00:22:38',NULL,'2026-06-08 00:22:29','2026-06-08 00:22:38'),(11,'App\\Models\\User',2,'cma-citizen','d9c8470c5f62188d93d152c11b4d0b8fedb68f61f7b5aed6871331c0bd2e94e7','[\"*\"]','2026-06-08 22:22:34',NULL,'2026-06-08 22:14:40','2026-06-08 22:22:34'),(17,'App\\Models\\User',2,'cma-citizen','daf1550f6fcd1ad2dbe8b85577284cd164f2acce87fcb4ca2d3e9901dff97e91','[\"*\"]','2026-06-09 02:38:57',NULL,'2026-06-09 02:38:47','2026-06-09 02:38:57'),(18,'App\\Models\\User',1,'cma-admin','451272b10b9f713132e119ec695c3764960f972ee6692687105ebce6a90520e5','[\"*\"]','2026-06-11 00:14:01',NULL,'2026-06-09 02:39:44','2026-06-11 00:14:01'),(19,'App\\Models\\User',2,'cma-citizen','a570621708b1362093be770ef3182b27d4b629b645d19fb8fc09278e680e6699','[\"*\"]','2026-06-10 01:19:59',NULL,'2026-06-10 01:19:46','2026-06-10 01:19:59'),(20,'App\\Models\\User',3,'cma-citizen','0191092c92d9225a1f3a565010663c27a5904347b6b374c6280f22144615fe28','[\"*\"]',NULL,NULL,'2026-06-10 01:21:33','2026-06-10 01:21:33'),(21,'App\\Models\\User',3,'cma-citizen','75790c8a1a7f50ce63f4343cdbc7ee00d2046586a4e4cc247f4a210319c0b3f2','[\"*\"]','2026-06-10 01:23:33',NULL,'2026-06-10 01:22:27','2026-06-10 01:23:33'),(22,'App\\Models\\User',2,'cma-citizen','90f7527fc7be59f00161ab2bec00fe21b042711bf0236f52f81481032e0ca89b','[\"*\"]','2026-06-14 22:33:05',NULL,'2026-06-10 01:23:55','2026-06-14 22:33:05'),(23,'App\\Models\\User',1,'cma-admin','ca6fbe288426ef7d5ffe23cce4362cb452a4aeb0b3b97163a68ad1a182dc090d','[\"*\"]','2026-06-15 04:49:10',NULL,'2026-06-14 21:54:15','2026-06-15 04:49:10'),(24,'App\\Models\\User',2,'cma-citizen','94ffff20625d798549536935a072eeb87744da3347f8c12103676a62cdd15f28','[\"*\"]','2026-06-14 22:43:30',NULL,'2026-06-14 22:43:29','2026-06-14 22:43:30'),(25,'App\\Models\\User',2,'cma-citizen','5ec2da93c38720b4446635eae47ae36d3b7b20ccdbc83c99c92fb307568e9ff6','[\"*\"]','2026-06-14 23:34:00',NULL,'2026-06-14 23:33:59','2026-06-14 23:34:00'),(26,'App\\Models\\User',2,'cma-citizen','35e99a772d9da0d297c499ecf69e823743a3065e157527cd06b808ac8e234141','[\"*\"]','2026-06-14 23:39:47',NULL,'2026-06-14 23:34:10','2026-06-14 23:39:47'),(27,'App\\Models\\User',1,'cma-admin','eccc16891541192f12fe4ea648ce6bcefa79daff71b2c7d69d4155a11216ea6d','[\"*\"]','2026-06-30 02:50:47',NULL,'2026-06-18 01:09:53','2026-06-30 02:50:47'),(28,'App\\Models\\User',2,'cma-citizen','f6b0a6ac95eda3144c1021861d5a012bd3d9b8345502ec26070247d280329644','[\"*\"]','2026-06-18 01:10:17',NULL,'2026-06-18 01:10:17','2026-06-18 01:10:17'),(29,'App\\Models\\User',2,'cma-citizen','f1db02d5df9b4016c9aa02463ad8397e95c567bf59be875b2ab6998edcc1e332','[\"*\"]','2026-06-18 01:36:26',NULL,'2026-06-18 01:32:36','2026-06-18 01:36:26'),(31,'App\\Models\\User',2,'cma-citizen','502e9ef8c5994344e4230408da2c8844f5ae8c9716b2c0afb0c4229b8f1133cc','[\"*\"]','2026-06-18 01:39:46',NULL,'2026-06-18 01:39:45','2026-06-18 01:39:46'),(32,'App\\Models\\User',2,'cma-citizen','b67dde4eaff2aa94102fd01929d28f6c0fb1ed7c0d144e05278da7deb9c278a3','[\"*\"]','2026-06-18 01:45:40',NULL,'2026-06-18 01:42:19','2026-06-18 01:45:40'),(33,'App\\Models\\User',1,'cma-admin','b374a92be3e09ef11ea2c279eb0a39c66dbe3d9166d99c74d63e501b30e77fac','[\"*\"]','2026-06-22 23:07:50',NULL,'2026-06-18 02:54:35','2026-06-22 23:07:50'),(34,'App\\Models\\User',1,'cma-admin','d6b2d1f96078bde2b9d30ae4c14d81f6fc5983e3123b46e2f7504ee7deacfa70','[\"*\"]','2026-07-01 01:16:18',NULL,'2026-06-18 03:29:56','2026-07-01 01:16:18'),(35,'App\\Models\\User',2,'cma-citizen','1157d1c9533c8f57edabe0ad77267c0624c40db2c000e5cb434d6ead712f080a','[\"*\"]','2026-06-18 04:43:48',NULL,'2026-06-18 04:43:47','2026-06-18 04:43:48'),(36,'App\\Models\\User',2,'cma-citizen','8616f51659d7d78cf6005433d25238893484ace0a55e8da6d674d227ca3b7c9b','[\"*\"]','2026-06-22 22:15:20',NULL,'2026-06-22 21:56:12','2026-06-22 22:15:20'),(37,'App\\Models\\User',2,'cma-citizen','2bccd358e45f32b288096d817fdba73854dbacf38825ff9ae87d834b38afc638','[\"*\"]','2026-06-22 23:30:16',NULL,'2026-06-22 21:57:13','2026-06-22 23:30:16'),(38,'App\\Models\\User',4,'cma-citizen','d220d36e6ba492ea4d141f001319f364f2e633cc18460a2b239546e489fbe057','[\"*\"]',NULL,NULL,'2026-06-22 22:19:29','2026-06-22 22:19:29'),(39,'App\\Models\\User',4,'cma-citizen','3cb3861dc8b5f1302d1b7ce2bd236fe91cccc2056cd25f0f139024acc5ffcd2a','[\"*\"]','2026-06-22 22:30:12',NULL,'2026-06-22 22:19:48','2026-06-22 22:30:12'),(40,'App\\Models\\User',2,'cma-citizen','56de1ec684fd9c7a94f98e59e85dbd56025b07fde3585b8fa4113d307b015778','[\"*\"]','2026-06-22 22:32:00',NULL,'2026-06-22 22:32:00','2026-06-22 22:32:00'),(41,'App\\Models\\User',2,'cma-citizen','4d663214fdd9a064b363e7c154722d6fc713fda73798c7d2d191d0d2f71ef3e1','[\"*\"]','2026-06-22 22:32:27',NULL,'2026-06-22 22:32:26','2026-06-22 22:32:27'),(42,'App\\Models\\User',2,'cma-citizen','eed7d509fe6f0f3cd3374f5e5aa469e3871525caecd3ed0cde729c2eae0f6575','[\"*\"]','2026-06-22 22:42:55',NULL,'2026-06-22 22:38:01','2026-06-22 22:42:55'),(43,'App\\Models\\User',4,'cma-citizen','4464808ba1000c9501ca3a75e274ffee2b036617f1d6ba79967ed5a64edc5927','[\"*\"]','2026-06-22 22:53:11',NULL,'2026-06-22 22:43:05','2026-06-22 22:53:11'),(44,'App\\Models\\User',5,'cma-citizen','89516386eaa1c70ac0fe77eccb3f055060f646b14933a95c82918de855d9a7fb','[\"*\"]',NULL,NULL,'2026-06-30 04:16:40','2026-06-30 04:16:40'),(45,'App\\Models\\User',5,'cma-citizen','63686bf6a2bd57ad1eb7faf939a308850b2926f8a967ed1f924d88a1676819da','[\"*\"]','2026-06-30 04:19:42',NULL,'2026-06-30 04:17:00','2026-06-30 04:19:42'),(47,'App\\Models\\User',4,'cma-citizen','4fdd48cada84b3f5222d06746c76d8cb312a8a613276215acb4353267102e585','[\"*\"]','2026-07-01 03:12:33',NULL,'2026-06-30 07:19:50','2026-07-01 03:12:33'),(48,'App\\Models\\User',1,'cma-admin','83dff6e6001ada246029c96031bedeceb938917bb69cb8873a6441f51491004e','[\"*\"]','2026-07-01 09:41:12',NULL,'2026-07-01 03:10:18','2026-07-01 09:41:12'),(49,'App\\Models\\User',4,'cma-citizen','7611cefc214eae69cde9bccb51b8a61b1e4f55a556b9e68b02c032fbd6454723','[\"*\"]','2026-07-01 04:52:59',NULL,'2026-07-01 03:15:40','2026-07-01 04:52:59'),(50,'App\\Models\\User',4,'cma-citizen','329f0ebaba5ef245590f1e0d8b7bc73d1d08d25c1420e8d841c12c27a47c4bd4','[\"*\"]','2026-07-01 06:10:45',NULL,'2026-07-01 04:59:47','2026-07-01 06:10:45'),(51,'App\\Models\\User',4,'cma-citizen','6eb7cda05e425e0a5c4560ee8f9d4ade7f6db39ce0e80d1af0f6c07f1aef54c7','[\"*\"]','2026-07-01 06:17:41',NULL,'2026-07-01 06:17:40','2026-07-01 06:17:41'),(52,'App\\Models\\User',4,'cma-citizen','2b2377f4bdfdb57cb109094ef3ec4612135af3490368e5962de61f9e615dd787','[\"*\"]','2026-07-01 07:06:26',NULL,'2026-07-01 07:04:01','2026-07-01 07:06:26'),(53,'App\\Models\\User',4,'cma-citizen','b0d3c031318ba026012ce4e39436d5ea1d546d491933a5da4b9ec3c5ca9d7bbe','[\"*\"]','2026-07-01 07:23:18',NULL,'2026-07-01 07:17:24','2026-07-01 07:23:18'),(54,'App\\Models\\User',3,'cma-citizen','480f8869cbfdd62fd6c0d15d862e674bd799e7d344dd3f01724ff255fb1550e5','[\"*\"]','2026-07-01 09:40:05',NULL,'2026-07-01 07:25:44','2026-07-01 09:40:05'),(55,'App\\Models\\User',3,'cma-citizen','5a678dc46318241112b84e3eb71da69230558878f8974c58bc9e1c9802ff4cd1','[\"*\"]',NULL,NULL,'2026-07-01 09:40:29','2026-07-01 09:40:29');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `description_en` longtext DEFAULT NULL,
  `description_si` longtext DEFAULT NULL,
  `description_ta` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'ongoing',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Urban Community Renewal Programme','නාගරික ප්‍රජා ප්‍රතිනිර්මාණ වැඩසටහන','நகர்ப்புற சமூக புதுப்பித்தல் திட்டம்','A comprehensive programme to renew and upgrade aging condominium complexes across major urban centres in Sri Lanka.',NULL,NULL,'uploads/C7G0assjnemEOPD3mcUgFcpiHTPLwya31e9z9KR6.jpg','ongoing','2024-01-01',NULL,'Colombo, Kandy, Galle',1,'2026-06-03 21:54:17','2026-06-23 00:16:34'),(2,'Digital Management System for MCs','කළමනාකරණ සංගම් සඳහා ඩිජිටල් පද්ධතිය','MC களுக்கான டிஜிட்டல் மேலாண்மை அமைப்பு','Implementation of a digital platform for Management Corporations to handle fees, complaints and maintenance requests online.',NULL,NULL,'uploads/Aifm7LovRRNlqFwKHaRxIOWZwjYrUwawhhIlwHKQ.png','planned','2026-06-01',NULL,'Island-wide',1,'2026-06-03 21:54:17','2026-06-23 00:17:43');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_members`
--

DROP TABLE IF EXISTS `staff_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department_en` varchar(255) NOT NULL,
  `department_si` varchar(255) DEFAULT NULL,
  `department_ta` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_members`
--

LOCK TABLES `staff_members` WRITE;
/*!40000 ALTER TABLE `staff_members` DISABLE KEYS */;
INSERT INTO `staff_members` VALUES (1,'Mr. Nishan Nanayakkara','Chairman',NULL,NULL,'0112334151','chairman@cma.lk','Executive Management',NULL,NULL,1,1,'2026-06-24 00:05:44','2026-06-29 23:34:49'),(2,'Archt. M. T. Kapila Priyantha','General Manager','','','0112424027','gm@cma.lk','Executive Management','','',2,1,'2026-06-24 00:05:44','2026-07-01 05:26:17'),(3,'Mr. Nalin Gankanda','DGM (R) / Dep. General Manager (Reg.)',NULL,NULL,NULL,'dgmr@cma.lk','Engineering Division',NULL,NULL,3,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(4,'Mr. T. A. Perera','Town Planner',NULL,NULL,NULL,NULL,'Engineering Division',NULL,NULL,4,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(5,'Mrs. Nayana Palpita','AGM (R)',NULL,NULL,'0112328914','nayana@cma.lk','Engineering Division',NULL,NULL,5,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(6,'Mrs. S. H. R. P. (Ranjala) Hewage','AGM (O/M)',NULL,NULL,'0112421387','ranjala@cma.lk','Engineering Division',NULL,NULL,6,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(7,'Mr. W. H. S. C. (Sajeewa Chandana) Silva','AGM (O/M)',NULL,NULL,NULL,'agm.om.zone.2@cma.lk','Engineering Division',NULL,NULL,7,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(8,'Mrs. D. A. T. Harshani','AGM (O/M)',NULL,NULL,'0112333439','harshani@cma.lk','Engineering Division',NULL,NULL,8,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(9,'Mrs. Kosala Ranweera (Sujani)','AGM (O/M)',NULL,NULL,NULL,'certificate@cma.lk','Engineering Division',NULL,NULL,9,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(10,'Mrs. Sudarmika Lakmali','Sen. Engineering Assistant',NULL,NULL,NULL,'lakmali@cma.lk','Engineering Division',NULL,NULL,10,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(11,'Mr. P.R.K. Nalaka','Sen. Engineering Assistant',NULL,NULL,NULL,'nalaka@cma.lk','Engineering Division',NULL,NULL,11,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(12,'Mr. Sajith Ranshaka','Sen. Engineering Assistant',NULL,NULL,NULL,'sajith@cma.lk','Engineering Division',NULL,NULL,12,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(13,'Mrs. Dilini Dayarathna','Sen. Engineering Assistant',NULL,NULL,NULL,'dilini@cma.lk','Engineering Division',NULL,NULL,13,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(14,'Mrs. Samantha Ampagala','AGM (CC)',NULL,NULL,'0112391669','samantha@cma.lk','Customer Care Division',NULL,NULL,14,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(15,'Ms. Hashara / Mr. Kapila','CCU / Common',NULL,NULL,NULL,NULL,'Customer Care Division',NULL,NULL,15,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(16,'Mrs. Shihara Wickramasinghe','CCU / Common (Secretary)',NULL,NULL,NULL,'shihara@cma.lk','Customer Care Division',NULL,NULL,16,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(17,'Mrs. Manori De Silva','DGM (Finance)',NULL,NULL,'0112321585','dgmf@cma.lk','Finance Division',NULL,NULL,17,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(18,'Mr. P. Amila Nishantha (Pathirage)','AGM (Finance)',NULL,NULL,'0112331708','agm.finance@cma.lk','Finance Division',NULL,NULL,18,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(19,'Mrs. Chamila S. Liyanage (Subashini)','Act. Officer (Actg.) / Accounts Officer',NULL,NULL,NULL,'account.officer@cma.lk','Finance Division',NULL,NULL,19,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(20,'Mrs. U.S. Idurangi','AGM (Legal)',NULL,NULL,'0112335351','idurangi@cma.lk','Legal Division',NULL,NULL,20,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(21,'Mrs. Thanuja','AGM (Legal)',NULL,NULL,'0112335351','thanuja@cma.lk','Legal Division',NULL,NULL,21,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(22,'Mr. G. T. S. Perera','Legal Officer',NULL,NULL,'0112321584',NULL,'Legal Division',NULL,NULL,22,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(23,'Mrs. Naveesha Karunarathna','AGM (H/R)',NULL,NULL,NULL,'naveesha@cma.lk','Administration Division',NULL,NULL,23,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(24,'Mrs. Sanjeewani Priyangika','Secretary',NULL,NULL,NULL,'sanjeewani@cma.lk','Administration Division',NULL,NULL,24,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(25,'Mrs. Thushani Lokuge','A/O (Administrative Officer)',NULL,NULL,'0112471387','thushani@cma.lk','Administration Division',NULL,NULL,25,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(26,'Mr. G. A. U. T. Sampath','MIS Officer',NULL,NULL,NULL,'mis.officer@cma.lk','Management Information System (MIS) Division',NULL,NULL,26,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(27,'Miss Sathsarani Pallewatta','Internal Audit Officer',NULL,NULL,'0115757182','sathsarani@cma.lk','Internal Audit Division',NULL,NULL,27,1,'2026-06-24 00:05:44','2026-06-24 00:05:44'),(28,'Internal Auditor','Internal Auditor',NULL,NULL,NULL,'internal.auditor@cma.lk','Internal Audit Division',NULL,NULL,28,1,'2026-06-24 00:05:44','2026-06-24 00:05:44');
/*!40000 ALTER TABLE `staff_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Administrator','admin@condominium.lk',NULL,NULL,'super_admin',NULL,'$2y$12$Llkm82wIQ.vbSgV3grA6IuZ0jsnhSHxRrRCvP3IeEk.MzYMdzXHVm',NULL,NULL,'2026-06-03 21:54:17','2026-06-03 21:54:17'),(2,'Kamal','k@gmail.com',NULL,NULL,'citizen',NULL,'$2y$12$5oqRLNYTZGoovMTdEgLDF.jjCd20T4RqGor9orpZ2lr/TdofxMU6q',NULL,NULL,'2026-06-03 22:03:00','2026-06-22 22:32:14'),(3,'lll','lll@gmail.com',NULL,NULL,'citizen',NULL,'$2y$12$XIrcIhDAYUq.VS4YgpXXAOX/oWVXvsYELHE3tsjz5TltrjO501mlS',NULL,NULL,'2026-06-10 01:21:33','2026-06-10 01:21:33'),(4,'Nadeemal','n@gmail.com','0712525256','200020600400','citizen',NULL,'$2y$12$Wik8KNdmie5wTIENRctBwu0/XXFoYXgLsoTqtwEPEH4Zv9g22XmPi','profile-pictures/syJNWnF33Fj2mqscrEINvtSgja5w0SoLLjE6iqQZ.png',NULL,'2026-06-22 22:19:29','2026-06-22 22:46:21'),(5,'test 002','it@cma.lk','0772503462','720523299v','citizen',NULL,'$2y$12$7LJGWnqxZyQdXS3oXg.Zsu0gFirxwOc9QzL/egwI5Ip.dzLVBXpqG',NULL,NULL,'2026-06-30 04:16:40','2026-06-30 04:16:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacancies`
--

DROP TABLE IF EXISTS `vacancies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacancies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_si` varchar(255) DEFAULT NULL,
  `title_ta` varchar(255) DEFAULT NULL,
  `description_en` longtext DEFAULT NULL,
  `description_si` longtext DEFAULT NULL,
  `description_ta` longtext DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacancies`
--

LOCK TABLES `vacancies` WRITE;
/*!40000 ALTER TABLE `vacancies` DISABLE KEYS */;
INSERT INTO `vacancies` VALUES (5,'Account Assistant',NULL,NULL,'ikuahl jsdvopihs ihsdoihsdvj i oihsd ijdvs oih;vsd',NULL,NULL,'2026-06-30','vacancies/wRw7O7ZKuLiuVZi54G7EuN9Q0CqkOUrkdpvr4d7r',1,'2026-06-18 04:39:02','2026-06-22 23:54:22'),(6,'Driver',NULL,NULL,'xd sgs egfsedsdg sdgfds',NULL,NULL,'2026-07-10','vacancies/uii7iCr6X4Q42Uu1euXiqivMe0KlOcu9FQ22XGQs',1,'2026-06-22 23:54:45','2026-06-22 23:54:45');
/*!40000 ALTER TABLE `vacancies` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01 20:59:42
