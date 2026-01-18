create table employeed (
	id serial,
	type varchar not null,
	password varchar not null
);

create table products (
	id serial,
	name varchar not null,
	cost float not null
);

create table sale (
	id serial,
	products varchar not null,
	prices varchar not null,
	total float not null
);


insert into employeed (type, password) values ('vendedor', 'vendedor1')

insert into products (name, cost) values ('Sandia', 40.30)
insert into products (name, cost) values ('Chocolate', 10.50)
	
insert into sale (products, prices, total) values ('[Sandia, Chocolate]', '[40.30, 10.50]', 50.80)


delete from sale