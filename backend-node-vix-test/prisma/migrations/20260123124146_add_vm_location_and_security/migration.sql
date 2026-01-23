-- AlterTable
ALTER TABLE `vM` ADD COLUMN `location` ENUM('SAO_PAULO', 'MIAMI') NULL,
    ADD COLUMN `vmPasswordHash` VARCHAR(255) NULL;
