-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: sandras
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tickets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tms` varchar(45) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `substatus` int(11) DEFAULT NULL,
  `invoice_rate` double DEFAULT NULL,
  `invoice_rate_currency` varchar(10) DEFAULT NULL,
  `load_rate` double DEFAULT NULL,
  `load_rate_currency` varchar(45) DEFAULT NULL,
  `driver_rate` double DEFAULT NULL,
  `driver_rate_currency` varchar(45) DEFAULT NULL,
  `product` varchar(45) DEFAULT NULL,
  `base` varchar(45) DEFAULT NULL,
  `silo` varchar(45) DEFAULT NULL,
  `po` varchar(45) DEFAULT NULL,
  `facility` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `bol` varchar(45) DEFAULT NULL,
  `sand_type` varchar(45) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `assign_date` datetime DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `payrolled_date` datetime DEFAULT NULL,
  `starting_mi` int(11) DEFAULT NULL,
  `end_mi` int(11) DEFAULT NULL,
  `pick_date` datetime DEFAULT NULL,
  `drop_date` datetime DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `sr` varchar(45) DEFAULT NULL,
  `hr_id` int(10) unsigned DEFAULT NULL,
  `products_id` int(11) DEFAULT NULL,
  `clients_id` int(10) unsigned NOT NULL,
  `truck` varchar(45) DEFAULT NULL,
  `trailer` varchar(45) DEFAULT NULL,
  `on_curse` tinyint(4) DEFAULT NULL,
  `born_date` datetime DEFAULT NULL,
  `payroll_hr_id` int(10) unsigned DEFAULT NULL,
  `locations_id` int(11) DEFAULT NULL,
  `loading_date` datetime DEFAULT NULL,
  `standby_time` double DEFAULT NULL,
  `ticket_id` int(20) DEFAULT NULL,
  `fixed_rate` double DEFAULT NULL,
  `unloading_date` datetime DEFAULT NULL,
  `miles` int(11) DEFAULT NULL,
  `demerge_amount` double DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_tickets_hr1_idx` (`hr_id`),
  KEY `fk_tickets_clients1_idx` (`clients_id`),
  KEY `fk_tickets_products1_idx` (`products_id`),
  KEY `fk_tickets_payroll_hr1_idx` (`payroll_hr_id`),
  KEY `fk_locations_id` (`locations_id`),
  CONSTRAINT `fk_locations_id` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `fk_tickets_clients2` FOREIGN KEY (`clients_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `fk_tickets_hr2` FOREIGN KEY (`hr_id`) REFERENCES `hr` (`id`),
  CONSTRAINT `fk_tickets_payroll_hr2` FOREIGN KEY (`payroll_hr_id`) REFERENCES `payroll_hr` (`id`),
  CONSTRAINT `fk_tickets_products2` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5168 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-17 15:05:01
