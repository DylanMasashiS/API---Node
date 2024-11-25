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
-- Table structure for table `livros_autores`
--

DROP TABLE IF EXISTS `livros_autores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_autores` (
  `lau_cod` int NOT NULL AUTO_INCREMENT,
  `aut_cod` smallint NOT NULL,
  `liv_cod` int NOT NULL,
  PRIMARY KEY (`lau_cod`),
  KEY `liv_cod` (`liv_cod`),
  KEY `fk_livros_autores_autores` (`aut_cod`),
  CONSTRAINT `fk_livros_autores_autores` FOREIGN KEY (`aut_cod`) REFERENCES `autores` (`aut_cod`),
  CONSTRAINT `livros_autores_ibfk_1` FOREIGN KEY (`aut_cod`) REFERENCES `autores` (`aut_cod`),
  CONSTRAINT `livros_autores_ibfk_2` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_autores`
--

LOCK TABLES `livros_autores` WRITE;
/*!40000 ALTER TABLE `livros_autores` DISABLE KEYS */;
INSERT INTO `livros_autores` VALUES (1,61,65),(2,62,66),(3,63,67),(4,64,68),(5,65,69),(6,66,70),(7,67,71),(8,70,72),(9,71,73),(10,72,74),(11,69,75),(12,69,76),(13,69,77),(14,68,78),(15,64,79),(16,73,80),(17,74,81),(18,75,82),(19,76,83),(20,77,84);
/*!40000 ALTER TABLE `livros_autores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 17:55:43
