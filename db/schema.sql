create extension if not exists "uuid-ossp";

create table if not exists address (
    address text primary key,
    privatekey text not null
);

create table if not exists "user" (
    email text primary key,
    password text not null,
    level text,
    address text,
    join_time timestamptz default now()
);

create table if not exists balance (
    id uuid primary key default uuid_generate_v4(),
    user_id text,
    type text check (type in ('ADS', 'ETH')),
    amount text default '0',
    available text default '0'
);
