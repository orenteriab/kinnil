/* Replace with your SQL commands */
create table `users` (
    `id`            bigint          primary     key auto_increment
    ,`username`     varchar(250)    not null    unique
    ,`password`     varchar(300)    not null
    ,`name`         varchar(50)     not null
    ,`lastname`     varchar(50)     not null
    ,`created_at`   datetime        not null    default now()
    ,`updated_at`   datetime        not null    default now()
);