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
-- Table structure for table `usuarios_cursos`
--

DROP TABLE IF EXISTS `usuarios_cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_cursos` (
  `ucu_cod` int NOT NULL AUTO_INCREMENT,
  `usu_cod` int NOT NULL,
  `cur_cod` smallint NOT NULL,
  `ucu_status` bit(1) NOT NULL,
  `ucu_ativo` bit(1) NOT NULL,
  `ucu_aprovado` bit(1) NOT NULL,
  PRIMARY KEY (`ucu_cod`),
  KEY `cur_cod` (`cur_cod`),
  KEY `usu_cod` (`usu_cod`),
  CONSTRAINT `usuarios_cursos_ibfk_1` FOREIGN KEY (`cur_cod`) REFERENCES `cursos` (`cur_cod`),
  CONSTRAINT `usuarios_cursos_ibfk_2` FOREIGN KEY (`usu_cod`) REFERENCES `usuarios` (`usu_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_cursos`
--

LOCK TABLES `usuarios_cursos` WRITE;
/*!40000 ALTER TABLE `usuarios_cursos` DISABLE KEYS */;
INSERT INTO `usuarios_cursos` VALUES (13,18,95,_binary '',_binary '',_binary ''),(14,19,92,_binary '',_binary '',_binary ''),(15,20,93,_binary '\0',_binary '',_binary '\0'),(16,22,88,_binary '',_binary '',_binary ''),(17,23,85,_binary '',_binary '',_binary ''),(18,29,89,_binary '',_binary '',_binary ''),(19,30,89,_binary '\0',_binary '',_binary '\0'),(20,31,90,_binary '\0',_binary '',_binary '\0'),(21,32,86,_binary '\0',_binary '',_binary '\0'),(22,33,91,_binary '\0',_binary '',_binary '\0'),(23,34,94,_binary '\0',_binary '',_binary '\0'),(24,49,85,_binary '',_binary '',_binary ''),(25,50,92,_binary '',_binary '',_binary ''),(26,53,85,_binary '\0',_binary '\0',_binary '\0'),(27,54,94,_binary '\0',_binary '\0',_binary '\0'),(28,55,85,_binary '\0',_binary '\0',_binary '\0'),(29,56,99,_binary '\0',_binary '\0',_binary '\0'),(30,24,94,_binary '',_binary '',_binary ''),(33,18,85,_binary '',_binary '',_binary ''),(34,51,95,_binary '\0',_binary '\0',_binary '\0'),(37,21,92,_binary '',_binary '',_binary ''),(38,25,87,_binary '',_binary '',_binary ''),(39,58,85,_binary '\0',_binary '',_binary '\0');
/*!40000 ALTER TABLE `usuarios_cursos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 17:55:41
