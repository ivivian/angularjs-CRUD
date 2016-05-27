/* create mysql database and table and insert test data  */
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_item` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_item`;

DROP TABLE IF EXISTS `t_item`;

CREATE TABLE `t_item` (
  `fid` INT(4) NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(60) DEFAULT '' NOT NULL,
  `ftype` INT(4) DEFAULT 1 NOT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `t_item` */

INSERT  INTO t_item(fname,ftype) VALUES ('DHL',1); 
INSERT  INTO t_item(fname,ftype) VALUES ('EMS',1);
INSERT  INTO t_item(fname,ftype) VALUES ('APPLE',2); 
INSERT  INTO t_item(fname,ftype) VALUES ('HUAWEI',2); 
