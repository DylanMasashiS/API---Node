CREATE DATABASE  IF NOT EXISTS `bd_tcc_tecdes_223_g3` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bd_tcc_tecdes_223_g3`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 10.67.22.216    Database: bd_tcc_tecdes_223_g3
-- ------------------------------------------------------
-- Server version	5.7.21-log

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
-- Table structure for table `autores`
--

DROP TABLE IF EXISTS `autores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autores` (
  `aut_cod` smallint(6) NOT NULL AUTO_INCREMENT,
  `aut_nome` varchar(50) NOT NULL,
  PRIMARY KEY (`aut_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autores`
--

LOCK TABLES `autores` WRITE;
/*!40000 ALTER TABLE `autores` DISABLE KEYS */;
INSERT INTO `autores` VALUES (61,'Frank, Anne'),(62,'Assis, Machado'),(63,'Shakespeare, William'),(64,'Orwell, George'),(65,'Hugo, Vitor'),(66,'Austen, Jane'),(67,'Oseman, Alice'),(68,'Reid, Jenkins'),(69,'Donlea, Charlie'),(70,'Hoover, Collen'),(71,'Rowling, J.K'),(72,'Green, John'),(73,'Bram Stoker'),(74,'Douglas Adams'),(75,'Ariano Suassuna'),(76,'Ray Bradbury'),(77,'C. S. Lewis'),(78,'ddddddd'),(79,'sssssss');
/*!40000 ALTER TABLE `autores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contatos`
--

DROP TABLE IF EXISTS `contatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contatos` (
  `cont_cod` int(11) NOT NULL,
  `esc_nome` varchar(50) DEFAULT NULL,
  `esc_endereco` varchar(50) DEFAULT NULL,
  `esc_tel` varchar(15) DEFAULT NULL,
  `esc_cel` varchar(15) DEFAULT NULL,
  `esc_email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cont_cod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contatos`
--

LOCK TABLES `contatos` WRITE;
/*!40000 ALTER TABLE `contatos` DISABLE KEYS */;
INSERT INTO `contatos` VALUES (1,'ETEC Prof. Massuyuki Kawano','Rua Bezerra de Menezes, 215 - Vila Independência','(14)3496-1520','(14)3496-1520','etecbiblioteca@gmail.com');
/*!40000 ALTER TABLE `contatos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `cur_cod` smallint(6) NOT NULL AUTO_INCREMENT,
  `cur_nome` varchar(50) NOT NULL,
  `cur_ativo` bit(1) NOT NULL,
  PRIMARY KEY (`cur_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (85,'Administração',_binary ''),(86,'Comércio',_binary ''),(87,'Contabilidade',_binary ''),(88,'Desenho de Construção Civil',_binary ''),(89,'Design de interiores',_binary ''),(90,'Enfermagem',_binary ''),(91,'Farmácia',_binary ''),(92,'Informática',_binary ''),(93,'Análise e Desenvolvimento de Sistemas',_binary ''),(94,'Recursos Humanos',_binary ''),(95,'Redes de Computadores',_binary ''),(96,'Marketing',_binary '\0'),(97,'Itinerário de Ciências Biológicas',_binary ''),(98,'Itinerário de Ciências Exatas ',_binary ''),(99,'Itinerário de Ciências Humanas',_binary ''),(100,'Ensino Técnico Integrado ao Médio',_binary '');
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editoras`
--

DROP TABLE IF EXISTS `editoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `editoras` (
  `edt_cod` smallint(6) NOT NULL AUTO_INCREMENT,
  `edt_nome` varchar(50) NOT NULL,
  PRIMARY KEY (`edt_cod`),
  UNIQUE KEY `edt_cod` (`edt_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editoras`
--

LOCK TABLES `editoras` WRITE;
/*!40000 ALTER TABLE `editoras` DISABLE KEYS */;
INSERT INTO `editoras` VALUES (25,'Record'),(26,'Companhhia das letras'),(27,'Faro'),(28,'Rocco'),(29,'Aleph'),(30,'Intrínseca'),(37,'Livraria Catavento'),(38,'Nova Fronteira'),(39,'Oficina do Saber'),(40,'WMF Martins Fontes'),(41,'ffffffffffff'),(42,'ssssss');
/*!40000 ALTER TABLE `editoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emprestimos`
--

DROP TABLE IF EXISTS `emprestimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimos` (
  `emp_cod` int(11) NOT NULL AUTO_INCREMENT,
  `usu_cod` int(11) NOT NULL,
  `exe_cod` tinyint(4) NOT NULL,
  `emp_data_emp` date NOT NULL,
  `emp_data_devol` date DEFAULT NULL,
  `emp_devolvido` tinyint(1) DEFAULT '0',
  `emp_renovacao` bit(1) DEFAULT NULL,
  `emp_data_renov` date DEFAULT NULL,
  `func_cod` int(11) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimos`
--

LOCK TABLES `emprestimos` WRITE;
/*!40000 ALTER TABLE `emprestimos` DISABLE KEYS */;
INSERT INTO `emprestimos` VALUES (1,18,25,'2024-02-07','2024-02-21',1,NULL,NULL,21,'2024-11-19',NULL,NULL,_binary '','Reservado'),(2,31,30,'2024-02-18','2024-03-03',0,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(3,25,33,'2024-03-03','2024-03-17',1,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(4,29,37,'2024-03-29','2024-04-03',1,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(5,34,40,'2024-02-05','2024-02-19',0,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(7,22,48,'2024-04-10','2024-04-23',1,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(8,22,25,'2024-03-10','2024-03-24',1,NULL,NULL,21,NULL,NULL,NULL,_binary '','Reservado'),(9,22,25,'2024-05-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-17','2024-12-01',_binary '','pendente'),(10,22,25,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(11,23,25,'2024-04-10',NULL,0,NULL,NULL,NULL,'2024-11-18','2024-11-21','2024-12-05',_binary '','Confirmado'),(12,24,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21',NULL,_binary '','Cancelado'),(13,23,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-03',_binary '','pendente'),(14,22,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(15,22,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(16,22,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(17,22,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(18,23,26,'2024-04-10',NULL,0,NULL,NULL,NULL,NULL,'2024-11-21','2024-12-05',_binary '','pendente'),(22,22,48,'2024-04-10','2024-12-06',1,_binary '','2025-01-20',21,'2024-11-19','2024-11-22','2024-12-06',_binary '','Reservado');
/*!40000 ALTER TABLE `emprestimos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exemplares`
--

DROP TABLE IF EXISTS `exemplares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exemplares` (
  `exe_cod` tinyint(4) NOT NULL AUTO_INCREMENT,
  `liv_cod` int(11) NOT NULL,
  `exe_tombo` varchar(10) NOT NULL,
  `exe_data_aquis` date NOT NULL,
  `exe_data_saida` date DEFAULT NULL,
  `exe_devol` bit(1) NOT NULL,
  `exe_status` enum('Disponível','Indisponível','Reservado') DEFAULT 'Disponível',
  `exe_reservado` tinyint(1) DEFAULT '0',
  `exe_data_limite_retirada` date DEFAULT NULL,
  PRIMARY KEY (`exe_cod`),
  KEY `fk_exemplares_livros` (`liv_cod`),
  CONSTRAINT `exemplares_ibfk_1` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`),
  CONSTRAINT `fk_exemplares_livros` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exemplares`
--

LOCK TABLES `exemplares` WRITE;
/*!40000 ALTER TABLE `exemplares` DISABLE KEYS */;
INSERT INTO `exemplares` VALUES (25,65,'0.065','2024-01-07',NULL,_binary '\0','Disponível',0,NULL),(26,65,'0.066','2024-01-07',NULL,_binary '\0','Disponível',1,'2024-11-21'),(27,66,'0.067','2024-01-12',NULL,_binary '\0','Disponível',0,NULL),(28,67,'0.068','2024-01-12',NULL,_binary '\0','Disponível',0,NULL),(29,68,'0.069','2024-01-13',NULL,_binary '\0','Disponível',0,NULL),(30,68,'0.070','2024-01-13',NULL,_binary '\0','Disponível',0,NULL),(31,69,'0.071','2024-01-13',NULL,_binary '\0','Disponível',0,NULL),(32,70,'0.072','2024-01-13',NULL,_binary '\0','Disponível',0,NULL),(33,71,'0.073','2024-01-18',NULL,_binary '','Disponível',0,NULL),(34,71,'0.074','2024-01-18',NULL,_binary '\0','Disponível',0,NULL),(35,72,'0.075','2024-01-21',NULL,_binary '\0','Disponível',0,NULL),(36,73,'0.076','2024-01-23',NULL,_binary '\0','Disponível',0,NULL),(37,74,'0.077','2024-01-23','2024-03-16',_binary '','Disponível',0,NULL),(38,74,'0.078','2024-01-23',NULL,_binary '\0','Disponível',0,NULL),(39,74,'0.079','2024-01-23',NULL,_binary '\0','Disponível',0,NULL),(40,74,'0.080','2024-01-23',NULL,_binary '','Disponível',0,NULL),(41,75,'0.081','2024-01-24',NULL,_binary '\0','Disponível',0,NULL),(42,75,'0.082','2024-01-24',NULL,_binary '\0','Disponível',0,NULL),(43,76,'0.083','2024-01-25',NULL,_binary '\0','Disponível',0,NULL),(44,76,'0.084','2024-01-25',NULL,_binary '\0','Disponível',0,NULL),(45,77,'0.085','2024-01-26',NULL,_binary '\0','Disponível',0,NULL),(46,78,'0.086','2024-01-27',NULL,_binary '\0','Disponível',0,NULL),(47,79,'0.087','2024-01-30',NULL,_binary '\0','Disponível',0,NULL),(48,80,'0.088','2024-01-31',NULL,_binary '\0','Disponível',0,NULL),(49,81,'0.810','2024-01-15',NULL,_binary '\0','Disponível',0,NULL),(50,82,'0.869','2024-01-15',NULL,_binary '\0','Disponível',0,NULL),(51,83,'0.830','2024-01-15',NULL,_binary '\0','Disponível',0,NULL),(52,84,'0.820','2024-01-15',NULL,_binary '\0','Disponível',0,NULL),(55,65,'0.821','2024-01-31',NULL,_binary '\0','Disponível',0,NULL);
/*!40000 ALTER TABLE `exemplares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `gen_cod` tinyint(4) NOT NULL AUTO_INCREMENT,
  `gen_nome` varchar(20) NOT NULL,
  PRIMARY KEY (`gen_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (79,'Ação'),(80,'Aventura'),(81,'Autobiográfico'),(82,'Alegoria'),(83,'Comédia'),(84,'Drama'),(85,'Ficção'),(86,'Ficção Científica'),(87,'Fantasia'),(88,'Mistério'),(89,'Romance'),(90,'Sátira'),(91,'Suspense'),(92,'Terror'),(93,'Tragédia'),(94,'ddddddddddd'),(95,'sssssssss');
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livros`
--

DROP TABLE IF EXISTS `livros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros` (
  `liv_cod` int(11) NOT NULL AUTO_INCREMENT,
  `liv_pha_cod` varchar(5) NOT NULL,
  `liv_categ_cod` varchar(10) NOT NULL,
  `liv_nome` varchar(50) NOT NULL,
  `liv_desc` longtext NOT NULL,
  `edt_cod` smallint(6) NOT NULL,
  `liv_foto_capa` varchar(256) DEFAULT NULL,
  `liv_ativo` bit(1) NOT NULL,
  PRIMARY KEY (`liv_cod`),
  UNIQUE KEY `liv_cod` (`liv_cod`),
  KEY `edt_cod` (`edt_cod`),
  CONSTRAINT `livros_ibfk_1` FOREIGN KEY (`edt_cod`) REFERENCES `editoras` (`edt_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros`
--

LOCK TABLES `livros` WRITE;
/*!40000 ALTER TABLE `livros` DISABLE KEYS */;
INSERT INTO `livros` VALUES (65,'F91a','0.920','Anne Frank 2','O Diário de Anne Frank, O emocionante relato que se tornou um dos livros mais lidos do mundo.\nO diário de Anne Frank foi publicado pela primeira vez em 1947 e faz parte do cânone literário do Holocausto. E agora, pela primeira vez, vem à luz esta edição em quadrinhos. O roteirista e diretor cinematográfico Ari Folman e o ilustrador David Polonsky demonstram com essa adaptação a dimensão e a genialidade literárias da jovem autora. Eles tornam visual o contemporâneo documento histórico de Anne Frank e traduzem o contexto da época no qual foi escrito. Baseada na edição definitiva do diário, autorizada por Otto Frank, pai de Anne – um dos livros mais vendidos do mundo, publicado no Brasil pela Editora Record , esta versão em quadrinhos torna tangível o destino dos oito habitantes do Anexo durante seus dias no esconderijo.',25,'/public/uploads/CapaLivros/anne frank.jpg',_binary '\0'),(66,'A865d','0.820','Dom Casmurro','Dom Casmurro é uma obra clássica do Realismo Brasileiro e uma das mais famosas de Machado de Assis. É o romance mais estudado, comentado e discutido de Machado de Assis – o que significa dizer um dos mais estudados da nossa literatura. Publicado originalmente em 1899, o livro conta a história de Bentinho e Capitu, desde o namoro infantil até o casamento atormentado pelo ciúme e pela dúvida que virou polêmica literária: Capitu traiu o marido com o melhor amigo dele, Escobar? Os fatos são narrados por Bentinho, que relembra, já velho, episódios de sua vida.',26,'dom casmurro.jpg',_binary ''),(67,'S539r','0.820','Romeu e Julieta','Romeu e Julieta, Há muito tempo duas famílias banham em sangue as ruas de Verona. Enquanto isso, na penumbra das madrugadas, ardem as brasas de um amor secreto. Romeu, filho dos Montéquio, e Julieta, herdeira dos Capuleto, desafiam a rixa familiar e sonham com um impossível futuro, longe da violência e da loucura. Romeu e Julieta é a primeira das grandes tragédias de William Shakespeare, e esta nova tradução de José Francisco Botelho recria com maestria o ritmo ao mesmo tempo frenético e melancólico do texto shakespeariano. Contando também com um excelente ensaio introdutório do especialista Adrian Poole, esta edição traz nova vida a uma das mais emocionantes histórias de amor já contadas',26,'romeu e julieta.jpg',_binary '\0'),(68,'O72r','0.820','A Revolução dos Bichos 2','A Revolução dos Bichos é uma fábula satírica escrita por George Orwell. A história retrata uma revolta liderada pelos animais de uma fazenda contra seus donos humanos, buscando criar uma sociedade onde todos os animais são iguais. No entanto, ao longo do tempo, os líderes porcos começam a se corromper, espelhando os mesmos vícios e abusos que os humanos praticavam. O livro critica tanto o totalitarismo quanto a corrupção do poder, destacando como até mesmo as melhores intenções podem ser distorcidas quando se obtém controle absoluto.',26,'/public/uploads/CapaLivros/a revolução dos bichos.jpg',_binary '\0'),(69,'H8890','0.840','Os Miseráveis','Em Os Miseráveis, o maior clássico do Romantismo francês, Victor Hugo desenvolve a trama a partir dos conflitos entre dois antagonistas: Jean Valjean e Javert. Com críticas à sociedade da época, esta adaptação trabalha temáticas universais, como a desigualdade social e os dilemas morais que cada indivíduo precisa enfrenta.',26,'os miseráveis.jpg',_binary ''),(70,'A95o','0.028','Orgulho e Preconceito','Orgulho e Preconceito, de Jane Austen, narra uma história de amor improvável em uma época em que sentimentos poderiam não ser suficientes. Quando Elizabeth Bennet conhece Fitzwilliam Darcy, o considera arrogante e presunçoso. No entanto, uma reviravolta surpreendente pode mostrar que as primeiras impressões nem sempre são definitivas. Com sua escrita ácida e inteligente, Austen encanta leitores de todas as gerações, mantendo seu posto como uma das escritoras mais amadas da literatura mundial.',25,'\'\'',_binary '\0'),(71,'S523h','0.800','Mulan','bbbb5',25,'\'\'',_binary '\0'),(72,'H759v','0.810','Verity','Verity é um romance finalista do prêmio Goodreads de 2019 que mergulha no suspense psicológico. Lowen Ashleigh, uma escritora à beira da falência, é contratada para concluir uma série de sucesso após um acidente deixar a autora original, Verity Crawford, incapacitada. Ao investigar os escritos de Verity, Lowen descobre uma autobiografia perturbadora que revela segredos sombrios sobre o casamento de Verity e seu marido Jeremy, incluindo eventos trágicos envolvendo suas filhas. Enquanto mergulha mais fundo na vida de Verity, Lowen se vê envolvida em uma rede de mentiras e segredos, questionando-se sobre o que revelar e o que esconder. Colleen Hoover surpreende seus leitores com este suspense intenso que explora o lado mais obscuro das relações humanas.',26,'verity.jpg',_binary ''),(73,'R788h','0.028','Harry Potter e a Pedra filosofal','Harry Potter é uma saga literária que cativa um público diversificado, apesar de ser inicialmente destinada ao público infantojuvenil. A história acompanha Harry Potter, um órfão cujos pais foram assassinados por um poderoso bruxo quando ele era bebê. Criado pelos tios que o tratam mal, Harry descobre, aos 11 anos, que é um bruxo e é convidado a frequentar a Escola de Magia e Bruxaria de Hogwarts. Lá, ele descobre sua verdadeira história e seu destino: enfrentar o bruxo das trevas que matou seus pais. A série, repleta de elementos mágicos como fantasmas, dragões e feitiços, também aborda questões mais profundas, como o conflito entre o bem e o mal, preconceito, divisão de classes, entre outros temas universais, tornando-se uma obra que vai além do entretenimento.',28,'harry potter e a pedra filosofal.jpg',_binary ''),(74,'G83a','0.810','A Culpa é das Estrelas','A Culpa é das Estrelas, Com humor, doçura e melancolia, John Green narra o romance de dois adolescentes que se conhecem em um Grupo de Apoio para Crianças com Câncer. Hazel é uma paciente terminal cuja vida vem sendo prolongada por uma nova droga. Augustus foi jogador de basquete até perder uma perna para o osteossarcoma. Como Hazel, Gus gosta de ironizar os clichês do mundo do câncer – sua principal arma para encarar a doença que abrevia seus dias.',30,'a culpa e das estrelas.jpg',_binary ''),(75,'D738p','0.810','A Garota do Lago','A Garota do Lago é um thriller que se passa em uma pequena cidade montanhosa chamada Summit Lake, onde a repórter Kelsey Castle investiga o brutal assassinato da estudante de direito Becca Eckersley. Becca, filha de um advogado influente, foi morta em sua casa, deixando a comunidade em choque. Enquanto Kelsey segue as pistas do caso, ela se conecta intimamente com a vítima e descobre segredos sombrios sobre sua vida. A selvageria do crime e os esforços para abafar o caso indicam que pode não ter sido um ataque aleatório. Conforme Kelsey desvenda os segredos de Becca, ela também confronta seu próprio passado obscuro.',27,'blob:http://localhost:3000/f9b1977c-98d2-405b-bf0a-8dc13fba0af6',_binary '\0'),(76,'D738p','0.810','Procure nas Cinzas','Procure nas Cinzas, Victoria Ford estava tendo um caso extraconjugal com um escritor de sucesso quando ele é encontrado morto de modo tão espetacular que a notícia ocupou os telejornais por várias semanas. Na cena do crime, havia vestígios do DNA de Victoria por toda parte. Mas ela jurava à irmã, Emma, que não cometeu o crime.\nDuas décadas depois, Emma já não tem mais esperanças de provar a inocência de Victoria. Até que, com o seu DNA identificado entre as cinzas do WTC, Avery Mason, que comanda o programa de investigação de maior audiência da TV, a procura atrás de respostas e decide ajudar Emma a tentar provar a inocência da irmã morta.\nMas a jornada pela verdade não será tão simples. Há diversos mistérios encobertos que muitos queriam que permanecessem enterrados naquele 11 de setembro de 2001',27,'procure nas cinzas.jpg',_binary ''),(77,'D738p','0.810','Deixada para Trás','Deixada para Trás, Nicole e Megan, estudantes do último ano do ensino médio, desaparecem de uma festa em Emerson Bay, Carolina do Norte. Um ano depois, Megan retorna, transformada em uma celebridade após lançar um livro sobre seu sequestro, mas Nicole ainda está desaparecida. Livia, irmã mais velha de Nicole e estudante de patologia forense, aguarda ansiosamente por notícias do corpo de sua irmã. Quando uma pista surge ligando Nicole ao passado de outra vítima encontrada, Livia investiga e descobre uma conexão entre vários desaparecimentos de garotas. Enquanto Livia e Megan se aprofundam na investigação, percebem que o terror verdadeiro pode estar mais próximo do que imaginavam.',27,'deixada para trás.jpg',_binary ''),(78,'R284o','0.810','Os Sete Maridos de Evelyn Hugo','Os Sete Maridos de Evelyn Hugo, Com todo o esplendor que só a Hollywood do século passado pode oferecer, esta é uma narrativa inesquecível sobre os sacrifícios que fazemos por amor, o perigo dos segredos e o preço da fama.\nLendária estrela de Hollywood, Evelyn Hugo sempre esteve sob os holofotes seja estrelando uma produção vencedora do Oscar, protagonizando algum escândalo ou aparecendo com um novo marido... pela sétima vez. Agora, prestes a completar oitenta anos e reclusa em seu apartamento no Upper East Side, a famigerada atriz decide contar a própria história ou sua verdadeira história, mas com uma condição, que Monique Grant, jornalista iniciante e até então desconhecida, seja a entrevistadora. Ao embarcar nessa misteriosa empreitada, a jovem repórter começa a se dar conta de que nada é por acaso e que suas trajetórias podem estar profunda e irreversivelmente conectadas.',29,'os sete maridos de evelyn hugo.jpg',_binary '\0'),(79,'O72r','0.820','1984','1984, Publicada originalmente em 1949, a distopia futurista 1984 é um dos romances mais influentes do século XX, um inquestionável clássico moderno. Lançada poucos meses antes da morte do autor, é uma obra magistral que ainda se impõe como uma poderosa reflexão ficcional sobre a essência nefasta de qualquer forma de poder totalitário.',26,'1984.jpg',_binary '\0'),(80,'S883d','0.839','Drácula','Publicado em 1897, Drácula definiu todo um gênero e popularizou a figura do vampiro na cultura mundial. Neste romance epistolar – construído a partir de cartas, diários e telegramas, o advogado Jonathan Harker viaja até a Transilvânia para tratar de negócios com um conde sinistro e elegante. Em pouco tempo, Harker e seus companheiros percebem que estão em uma cilada empreendida por Drácula, essa terrível criatura que encarcera e seduz suas vítimas para depois lhes sugar o sangue. A história do vampiro mais célebre e aterrorizante do mundo ainda hoje ganha novas adaptações para cinema, quadrinhos, teatro e dança. Aqui em versão integral, o romance original do escritor irlandês inspira-se tanto na história de Vlad Tepes, sanguinário príncipe da Romênia que viveu no século XV, quanto em lendas sobre esse personagem e sobre vampiros.',26,'dracula.jpg',_binary '\0'),(81,'A176o','0.810','O Guia do Mochileiro Das Galáxias','É hilário, é frenético, é um clássico da ficção científica intergaláctica. O inglês Arthur Dent e seu Ford Prefect tem que partir em uma viagem pela galáxia quando Artur tem seu planeta e casa destruídos logo no início do livro. Uma aventura que tornou-se obra-prima e criou tantas referências no mundo nerd que merece ser lembrada. Sente-se confortavelmente, pegue sua toalha e divirta-se.\n',37,'mochileiro das galaxias.jpg',_binary '\0'),(82,'S963a','0.869','Auto da Compadecida','O Auto da Compadecida é uma peça teatral escrita por Ariano Suassuna em 1955, ambientada no interior do Nordeste brasileiro. A história acompanha as peripécias de João Grilo e Chicó, dois amigos astutos que vivem de trapaças. Com uma mistura peculiar de elementos populares e religiosos, a peça apresenta personagens inspirados em figuras típicas da região, como cangaceiros, padres e prostitutas. O enredo gira em torno das tentativas da dupla de escapar de dívidas e das autoridades locais, sempre utilizando artifícios e golpes. Reconhecida pelo humor irreverente e crítica social, a obra aborda temas como corrupção, hipocrisia religiosa e desigualdades sociais, tornando-se um dos maiores clássicos do teatro brasileiro.\n',38,'auto da compadecida.jpg',_binary '\0'),(83,'B79f','0.830','Farenheit 451','Esse é um clássico da distopia junto com 1984 de Orwell.\nEscrito originalmente em 1950, ele apresenta um mundo onde os livros são considerados uma ameaça ao sistema, tornando-os proibidos. Quem os tiver será considerado um criminoso e será perseguido.\nNo livro, acompanhamos a história de Guy Montag, um bombeiro. Seu trabalho é queimar livros, o que até então fazia sem pensar duas vezes. Mas com a entrada de uma estranha e imaginativa mulher, ele irá começar a repensar sua profissão.\n',39,'fahrenheit-451.jpg',_binary '\0'),(84,'L652a','0.820','As Crônicas de Nárnia','Sete romances constituem esta épica saga mundialmente celebrada. As Crônicas de Nárnia foi escrita pelo irlandês C.S. Lewis e, desde o lançamento do primeiro livro, O Leão, A Feiticeira e o Guarda-Roupa (em 1950) ganhou aclamação mundial.\nA série se tornou um clássico da alta fantasia e é considerado um livro perfeito para ler em qualquer idade. Elementos de fantasia e realidade se misturam para esta excelente saga de descobertas, aventuras e redenção.\nAlguns estudiosos fazem paralelos dos livros de Lewis com as histórias encontradas na Bíblia. Apesar das referências nunca terem sido confirmadas, elas agradam também pessoas religiosas de todo o mundo.\nTrês livros da série ganharam adaptações para o cinema: O Leão, A Feiticeira e o Guarda-Roupa (2005), As Crônicas de Nárnia: Príncipe Caspian (2008) e As Crônicas de Nárnia: A Viagem do Peregrino da Alvorada (2010).\n',40,'narnia.jpg',_binary '\0'),(85,'S523h','0.800','Sereia','aaaaaa',25,'img-1728514595635-550372474.jpeg',_binary '\0'),(86,'S523h','0.800','Sereia','aaaaaa',25,'img-1728515484014-342594666.jpeg',_binary ''),(87,'S523h','0.800','Sereia2','aaaaaa',25,'img-1728515508275-405367604.jpeg',_binary '\0'),(88,'S523h','0.800','Mulan','bbbb5',25,'narnia.jpg',_binary ''),(89,'S523h','0.800','Mulan','aaaaaa',25,'img-1730760671552-806125408.jpeg',_binary '');
/*!40000 ALTER TABLE `livros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livros_autores`
--

DROP TABLE IF EXISTS `livros_autores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_autores` (
  `lau_cod` int(11) NOT NULL AUTO_INCREMENT,
  `aut_cod` smallint(6) NOT NULL,
  `liv_cod` int(11) NOT NULL,
  PRIMARY KEY (`lau_cod`),
  KEY `liv_cod` (`liv_cod`),
  KEY `fk_livros_autores_autores` (`aut_cod`),
  CONSTRAINT `fk_livros_autores_autores` FOREIGN KEY (`aut_cod`) REFERENCES `autores` (`aut_cod`),
  CONSTRAINT `livros_autores_ibfk_1` FOREIGN KEY (`aut_cod`) REFERENCES `autores` (`aut_cod`),
  CONSTRAINT `livros_autores_ibfk_2` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_autores`
--

LOCK TABLES `livros_autores` WRITE;
/*!40000 ALTER TABLE `livros_autores` DISABLE KEYS */;
INSERT INTO `livros_autores` VALUES (1,61,65),(2,62,66),(3,63,67),(4,64,68),(5,65,69),(6,66,70),(7,67,71),(8,70,72),(9,71,73),(10,72,74),(11,69,75),(12,69,76),(13,69,77),(14,68,78),(15,64,79),(16,73,80),(17,74,81),(18,75,82),(19,76,83),(20,77,84);
/*!40000 ALTER TABLE `livros_autores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livros_generos`
--

DROP TABLE IF EXISTS `livros_generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_generos` (
  `lge_cod` int(11) NOT NULL AUTO_INCREMENT,
  `gen_cod` tinyint(4) NOT NULL,
  `liv_cod` int(11) NOT NULL,
  PRIMARY KEY (`lge_cod`),
  KEY `liv_cod` (`liv_cod`),
  KEY `fk_livros_generos_generos` (`gen_cod`),
  CONSTRAINT `fk_livros_generos_generos` FOREIGN KEY (`gen_cod`) REFERENCES `generos` (`gen_cod`),
  CONSTRAINT `livros_generos_ibfk_1` FOREIGN KEY (`gen_cod`) REFERENCES `generos` (`gen_cod`),
  CONSTRAINT `livros_generos_ibfk_2` FOREIGN KEY (`liv_cod`) REFERENCES `livros` (`liv_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_generos`
--

LOCK TABLES `livros_generos` WRITE;
/*!40000 ALTER TABLE `livros_generos` DISABLE KEYS */;
INSERT INTO `livros_generos` VALUES (1,81,65),(2,85,66),(3,93,67),(4,82,68),(5,85,69),(6,85,70),(7,89,71),(8,88,72),(9,79,73),(10,84,74),(11,88,75),(12,91,76),(13,91,77),(14,85,78),(15,90,79),(16,92,80),(17,80,81),(18,83,82),(19,86,83),(20,87,84),(21,94,88),(22,94,88),(23,94,88),(24,83,74),(25,86,74),(26,88,74),(27,89,74),(28,81,74);
/*!40000 ALTER TABLE `livros_generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recomendacao`
--

DROP TABLE IF EXISTS `recomendacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendacao` (
  `rcm_cod` int(11) NOT NULL AUTO_INCREMENT,
  `cur_cod` smallint(6) NOT NULL,
  `liv_cod` int(11) NOT NULL,
  `usu_cod` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacao`
--

LOCK TABLES `recomendacao` WRITE;
/*!40000 ALTER TABLE `recomendacao` DISABLE KEYS */;
INSERT INTO `recomendacao` VALUES (1,94,66,24,_binary '',_binary '\0',_binary '\0',_binary '\0'),(2,85,69,23,_binary '\0',_binary '',_binary '\0',_binary '\0'),(3,88,80,22,_binary '\0',_binary '\0',_binary '',_binary '\0'),(4,92,69,19,_binary '\0',_binary '\0',_binary '\0',_binary '');
/*!40000 ALTER TABLE `recomendacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usu_cod` int(11) NOT NULL AUTO_INCREMENT,
  `usu_rm` bigint(20) DEFAULT NULL,
  `usu_nome` varchar(50) NOT NULL,
  `usu_email` varchar(50) NOT NULL,
  `usu_senha` varchar(12) NOT NULL,
  `usu_tipo` tinyint(4) NOT NULL,
  `usu_sexo` tinyint(4) NOT NULL,
  `usu_foto` varchar(256) DEFAULT NULL,
  `usu_ativo` bit(1) NOT NULL,
  `usu_aprovado` bit(1) NOT NULL,
  `usu_social` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`usu_cod`),
  UNIQUE KEY `usu_email` (`usu_email`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (18,12345678910,'Kawany','kawany@etec.sp.gov.br','123456',2,3,NULL,_binary '',_binary '',NULL),(19,98765432231,'Daniele Calil','danikawari@gmail.com','d2a2n2i2',0,3,NULL,_binary '',_binary '',NULL),(20,23456781469,'Tiago Barros','tiago@etec.sp.gov.br','T1@g0_B@rr0s',0,2,NULL,_binary '\0',_binary '\0',NULL),(21,87654326010,'Victor Ribeiro','victor@etec.sp.gov.br','V1ct0rRib3r0',2,1,NULL,_binary '',_binary '',NULL),(22,12345678901,'Maria Silva','maria@etec.sp.gov.br','m5a5r5i5a5',5,0,NULL,_binary '',_binary '',NULL),(23,98765432100,'João Pereira','joao@etec.sp.gov.br','j6o6a6o6',0,1,NULL,_binary '',_binary '',NULL),(24,10293847561,'Ana Costa','ana@etec.sp.gov.br','a7n7a7c7o7',0,0,NULL,_binary '',_binary '',NULL),(25,85930271648,'Isabeli Oliveira','isabeli@etec.sp.gov.br','i8s8a8b8e8',0,0,NULL,_binary '',_binary '\0',NULL),(29,11223344556,'Donavan','donavan@etec.sp.gov.br','d2on1a1v2',0,1,NULL,_binary '',_binary '','Dovi'),(30,22334455667,'Bruno Costa','bruno@etec.sp.gov.br.com','Brun0#C0st@!',1,1,NULL,_binary '',_binary '\0',NULL),(31,33445566778,'Carla Mendes','carla@etec.sp.gov.br.com','C@rl4_M3nd!',0,0,NULL,_binary '',_binary '\0',NULL),(32,44556677889,'Daniel Oliveira','daniel@etec.sp.gov.br.com','D@niel#1',1,2,NULL,_binary '',_binary '\0',NULL),(33,55667788990,'Elaine Santos','elaine@etec.sp.gov.br.com','Ela1ne$!',1,0,NULL,_binary '',_binary '\0',NULL),(34,66778899001,'Fábio Pereira','fabio@etec.sp.gov.br.com','F@b10_P3!',0,2,NULL,_binary '',_binary '\0',NULL),(35,14991782357,'Socorro Jesus','dasdores@etec.sp.gov.br','churrosdoce',0,1,NULL,_binary '',_binary '',NULL),(49,12345678910,'Mariana Pereira','kian.sayuri123@gmail.com','123',4,0,NULL,_binary '',_binary '\0',NULL),(50,220083,'dani calil','dacalil90@gmail.com','@Abc1234',5,1,NULL,_binary '',_binary '',NULL),(51,44444444,'Donavan','donavani@etec.sp.gov.br','d2on1a1v2',1,1,NULL,_binary '',_binary '','Dovi'),(53,44444444,'Marcelo Pereira','marc@etec.sp.gov.br','566mmpp#',0,3,NULL,_binary '',_binary '\0',NULL),(54,785426,'Gabriela Monteiro Oliveira','Monteiro@gmail.com','@Abc1234',4,2,NULL,_binary '',_binary '\0',NULL),(55,44444444,'Marcelo Pereira','marce@etec.sp.gov.br','566mmpp#',0,0,NULL,_binary '',_binary '\0',NULL),(56,274365,'Sofia Carvalho','carvalho@gmail.com','@Abc1234',4,0,NULL,_binary '',_binary '\0',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_cursos`
--

DROP TABLE IF EXISTS `usuarios_cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_cursos` (
  `ucu_cod` int(11) NOT NULL AUTO_INCREMENT,
  `usu_cod` int(11) NOT NULL,
  `cur_cod` smallint(6) NOT NULL,
  `ucu_status` bit(1) NOT NULL,
  `ucu_ativo` bit(1) NOT NULL,
  `ucu_aprovado` bit(1) NOT NULL,
  PRIMARY KEY (`ucu_cod`),
  KEY `cur_cod` (`cur_cod`),
  KEY `usu_cod` (`usu_cod`),
  CONSTRAINT `usuarios_cursos_ibfk_1` FOREIGN KEY (`cur_cod`) REFERENCES `cursos` (`cur_cod`),
  CONSTRAINT `usuarios_cursos_ibfk_2` FOREIGN KEY (`usu_cod`) REFERENCES `usuarios` (`usu_cod`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_cursos`
--

LOCK TABLES `usuarios_cursos` WRITE;
/*!40000 ALTER TABLE `usuarios_cursos` DISABLE KEYS */;
INSERT INTO `usuarios_cursos` VALUES (13,18,95,_binary '',_binary '',_binary ''),(14,19,92,_binary '\0',_binary '\0',_binary '\0'),(15,20,93,_binary '\0',_binary '\0',_binary '\0'),(16,22,88,_binary '\0',_binary '\0',_binary '\0'),(17,23,85,_binary '\0',_binary '\0',_binary '\0'),(18,29,89,_binary '\0',_binary '\0',_binary '\0'),(19,30,89,_binary '\0',_binary '\0',_binary '\0'),(20,31,90,_binary '\0',_binary '\0',_binary '\0'),(21,32,86,_binary '\0',_binary '\0',_binary '\0'),(22,33,91,_binary '\0',_binary '\0',_binary '\0'),(23,34,94,_binary '\0',_binary '\0',_binary '\0'),(24,49,85,_binary '\0',_binary '\0',_binary '\0'),(25,50,92,_binary '\0',_binary '\0',_binary '\0'),(26,53,85,_binary '\0',_binary '',_binary '\0'),(27,54,92,_binary '\0',_binary '',_binary '\0'),(28,55,85,_binary '\0',_binary '',_binary '\0'),(29,56,99,_binary '\0',_binary '',_binary '\0'),(30,24,94,_binary '',_binary '',_binary ''),(33,18,85,_binary '',_binary '',_binary ''),(34,51,95,_binary '',_binary '',_binary '');
/*!40000 ALTER TABLE `usuarios_cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bd_tcc_tecdes_223_g3'
--

--
-- Dumping routines for database 'bd_tcc_tecdes_223_g3'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19 21:23:09
