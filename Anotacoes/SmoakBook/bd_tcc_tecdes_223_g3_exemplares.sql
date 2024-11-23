-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_tcc_tecdes_223_g3
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `exemplares`
--

DROP TABLE IF EXISTS `exemplares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exemplares` (
  `exe_cod` tinyint NOT NULL AUTO_INCREMENT,
  `liv_cod` int NOT NULL,
  `exe_tombo` varchar(10) NOT NULL,
  `exe_data_aquis` date NOT NULL,
  `exe_data_saida` date DEFAULT NULL,
  `exe_devol` bit(1) NOT NULL,
  `exe_status` enum('Disponível','Indisponível','Reservado') DEFAULT 'Disponível',
  `exe_reservado` tinyint(1) DEFAULT '0',
  `exe_data_limite_retirada` date DEFAULT NULL,
  `exe_ativo` bit(1) DEFAULT NULL,
  PRIMARY KEY (`exe_cod`),
  KEY `fk_exemplares_livros` (`liv_cod`),
  CONSTRAINT `exemplares_ibfk_1` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`),
  CONSTRAINT `fk_exemplares_livros` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exemplares`
--

LOCK TABLES `exemplares` WRITE;
/*!40000 ALTER TABLE `exemplares` DISABLE KEYS */;
INSERT INTO `exemplares` VALUES (25,65,'0.065','2024-01-07',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(26,65,'0.066','2024-01-07',NULL,_binary '\0','Disponível',1,'2024-11-21',_binary ''),(27,66,'0.067','2024-01-12',NULL,_binary '\0','Disponível',1,NULL,_binary ''),(28,67,'0.068','2024-01-12',NULL,_binary '\0','Indisponível',1,NULL,_binary ''),(29,68,'0.069','2024-01-13',NULL,_binary '\0','Indisponível',1,NULL,_binary ''),(30,68,'0.070','2024-01-13',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(31,69,'0.071','2024-01-13',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(32,70,'0.072','2024-01-13',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(33,71,'0.073','2024-01-18',NULL,_binary '','Disponível',0,NULL,_binary ''),(34,71,'0.074','2024-01-18',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(35,72,'0.075','2024-01-21',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(36,73,'0.076','2024-01-23',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(37,74,'0.077','2024-01-23','2024-03-16',_binary '\0','Indisponível',0,NULL,_binary ''),(38,74,'0.078','2024-01-23',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(39,74,'0.079','2024-01-23',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(40,74,'0.080','2024-01-23',NULL,_binary '','Disponível',0,NULL,_binary ''),(41,75,'0.081','2024-01-24',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(42,75,'0.082','2024-01-24',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(43,76,'0.083','2024-01-25',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(44,76,'0.084','2024-01-25',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(45,77,'0.085','2024-01-26',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(46,78,'0.086','2024-01-27',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(47,79,'0.087','2024-01-30',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(48,80,'0.088','2024-01-31',NULL,_binary '\0','Indisponível',0,NULL,_binary ''),(49,81,'0.810','2024-01-15',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(50,82,'0.869','2024-01-15',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(51,83,'0.830','2024-01-15',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(52,84,'0.820','2024-01-15',NULL,_binary '\0','Disponível',0,NULL,_binary ''),(55,65,'0.821','2024-01-31',NULL,_binary '\0','Disponível',0,NULL,_binary '');
/*!40000 ALTER TABLE `exemplares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23  5:23:40
