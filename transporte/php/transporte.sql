

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `transporte`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itinerarios`
--

CREATE TABLE IF NOT EXISTS `itinerarios` (
  `idItin` smallint(5) unsigned NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `km` smallint(3) unsigned NOT NULL,
  PRIMARY KEY (`idItin`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conductores`
--

CREATE TABLE IF NOT EXISTS `conductores` (
  `idConductor` smallint(5) unsigned NOT NULL,
  `apellidosNombre` varchar(50) NOT NULL,
   PRIMARY KEY (`idConductor`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6;



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE IF NOT EXISTS `vehiculos` (
  `idMatricula` varchar(8) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  PRIMARY KEY (`idMatricula`)
  ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;


--
-- Estructura de tabla para la tabla `viajes`
--

CREATE TABLE IF NOT EXISTS `viajes` (
 `idViajes` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
 `idItin` smallint(5) unsigned NOT NULL,
 `fecha` date NOT NULL,
 `idConductor` smallint(5) unsigned NOT NULL,
 `idMatricula` varchar(7) NOT NULL,
  PRIMARY KEY (`idViajes`)
  ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

-- Volcado de datos para la tabla `entradas`
--

INSERT INTO `itinerarios` (`idItin`, `descripcion`, `km`) VALUES
(1, "Madrid-Bilbao", 400),
(2, "Cordoba-Barcelona", 861),
(3, "Cadiz-Lerida", 1110),
(4, "Madrid-Toledo", 72),
(5, "Barcelona-Malaga", 996),
(6, "Madrid-Valencia", 357),
(7, "Sevilla-Bilbao", 860);

--
-- Volcado de datos para la tabla `conductores`
--

INSERT INTO `conductores` (`idConductor`, `apellidosNombre`) VALUES
(1, "Perez Castillo, Juan"),
(2, "Alvarez Castillo, Ana"),
(3, "Cano Pedroche, Silvia"),
(4, "Gomez Rodriguez, Roberto"),
(5, "Zarrias Benavente, Julio");

INSERT INTO `vehiculos` (`idMatricula`, `descripcion`) VALUES
("1111AAA", "Mercedes"),
("2222BBB", "Pegaso"),
("3333CCC", "AVIA"),
("4444DDD","IVECO");