create extension if not exists "uuid-ossp";

create table if not exists address (
    address text primary key,
    privatekey text not null,
    type text default 'user'
);

create table if not exists "user" (
    email text primary key,
    password text not null,
    level text,
    address text,
    expired_date timestamptz default now(),
    join_time timestamptz default now()
);

create table if not exists balance (
    id uuid primary key default uuid_generate_v4(),
    user_email text,
    type text check (type in ('ADS', 'ETH', 'KRW')),
    amount text default '0',
    available text default '0'
);

create table if not exists image (
    id serial primary key,
    filename text not null,
    originalname text not null,
    mimetype text not null,
    size int not null
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

create table if not exists block (
    hash text primary key,
    parent_hash text not null,
    height int not null,
    timestamp timestamptz not null
);

create table if not exists transaction (
    hash text primary key,
    "from" text not null,
    "to" text not null,
    amount text not null,
    type text check (type in ('ADS', 'ETH', 'KRW')),
    block_hash text not null,
    timestamp timestamptz
);

create table if not exists withdrawal (
    id uuid primary key default uuid_generate_v4(),
    address text not null,
    user_email text not null,
    amount text not null,
    hash text not null,
    timestamp timestamptz default now(),
    status text default 'need_check'
);

create table if not exists special_log (
    id uuid primary key default uuid_generate_v4(),
    memo text not null,
    amount text not null,
    user_email text not null,
    address text not null,
    timestamp timestamptz default now()
);

create table if not exists ads_result (
    id uuid primary key default uuid_generate_v4(),
    ads_id text not null,
    user_email text not null,
    path jsonb,
    start_time timestamptz,
    end_time timestamptz default now()
);
