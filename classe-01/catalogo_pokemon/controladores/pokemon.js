const conexao = require('../src/conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../src/jwt_securekey')


// rotas.post('/pokemon', pokemon.cadastrarPokemon);
// rotas.post('/pokemon/:id', pokemon.atualizarPokemon);
// rotas.get('/pokemon', pokemon.listarPokemon);
// rotas.get('/pokemon/:id', pokemon.listarPorIDPokemon);
// rotas.delete('/pokemon/:id', pokemon.deletarPokemon);

const cadastrarPokemon = async (req, res) => {
    try {
        const { nome, habilidades, imagem, apelido, token } = req.body;
        if (!token) {
            return res.status(400).json("Usuário não logado. Operação não permitida");
        }
        if (!nome || !habilidades) {
            return res.status(400).json("Os campos nome, habilidades são obrigatorios");
        }
        const usuario = jwt.verify(token, jwtSecret);
        try {
            const pokemon = await conexao.query("insert into pokemon (usuario_id, nome, habilidades, imagem, apelido ) values ($1, $2, $3, $4, $5)", [usuario.nome, nome, habilidades, imagem, apelido]);
            console.log(usuario);
            return res.status(200).json("O pokemon " + nome + " cadastrado com sucesso pelo usuário " + usuario.id);

        }
        catch (error) {
            return res.status(400).json("Token fornecido é inválido" + error.message);
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarPokemon = async (req, res) => {
    const { id } = req.params;
    const { apelido, token } = req.body;
    if (!token) {
        return res.status(400).json("Usuário não logado. Operação não permitida");
    }
    if (!apelido) {
        return res.status(400).json("Campo apelido é obrigatório. Operação não permitida");
    }
    try {
        const usuario = jwt.verify(token, jwtSecret);
        try {
            const pokemon = await conexao.query('select * from pokemon where id = $1', [id]);
            if (pokemon.rowCount === 0) {
                return res.status(404).json("Pokemon não encontrado")
            }
            const pokemonAtualizado = await conexao.query('update pokemon set apelido = $1 where id = $2', [apelido, id])
            return res.status(200).json("O pokemon " + pokemon.rows[0].nome + " cadastrado com sucesso pelo usuário " + usuario.nome);
        } catch (error) {
            return res.status(400).json(error.message);

        }

    }
    catch (error) {
        return res.status(400).json("Token fornecido é inválido" + error.message);
    }

}

const listarPokemon = async (req, res) => {
    /*
    "id": 1,
    "usuario": "Nome do usuário responsável"
    "nome": "Pikachu",
    "apelido": "pikachu",
    "habilidades": ["static", "lightning-rod"], ####Como tranformar de string para array json############
    "imagem": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"
    */
    const { token } = req.body;
    if (!token) {
        return res.status(400).json("Usuário não logado. Operação não permitida");
    }
    try {
        const usuario = jwt.verify(token, jwtSecret);
        try {
            const pokemon = await conexao.query('select * from pokemon where usuario_id = $1', [usuario.nome]);

            return res.json(pokemon.rows);

        }
        catch (error) {
            return res.status(400).json("Token fornecido é inválido" + error.message);
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarPorIDPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    if (!token) {
        return res.status(400).json("Usuário não logado. Operação não permitida");
    }
    try {
        const usuario = jwt.verify(token, jwtSecret);
        try {
            const pokemon = await conexao.query('select * from pokemon where id = $1', [id]);
            if (pokemon.rowCount === 0) {
                return res.status(404).json("Pokemon não encontrado")
            }

            return res.json(pokemon.rows);

        }
        catch (error) {
            return res.status(400).json("Token fornecido é inválido" + error.message);
        }
    }
    catch (error) {
        return res.status(400).json(error.message);

    }
}

const deletarPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    if (!token) {
        return res.status(400).json("Usuário não logado. Operação não permitida");
    }
    try {
        const usuario = jwt.verify(token, jwtSecret);
        try {
            const pokemon = await conexao.query('select * from pokemon where id = $1 and usuario_id = $2', [id, usuario.nome]);
            if (pokemon.rowCount === 0) {
                return res.status(404).json("Pokemon não encontrado")
            }
            const pokemonDeletado = await conexao.query('delete from pokemon where id = $1 and usuario_id = $2', [id, usuario.nome]);
            return res.status(200).json("Pokemon deletado com sucesso");
        }
        catch (error) {
            return res.status(400).json("Token fornecido é inválido" + error.message);
        }

    } catch (error) {
        return res.status(400).json(error.message);

    }

}


module.exports = {
    cadastrarPokemon,
    atualizarPokemon,
    listarPokemon,
    listarPorIDPokemon,
    deletarPokemon
}