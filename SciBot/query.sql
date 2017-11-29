
-- Create table for track report generation times
create table team (
  t_id serial primary key ,
  ping_time time,
  ping_day varchar,
  report_time time,
  report_day varchar
);

create table users (
	username  varchar(25) primary key,
	t_id int references team(t_id),
	Full_name varchar(100) not null,
	is_admin boolean not null,
	ping_time time,
	ping_day varchar
);

-- Create table for tracking status
create table status (
  username varchar(25) references users(username),
  status_today text,
  status_yesterday text,
  status_obstacles text,
  status_date date,
  status_time time
);

insert into team values(1, '11:00:00', 'EVERYDAY', '17:00:00', 'EVERYDAY');

insert into users values('U72KDEH60', 1, 'Anshul Chandra', false, null, null);
insert into users values('U6WEPTUH0', 1, 'Sameer', false, null, null);
insert into users values('U6VUJ0QBB', 1, 'Shriya', false, null, null);
insert into users values('U6XBLN2KW', 1, 'Nisha', false, null, null);
insert into users values('U71U0JF6U', 1, 'Nithya', false, null, null);
insert into users values('U861PALJC', 1, 'SEProject', false, null, null);
insert into users values('U86K83A59', 1, 'Admin SEProject', true, null, null);
