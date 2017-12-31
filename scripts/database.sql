-- MySQL Script generated by MySQL Workbench
-- Wed Dec  6 19:13:40 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema kinnil
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `kinnil` ;

-- -----------------------------------------------------
-- Schema kinnil
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kinnil` DEFAULT CHARACTER SET utf8 ;
USE `kinnil` ;

-- -----------------------------------------------------
-- Table `kinnil`.`plantas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`plantas` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`plantas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `notas` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kinnil`.`areas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`areas` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`areas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  `notas` VARCHAR(45) NULL,
  `plantas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_areas_plantas1`
    FOREIGN KEY (`plantas_id`)
    REFERENCES `kinnil`.`plantas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_areas_plantas1_idx` ON `kinnil`.`areas` (`plantas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`productos` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `activo` VARCHAR(45) NULL,
  `notas` VARCHAR(45) NULL,
  `disponibilidad` VARCHAR(45) NULL,
  `rendimiento` VARCHAR(45) NULL,
  `calidad` VARCHAR(45) NULL,
  `plantas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_productos_plantas1`
    FOREIGN KEY (`plantas_id`)
    REFERENCES `kinnil`.`plantas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_productos_plantas1_idx` ON `kinnil`.`productos` (`plantas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`maquinas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`maquinas` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`maquinas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  `notas` VARCHAR(45) NULL,
  `areas_id` INT NOT NULL,
  `productos_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_maquinas_areas`
    FOREIGN KEY (`areas_id`)
    REFERENCES `kinnil`.`areas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maquinas_productos1`
    FOREIGN KEY (`productos_id`)
    REFERENCES `kinnil`.`productos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_maquinas_areas_idx` ON `kinnil`.`maquinas` (`areas_id` ASC);

CREATE INDEX `fk_maquinas_productos1_idx` ON `kinnil`.`maquinas` (`productos_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`tablets`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`tablets` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`tablets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tablet_uuid` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  `tipo` VARCHAR(45) NULL,
  `notas` VARCHAR(45) NULL,
  `maquinas_id` INT NOT NULL,
  `nodo` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tablets_maquinas1`
    FOREIGN KEY (`maquinas_id`)
    REFERENCES `kinnil`.`maquinas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_tablets_maquinas1_idx` ON `kinnil`.`tablets` (`maquinas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`razones_paro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`razones_paro` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`razones_paro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  `maquinas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_razones_maquinas1`
    FOREIGN KEY (`maquinas_id`)
    REFERENCES `kinnil`.`maquinas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_razones_maquinas1_idx` ON `kinnil`.`razones_paro` (`maquinas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`eventos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`eventos` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`eventos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operacion_uuid` VARCHAR(45) NULL,
  `activo` TINYINT NULL,
  `tiempo` BIGINT(20) NULL,
  `fecha` DATETIME(6) NULL,
  `hora` TIME NULL,
  `razones_id` INT NOT NULL,
  `maquinas_id` INT NOT NULL,
  `productos_id` INT NOT NULL,
  `valor` DOUBLE NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_eventos_razones1`
    FOREIGN KEY (`razones_id`)
    REFERENCES `kinnil`.`razones_paro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos_maquinas1`
    FOREIGN KEY (`maquinas_id`)
    REFERENCES `kinnil`.`maquinas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos_productos1`
    FOREIGN KEY (`productos_id`)
    REFERENCES `kinnil`.`productos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_eventos_razones1_idx` ON `kinnil`.`eventos` (`razones_id` ASC);

CREATE INDEX `fk_eventos_maquinas1_idx` ON `kinnil`.`eventos` (`maquinas_id` ASC);

CREATE INDEX `fk_eventos_productos1_idx` ON `kinnil`.`eventos` (`productos_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`turnos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`turnos` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`turnos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `inicio` TIME NULL,
  `fin` TIME NULL,
  `activo` TINYINT NULL,
  `notas` VARCHAR(45) NULL,
  `plantas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_turnos_plantas1`
    FOREIGN KEY (`plantas_id`)
    REFERENCES `kinnil`.`plantas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_turnos_plantas1_idx` ON `kinnil`.`turnos` (`plantas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`users` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `role` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `nivel` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kinnil`.`razones_calidad`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`razones_calidad` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`razones_calidad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `activo` TINYINT NULL,
  `maquinas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_calidad_maquinas1`
    FOREIGN KEY (`maquinas_id`)
    REFERENCES `kinnil`.`maquinas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_calidad_maquinas1_idx` ON `kinnil`.`razones_calidad` (`maquinas_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`eventos2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`eventos2` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`eventos2` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operacion_uuid` VARCHAR(45) NULL,
  `activo` TINYINT(4) NULL,
  `tiempo` BIGINT(20) NULL,
  `fecha` DATETIME(6) NULL,
  `hora` TIME NULL,
  `valor` DOUBLE NULL,
  `plantas_id` INT NOT NULL,
  `areas_id` INT NOT NULL,
  `maquinas_id` INT NOT NULL,
  `productos_id` INT NOT NULL,
  `razones_paro_id` INT NOT NULL,
  `razones_calidad_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_eventos2_plantas1`
    FOREIGN KEY (`plantas_id`)
    REFERENCES `kinnil`.`plantas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos2_areas1`
    FOREIGN KEY (`areas_id`)
    REFERENCES `kinnil`.`areas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos2_maquinas1`
    FOREIGN KEY (`maquinas_id`)
    REFERENCES `kinnil`.`maquinas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos2_productos1`
    FOREIGN KEY (`productos_id`)
    REFERENCES `kinnil`.`productos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos2_razones_paro1`
    FOREIGN KEY (`razones_paro_id`)
    REFERENCES `kinnil`.`razones_paro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos2_razones_calidad1`
    FOREIGN KEY (`razones_calidad_id`)
    REFERENCES `kinnil`.`razones_calidad` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_eventos2_plantas1_idx` ON `kinnil`.`eventos2` (`plantas_id` ASC);

CREATE INDEX `fk_eventos2_areas1_idx` ON `kinnil`.`eventos2` (`areas_id` ASC);

CREATE INDEX `fk_eventos2_maquinas1_idx` ON `kinnil`.`eventos2` (`maquinas_id` ASC);

CREATE INDEX `fk_eventos2_productos1_idx` ON `kinnil`.`eventos2` (`productos_id` ASC);

CREATE INDEX `fk_eventos2_razones_paro1_idx` ON `kinnil`.`eventos2` (`razones_paro_id` ASC);

CREATE INDEX `fk_eventos2_razones_calidad1_idx` ON `kinnil`.`eventos2` (`razones_calidad_id` ASC);


-- -----------------------------------------------------
-- Table `kinnil`.`tz`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kinnil`.`tz` ;

CREATE TABLE IF NOT EXISTS `kinnil`.`tz` (
  `id` INT NOT NULL,
  `actual` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
