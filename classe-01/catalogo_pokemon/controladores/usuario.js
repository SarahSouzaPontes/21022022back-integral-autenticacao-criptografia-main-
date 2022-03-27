const conexao = require('../src/conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../src/jwt_securekey')

const pwd = securePassword();

const cadastrarUsuario = async (req, res) => {

    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json("Os campos nome, email e senha são obrigatorios");
        }

        try {
            const usuarios = await conexao.query("select * from usuarios where email = $1", [email]);
            if (usuarios.rowCount > 0) {
                return res.status(400).json("Já existe um usuário com este email");
            }

        }
        catch (error) {
            return res.status(400).json(error.message);
        }
        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const usuario = await conexao.query("insert into usuarios (nome, email, senha ) values ($1, $2, $3)", [nome, email, hash]);
        return res.status(200).json("O usuario " + nome + " cadastrado com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const autenticacaoLogin = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json("Os campos email e senha são obrigatorios");
    }
    try {
        const usuarios = await conexao.query("select * from usuarios where email = $1", [email])
        if (usuarios.rowCount === 0) {
            return res.status(400).json("Email ou senha incorretos");
        }
        const usuario = usuarios.rows[0];
        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, 'hex'))

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json("Email ou senha incorretos");
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
                    const usuarios = await conexao.query('update usuario set senha = $1 where email = $2', [hash, email]);
                    // Save improvedHash somewhere
                } catch {

                }
                break
        }
        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret, { expiresIn: '2h' });
        console.log(token);
        return res.send(token);

    }
    catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {
    cadastrarUsuario,
    autenticacaoLogin
}