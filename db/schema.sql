create extension if not exists "uuid-ossp";

create table if not exists address (
    address text primary key,
    privatekey text not null
);
