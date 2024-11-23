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
-- Table structure for table `recomendacao`
--

DROP TABLE IF EXISTS `recomendacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendacao` (
  `rcm_cod` int NOT NULL AUTO_INCREMENT,
  `cur_cod` smallint NOT NULL,
  `liv_cod` int NOT NULL,
  `usu_cod` int NOT NULL,
  `rcm_mod1` bit(1) NOT NULL,
  `rcm_mod2` bit(1) NOT NULL,
  `rcm_mod3` bit(1) NOT NULL,
  `rcm_mod4` bit(1) NOT NULL,
  PRIMARY KEY (`rcm_cod`),
  KEY `cur_cod` (`cur_cod`),
  KEY `liv_cod` (`liv_cod`),
  KEY `usu_cod` (`usu_cod`),
  CONSTRAINT `recomendacao_ibfk_1` FOREIGN KEY (`cur_cod`) REFERENCES `cursos` (`cur_cod`),
  CONSTRAINT `recomendacao_ibfk_2` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`),
  CONSTRAINT `recomendacao_ibfk_3` FOREIGN KEY (`usu_cod`) REFERENCES `usuarios` (`usu_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacao`
--

LOCK TABLES `recomendacao` WRITE;
/*!40000 ALTER TABLE `recomendacao` DISABLE KEYS */;
INSERT INTO `recomendacao` VALUES (1,94,66,24,_binary '',_binary '\0',_binary '\0',_binary '\0'),(2,85,69,23,_binary '\0',_binary '',_binary '\0',_binary '\0'),(3,88,80,22,_binary '\0',_binary '\0',_binary '',_binary '\0'),(4,92,84,21,_binary '\0',_binary '\0',_binary '\0',_binary '');
/*!40000 ALTER TABLE `recomendacao` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23  5:23:42
