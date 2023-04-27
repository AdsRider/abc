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

create table if not exists image (
    id serial primary key,
    file_name text not null
);

create table if not exists ads (
    id serial primary key,
    title text not null,
    subtitle text,
    reward text not null,
    image_id int not null,
    start_date timestamptz not null,
    end_date timestamptz not null,
    user_email text not null
);
