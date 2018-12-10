CREATE TABLE `repositories` (
  `id` bigint(20) unsigned NOT NULL,
  `owner_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE repositories ADD INDEX idx_owner_id(owner_id);


CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `pulls` (
  `id` bigint(20) unsigned NOT NULL,
  `repository_id` bigint(20) unsigned NOT NULL,
  `number` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `state` varchar(12) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `closed_at` datetime DEFAULT NULL,
  `merged_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE pulls ADD INDEX idx_userId(user_id);
ALTER TABLE pulls ADD INDEX idx_repositoryId_number(repository_id, number);
ALTER TABLE pulls ADD INDEX idx_createdAt(created_at);
ALTER TABLE pulls ADD INDEX idx_mergedAt(merged_at);


CREATE TABLE `pulls_comments` (
  `id` bigint(20) unsigned NOT NULL,
  `repository_id` bigint(20) unsigned NOT NULL,
  `number` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `path` varchar(255) NOT NULL,
  `position` int(20) unsigned DEFAULT NULL,
  `original_position` int(20) unsigned NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE pulls_comments ADD INDEX idx_userId(user_id);
ALTER TABLE pulls_comments ADD INDEX idx_updatedAt(updated_at);


CREATE TABLE `issues_comments` (
  `id` bigint(20) unsigned NOT NULL,
  `repository_id` bigint(20) unsigned NOT NULL,
  `number` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE issues_comments ADD INDEX idx_userId(user_id);
ALTER TABLE issues_comments ADD INDEX idx_updatedAt(updated_at);


CREATE TABLE `issues` (
  `id` bigint(20) unsigned NOT NULL,
  `repository_id` bigint(20) unsigned NOT NULL,
  `number` bigint(20) unsigned NOT NULL,
  `creator_id` bigint(20) unsigned NOT NULL,
  `state` varchar(12) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `closed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE issues ADD INDEX idx_creatorId(creator_id);
ALTER TABLE issues ADD INDEX idx_updatedAt(updated_at);
