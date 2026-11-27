-- Scripts CREATE generados desde src/entities/entities/*
-- Requiere que existan: usuarios, camiones, productos, clientes
-- Orden respeta dependencias de llaves foraneas.

USE gourmet360;

-- ---------------------------------------------------------
-- despachos
-- ---------------------------------------------------------
CREATE TABLE `despachos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `chofer_id` BIGINT NOT NULL,
  `camion_id` BIGINT NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('pendiente','en_ruta','finalizado') NULL DEFAULT 'pendiente',
  `gastos` DECIMAL(10,2) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_despachos_camion` (`camion_id`),
  KEY `fk_despachos_chofer` (`chofer_id`),
  KEY `fk_despachos_created_by` (`created_by`),
  KEY `fk_despachos_updated_by` (`updated_by`),
  CONSTRAINT `fk_despachos_camion` FOREIGN KEY (`camion_id`) REFERENCES `camiones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachos_chofer` FOREIGN KEY (`chofer_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachos_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachos_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- despacho_detalles
-- ---------------------------------------------------------
CREATE TABLE `despacho_detalles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `despacho_id` BIGINT NOT NULL,
  `producto_id` BIGINT NOT NULL,
  `cantidad_entregada` DECIMAL(10,2) NOT NULL,
  `cantidad_restante` DECIMAL(10,2) NULL,
  `cantidad_asignada` DECIMAL(10,2) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_despachodetalles_created_by` (`created_by`),
  KEY `fk_despachodetalles_despacho` (`despacho_id`),
  KEY `fk_despachodetalles_producto` (`producto_id`),
  KEY `fk_despachodetalles_updated_by` (`updated_by`),
  CONSTRAINT `fk_despachodetalles_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachodetalles_despacho` FOREIGN KEY (`despacho_id`) REFERENCES `despachos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachodetalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_despachodetalles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- gasto_despacho
-- ---------------------------------------------------------
CREATE TABLE `gasto_despacho` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `id_despacho` BIGINT NOT NULL,
  `id_chofer` BIGINT NOT NULL,
  `detalle` VARCHAR(100) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gasto_despacho_despacho` (`id_despacho`),
  KEY `fk_gasto_despacho_chofer` (`id_chofer`),
  CONSTRAINT `fk_gasto_despacho_despacho` FOREIGN KEY (`id_despacho`) REFERENCES `despachos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_gasto_despacho_chofer` FOREIGN KEY (`id_chofer`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- rendiciones
-- ---------------------------------------------------------
CREATE TABLE `rendiciones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `despacho_id` BIGINT NOT NULL,
  `productos_vendidos` DECIMAL(10,2) NULL DEFAULT 0.00,
  `productos_fiados` DECIMAL(10,2) NULL DEFAULT 0.00,
  `productos_perdidos` DECIMAL(10,2) NULL DEFAULT 0.00,
  `productos_sobrantes` DECIMAL(10,2) NULL DEFAULT 0.00,
  `total_cobrado` DECIMAL(10,2) NULL DEFAULT 0.00,
  `observaciones` TEXT NULL,
  `fecha_cierre` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rendiciones_created_by` (`created_by`),
  KEY `fk_rendiciones_despacho` (`despacho_id`),
  KEY `fk_rendiciones_updated_by` (`updated_by`),
  CONSTRAINT `fk_rendiciones_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rendiciones_despacho` FOREIGN KEY (`despacho_id`) REFERENCES `despachos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rendiciones_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- ventas
-- ---------------------------------------------------------
CREATE TABLE `ventas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `despacho_id` BIGINT NOT NULL,
  `cliente_id` BIGINT NOT NULL,
  `fecha` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_pago` DATETIME NULL,
  `cobro_chofer_id` BIGINT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `pagado` DECIMAL(10,2) NOT NULL,
  `efectivo` DECIMAL(10,2) NOT NULL,
  `transferencia` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ventas_cliente` (`cliente_id`),
  KEY `fk_ventas_created_by` (`created_by`),
  KEY `fk_ventas_despacho` (`despacho_id`),
  KEY `fk_ventas_updated_by` (`updated_by`),
  CONSTRAINT `fk_ventas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventas_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventas_despacho` FOREIGN KEY (`despacho_id`) REFERENCES `despachos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventas_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- venta_detalles
-- ---------------------------------------------------------
CREATE TABLE `venta_detalles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `venta_id` BIGINT NOT NULL,
  `producto_id` BIGINT NOT NULL,
  `cantidad` DECIMAL(10,2) NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ventadetalles_created_by` (`created_by`),
  KEY `fk_ventadetalles_producto` (`producto_id`),
  KEY `fk_ventadetalles_updated_by` (`updated_by`),
  KEY `fk_ventadetalles_venta` (`venta_id`),
  CONSTRAINT `fk_ventadetalles_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventadetalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventadetalles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ventadetalles_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- deuda
-- ---------------------------------------------------------
CREATE TABLE `deuda` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `id_venta` BIGINT NOT NULL,
  `id_cliente` BIGINT NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `valor_cobrado` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `pago_inicial` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `saldo_pendiente` DECIMAL(10,2) NOT NULL,
  `estado` ENUM('PENDIENTE','PARCIAL','PAGADA','ANULADA') NOT NULL,
  `fecha_ultimo_cobro` DATETIME NULL,
  `observacion` VARCHAR(500) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_deuda_cliente` (`id_cliente`),
  KEY `idx_deuda_estado` (`estado`),
  KEY `idx_deuda_venta` (`id_venta`),
  KEY `fk_deuda_created_by` (`created_by`),
  KEY `fk_deuda_updated_by` (`updated_by`),
  CONSTRAINT `fk_deuda_venta` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_deuda_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_deuda_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_deuda_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- cobro_deuda
-- ---------------------------------------------------------
CREATE TABLE `cobro_deuda` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `id_deuda` BIGINT NOT NULL,
  `fecha_cobro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valor_cobrado` DECIMAL(10,2) NOT NULL,
  `id_chofer` BIGINT NOT NULL,
  `tipo_pago` ENUM('EFECTIVO','TRANSFERENCIA') NOT NULL,
  `referencia` VARCHAR(150) NULL,
  `observacion` VARCHAR(500) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cobro_chofer` (`id_chofer`),
  KEY `idx_cobro_deuda` (`id_deuda`),
  KEY `idx_cobro_fecha` (`fecha_cobro`),
  KEY `fk_cobro_deuda_created_by` (`created_by`),
  KEY `fk_cobro_deuda_updated_by` (`updated_by`),
  CONSTRAINT `fk_cobro_deuda_deuda` FOREIGN KEY (`id_deuda`) REFERENCES `deuda` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobro_deuda_chofer` FOREIGN KEY (`id_chofer`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobro_deuda_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobro_deuda_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- cobros
-- ---------------------------------------------------------
CREATE TABLE `cobros` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT NOT NULL,
  `despacho_id` BIGINT NOT NULL,
  `monto_cobrado` DECIMAL(10,2) NOT NULL,
  `fecha` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cobros_cliente` (`cliente_id`),
  KEY `fk_cobros_created_by` (`created_by`),
  KEY `fk_cobros_despacho` (`despacho_id`),
  KEY `fk_cobros_updated_by` (`updated_by`),
  CONSTRAINT `fk_cobros_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobros_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobros_despacho` FOREIGN KEY (`despacho_id`) REFERENCES `despachos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cobros_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- devoluciones
-- ---------------------------------------------------------
CREATE TABLE `devoluciones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `cliente_id` BIGINT NOT NULL,
  `chofer_id` BIGINT NOT NULL,
  `fecha_devolucion` DATE NOT NULL,
  `observacion` VARCHAR(255) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `chofer_id` (`chofer_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`chofer_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devoluciones_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devoluciones_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- devolucion_detalles
-- ---------------------------------------------------------
CREATE TABLE `devolucion_detalles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `devolucion_id` BIGINT NOT NULL,
  `producto_id` BIGINT NOT NULL,
  `cantidad_devuelta` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `devolucion_id` (`devolucion_id`),
  KEY `producto_id` (`producto_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `devolucion_detalles_ibfk_1` FOREIGN KEY (`devolucion_id`) REFERENCES `devoluciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devolucion_detalles_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devolucion_detalles_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `devolucion_detalles_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- cambios
-- ---------------------------------------------------------
CREATE TABLE `cambios` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `devolucion_id` BIGINT NOT NULL,
  `chofer_id` BIGINT NOT NULL,
  `fecha_cambio` DATE NOT NULL,
  `total_productos` INT NULL DEFAULT 0,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `chofer_id` (`chofer_id`),
  KEY `created_by` (`created_by`),
  KEY `devolucion_id` (`devolucion_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `cambios_ibfk_1` FOREIGN KEY (`devolucion_id`) REFERENCES `devoluciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambios_ibfk_2` FOREIGN KEY (`chofer_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambios_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambios_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- cambio_detalles
-- ---------------------------------------------------------
CREATE TABLE `cambio_detalles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cambio_id` BIGINT NOT NULL,
  `producto_id` BIGINT NOT NULL,
  `cantidad_entregada` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT NULL,
  `updated_by` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `cambio_id` (`cambio_id`),
  KEY `created_by` (`created_by`),
  KEY `producto_id` (`producto_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `cambio_detalles_ibfk_1` FOREIGN KEY (`cambio_id`) REFERENCES `cambios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambio_detalles_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambio_detalles_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cambio_detalles_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



ALTER TABLE ventas
  MODIFY COLUMN cobro_chofer_id BIGINT NULL;
 
 
 
 ALTER TABLE ventas
  ADD KEY fk_ventas_cobro_chofer (cobro_chofer_id),
  ADD CONSTRAINT fk_ventas_cobro_chofer FOREIGN KEY (cobro_chofer_id) REFERENCES usuarios (id);