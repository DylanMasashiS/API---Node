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
-- Table structure for table `emprestimos`
--

DROP TABLE IF EXISTS `emprestimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimos` (
  `emp_cod` int NOT NULL AUTO_INCREMENT,
  `usu_cod` int NOT NULL,
  `exe_cod` tinyint NOT NULL,
  `emp_data_emp` date NOT NULL,
  `emp_data_devol` date DEFAULT NULL,
  `emp_devolvido` tinyint(1) DEFAULT '0',
  `emp_renovacao` bit(1) DEFAULT NULL,
  `emp_data_renov` date DEFAULT NULL,
  `func_cod` int DEFAULT NULL,
  `emp_data_retirada` date DEFAULT NULL,
  `emp_data_limite_retirada` date DEFAULT NULL,
  `emp_data_prevista_devol` date DEFAULT NULL,
  `emp_reserva` bit(1) DEFAULT b'1',
  `emp_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`emp_cod`),
  KEY `fk_emprestimos_usuarios` (`usu_cod`),
  KEY `fk_emprestimos_exemplares` (`exe_cod`),
  KEY `fk_emprestimos_funcionarios` (`func_cod`),
  CONSTRAINT `emprestimos_ibfk_1` FOREIGN KEY (`exe_cod`) REFERENCES `exemplares` (`exe_cod`),
  CONSTRAINT `emprestimos_ibfk_2` FOREIGN KEY (`usu_cod`) REFERENCES `usuarios` (`usu_cod`),
  CONSTRAINT `fk_emprestimos_exemplares` FOREIGN KEY (`exe_cod`) REFERENCES `exemplares` (`exe_cod`),
  CONSTRAINT `fk_emprestimos_funcionarios` FOREIGN KEY (`func_cod`) REFERENCES `usuarios` (`usu_cod`),
  CONSTRAINT `fk_emprestimos_usuarios` FOREIGN KEY (`usu_cod`) REFERENCES `usuarios` (`usu_cod`),
  CONSTRAINT `fk_func_cod` FOREIGN KEY (`func_cod`) REFERENCES `usuarios` (`usu_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimos`
--

LOCK TABLES `emprestimos` WRITE;
/*!40000 ALTER TABLE `emprestimos` DISABLE KEYS */;
INSERT INTO `emprestimos` VALUES (1,18,25,'2024-02-07','2024-02-21',1,NULL,NULL,49,NULL,NULL,NULL,_binary '','Reservado'),(12,21,26,'2024-04-10',NULL,0,NULL,NULL,49,NULL,'2024-04-13','2024-04-27',_binary '\0','Cancelado'),(22,21,48,'2024-05-29','2024-06-13',1,_binary '','2024-06-13',49,NULL,'2024-06-16','2024-06-30',_binary '','Reservado'),(26,19,29,'2024-11-21',NULL,0,NULL,NULL,49,'2024-11-21','2024-11-24','2024-12-08',_binary '\0','Devolvido'),(27,19,30,'2024-11-21',NULL,0,NULL,NULL,49,NULL,'2024-11-24','2024-12-08',_binary '','Pendente'),(28,19,29,'2024-11-21',NULL,0,NULL,NULL,49,NULL,'2024-11-24','2024-12-08',_binary '','Pendente'),(39,19,52,'2024-11-23',NULL,0,NULL,NULL,49,NULL,'2024-11-26','2024-12-10',_binary '','Pendente');
/*!40000 ALTER TABLE `emprestimos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 17:55:42
