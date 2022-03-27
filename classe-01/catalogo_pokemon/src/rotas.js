const express = require('express');
const usuarios = require('../controladores/usuario');
const pokemon = require('../controladores/pokemon');


const rotas = express();

//usuarios do pokemon
rotas.post('/cadastrarusuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.autenticacaoLogin);

// //pokemon 
rotas.post('/pokemon', pokemon.cadastrarPokemon);
rotas.post('/pokemon/:id', pokemon.atualizarPokemon);
rotas.post('/listapokemon', pokemon.listarPokemon);
rotas.post('/listapokemonporid/:id', pokemon.listarPorIDPokemon);
rotas.delete('/pokemon/:id', pokemon.deletarPokemon);

module.exports = rotas;