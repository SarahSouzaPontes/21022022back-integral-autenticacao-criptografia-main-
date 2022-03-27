CREATE DATABASE IF NOT EXISTS catalogo_pokemons;

CREATE TABLE IF NOT EXISTS USUARIOS(
id serial  NOT NULL, 
nome text NOT NULL,
email text NOT NULL,
senha text NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS POKEMON(
id serial NOT NULL, 
usuario_id int NOT NULL, 
nome text NOT NULL,
habilidades text NOT NULL,
imagem text,
apelido text NOT NULL,
PRIMARY KEY (id)
);