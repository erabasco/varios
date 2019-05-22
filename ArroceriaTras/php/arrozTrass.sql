

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP SCHEMA IF EXISTS arroztrass ;

-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
CREATE SCHEMA arroztrass DEFAULT CHARACTER SET utf8 ;
USE arroztrass ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paellas`
--

-- -----------------------------------------------------
-- Table paellas
-- -----------------------------------------------------
DROP TABLE IF EXISTS paellas ;

CREATE TABLE paellas (
  id INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(45) NOT NULL,
  precio SMALLINT NOT NULL,
  
  PRIMARY KEY (id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Ingredientes
-- -----------------------------------------------------
DROP TABLE IF EXISTS ingredientes ;

CREATE TABLE IF NOT EXISTS ingredientes (
  id INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(45) NOT NULL,
  idpaella VARCHAR(4) NOT NULL,
  precio SMALLINT NOT NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table ticket
-- -----------------------------------------------------
DROP TABLE IF EXISTS ticket ;

CREATE TABLE IF NOT EXISTS ticket (
  id INT NOT NULL AUTO_INCREMENT,
  idpaella VARCHAR(4) NOT NULL,
  ingredientes VARCHAR(60) NOT NULL,
  precio SMALLINT NOT NULL,
  fecha DATE NOT NULL,
  domicilio VARCHAR(60),
  PRIMARY KEY (id))  
ENGINE = InnoDB;



-- Volcado de datos para la tabla `paellas`
--
 
INSERT INTO `paellas` (`id`, `descripcion`, `precio`) VALUES 
(1, 'Paella valenciana', 9),
(2, "Paella de carne",  8),
(3, "Paella de arroz negro",  10),
(4, "Paella vegetal",  10),
(5, "Paella de marisco", 11);

--
-- Volcado de datos para la tabla `ingredientes`
--
 
INSERT INTO ingredientes VALUES 
(1, 'Champiñón',1, 1),
(2, 'Pavo',2, 1),
(3, 'Chirlas',5, 1),
(4, 'Sepia',3, 2),
(5, 'Calabacín',4, 1),
(6, 'Guisantes',1, 1),
(7, 'Chorizo',2, 2),
(8, 'Atún',5, 2),
(9, 'Pimiento rojo',3, 1),
(10, 'Puerro',4, 1),
(11, 'Ali-oli',1, 1),
(12, 'Jamón',2, 2),
(13, 'Gambones',5, 2),
(14, 'Pulpo',3, 2),
(15, 'Berenjena',4, 2);

