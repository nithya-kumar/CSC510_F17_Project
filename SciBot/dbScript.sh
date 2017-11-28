#!/bin/sh
#Create table to track user, user roles, configured pings
create table users (
	username  varchar(25) primary key,
	t_id int references team(t_id),
	Full_name varchar(100) not null,
	is_admin boolean not null,
	ping_time time,
	ping_day varchar
);

#Create table for tracking status
create table status (
  username varchar(25) references users(username),
  status_today text,
  status_yesterday text,
  status_obstacles text,
  status_date date,
  status_time time
);

#Create table for track report generation times
create table team (
  t_id serial primary key ,
  ping_time time,
  ping_day varchar,
  report_time time,
  report_day varchar
);
