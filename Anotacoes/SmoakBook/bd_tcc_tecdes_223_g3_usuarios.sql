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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usu_cod` int NOT NULL AUTO_INCREMENT,
  `usu_rm` bigint DEFAULT NULL,
  `usu_nome` varchar(50) NOT NULL,
  `usu_email` varchar(50) NOT NULL,
  `usu_senha` varchar(12) NOT NULL,
  `usu_tipo` tinyint NOT NULL,
  `usu_sexo` tinyint NOT NULL,
  `usu_foto` varchar(256) DEFAULT NULL,
  `usu_ativo` bit(1) NOT NULL,
  `usu_aprovado` bit(1) NOT NULL,
  `usu_social` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`usu_cod`),
  UNIQUE KEY `usu_email` (`usu_email`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (18,12345678910,'Kawany','kawany@etec.sp.gov.br','123456',2,3,NULL,_binary '',_binary '',NULL),(19,98765432231,'Daniele Calil','danikawari@gmail.com','d2a2n2i2',0,3,NULL,_binary '',_binary '',NULL),(20,23456781469,'Tiago Barros','tiago@etec.sp.gov.br','T1@g0_B@rr0s',0,2,NULL,_binary '',_binary '\0',NULL),(21,87654326010,'Victor Ribeiro','victor@etec.sp.gov.br','V1ct0rRib3r0',0,1,NULL,_binary '',_binary '',NULL),(22,12345678901,'Maria Silva','maria@etec.sp.gov.br','m5a5r5i5a5',1,0,NULL,_binary '',_binary '',NULL),(23,98765432100,'João Pereira','joao@etec.sp.gov.br','j6o6a6o6',1,1,NULL,_binary '',_binary '',NULL),(24,10293847561,'Ana Costa','ana@etec.sp.gov.br','a7n7a7c7o7',1,0,NULL,_binary '',_binary '',NULL),(25,85930271648,'Isabeli Oliveira','isabeli@etec.sp.gov.br','i8s8a8b8e8',1,0,NULL,_binary '',_binary '',NULL),(29,11223344556,'Donavan','donavan@etec.sp.gov.br','d2on1a1v2',1,1,NULL,_binary '',_binary '','Dovi'),(30,22334455667,'Bruno Costa','bruno@etec.sp.gov.br.com','Brun0#C0st@!',4,1,NULL,_binary '',_binary '\0',NULL),(31,33445566778,'Carla Mendes','carla@etec.sp.gov.br.com','C@rl4_M3nd!',4,0,NULL,_binary '',_binary '\0',NULL),(32,44556677889,'Daniel Oliveira','daniel@etec.sp.gov.br.com','D@niel#1',4,2,NULL,_binary '',_binary '\0',NULL),(33,55667788990,'Elaine Santos','elaine@etec.sp.gov.br.com','Ela1ne$!',4,0,NULL,_binary '',_binary '\0',NULL),(34,66778899001,'Fábio Pereira','fabio@etec.sp.gov.br.com','F@b10_P3!',4,2,NULL,_binary '',_binary '\0',NULL),(35,14991782357,'Socorro Jesus','dasdores@etec.sp.gov.br','churrosdoce',4,1,NULL,_binary '',_binary '\0',NULL),(49,12345678910,'Mariana Pereira','kian.sayuri123@gmail.com','123',2,0,NULL,_binary '',_binary '',NULL),(50,220083,'dani calil','dacalil90@gmail.com','@Abc1234',3,1,NULL,_binary '',_binary '',NULL),(51,44444444,'Donavan','donavani@etec.sp.gov.br','d2on1a1v2',5,1,NULL,_binary '\0',_binary '\0','Dovi'),(53,44444444,'Marcelo Pereira','marc@etec.sp.gov.br','566mmpp#',5,3,NULL,_binary '\0',_binary '\0',NULL),(54,785426,'Gabriela Monteiro Oliveira','Monteiro@gmail.com','@Abc1234',5,2,NULL,_binary '\0',_binary '\0',NULL),(55,44444444,'Marcelo Pereira','marce@etec.sp.gov.br','566mmpp#',5,0,NULL,_binary '\0',_binary '\0',NULL),(56,274365,'Sofia Carvalho','carvalho@gmail.com','@Abc1234',5,0,NULL,_binary '\0',_binary '\0',NULL),(58,44444444,'Marcelo Pereira','marcel@etec.sp.gov.br','566mmpp#',4,0,NULL,_binary '',_binary '\0',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
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
