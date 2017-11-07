#Create table for tracking status
create table status (
  username varchar(25) references users(username),
  status_today text,
  status_yesterday text,
  status_obstacles text,
  status_date date,
  status_time time
);

#Create table to track user, user roles, configured pings
create table users (
	username  varchar(25) primary key,
	Full_name varchar(100) not null,
	is_admin boolean not null,
	ping_timestamp time
);

