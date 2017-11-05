CREATE TABLE scrum_status(status_username varchar references users(username), 
status_today varchar, status_yesterday varchar, status_obstacles varchar, 
status_date date, status_time time, primary key(status_username,status_date));

CREATE TABLE user(username varchar primary key not null, privilege varchar, ping_timestamp timestamp);
