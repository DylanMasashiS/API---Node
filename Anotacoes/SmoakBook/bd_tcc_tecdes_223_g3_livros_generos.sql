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
-- Table structure for table `livros_generos`
--

DROP TABLE IF EXISTS `livros_generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_generos` (
  `lge_cod` int NOT NULL AUTO_INCREMENT,
  `gen_cod` tinyint NOT NULL,
  `liv_cod` int NOT NULL,
  PRIMARY KEY (`lge_cod`),
  KEY `liv_cod` (`liv_cod`),
  KEY `fk_livros_generos_generos` (`gen_cod`),
  CONSTRAINT `fk_livros_generos_generos` FOREIGN KEY (`gen_cod`) REFERENCES `generos` (`gen_cod`),
  CONSTRAINT `livros_generos_ibfk_1` FOREIGN KEY (`gen_cod`) REFERENCES `generos` (`gen_cod`),
  CONSTRAINT `livros_generos_ibfk_2` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_generos`
--

LOCK TABLES `livros_generos` WRITE;
/*!40000 ALTER TABLE `livros_generos` DISABLE KEYS */;
INSERT INTO `livros_generos` VALUES (1,81,65),(2,85,66),(3,93,67),(4,82,68),(5,85,69),(6,85,70),(7,89,71),(8,88,72),(9,79,73),(10,84,74),(11,88,75),(12,91,76),(13,91,77),(14,85,78),(15,90,79),(16,92,80),(17,80,81),(18,83,82),(19,86,83),(20,87,84),(21,94,88),(22,94,88),(23,94,88),(27,89,74);
/*!40000 ALTER TABLE `livros_generos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23  5:23:39
