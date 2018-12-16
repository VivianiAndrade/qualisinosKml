const express = require('express');
var createError = require('http-errors')
const router = express.Router();
const knex = require('../db');

var validator = require('validator');

//variavel de sessão para o Login
var sessions = require('express-session');

var session;
router.use(sessions({
	secret:'vndknkdsnlkndnvldnldnsvlsd',
	resave: true,
	saveUninitialized: true
}))
//----------------------------------------------------------------------------------------------------------
//Login
//Exibe os dados do usuário logado ou exibe a mensagem que necessita fazer o post para se logar
router.get('/verificaLogin', function(req,resp){
	session = req.session;
	if(session.uniqueID){
        resp.redirect('/redirects');
    }else{
        console.log('Você precisa se logar infomando o email e a senha: POST/verificaLogin');
    }
   
});
//Exibe os dados do usuário logado ou exibe a mensagem se os campos nao foram preenchidos corretamente
router.get('/redirects', function(req,resp){
	session = req.session;
		if(session.nome){
         resp.json({'userLogado':session.nome, 'Id':session.uniqueID, 'login': session.login});
		}
		else{
			resp.end('Email e senha inválidos. Por favor, tente novamente.');
		}
	});
//Logout do usuário
router.get('/logout', function(req,resp){
	session = req.session;
    req.session.destroy();
    resp.render('login.html');
	resp.json({response :"Sessão encerrada."});
});

//Cadastra email e senha para fazer o login
router.post('/verificaLogin', (req, res, next) => {
    var input = JSON.parse(JSON.stringify(req.body));
	login = input.login;
    senha = input.senha;

    session = req.session;
    
    knex({ a: 'usuario', b: 'usuarioestacao', c: 'estacao' })
    .select({
      idUsuario: 'a.idUsuario',
      idEstacao: 'b.idEstacao',
      login : 'a.login',
      senha: 'a.senha',      
      nomeEstacao : 'c.nome',
    })
    .whereRaw('?? = ??', ['a.idUsuario', 'b.idUsuario'])
    .whereRaw('?? = ??', ['b.idEstacao', 'c.idEstacao'])
    .whereRaw('a.login = ?', login)
    .whereRaw('a.senha = ?', senha)
    .then(dados => {
        console.log(dados);
        if (dados == ''){
            //res.render('login.html');
            return res.send(createError(400,'nada foi encontrado'))
        } 
        else{
            session.uniqueID = dados[0].idEstacao;
            session.nome = dados[0].nomeEstacao;
            session.login = dados[0].login;
           return res.json({response:session.nome});
        }

    }, next);

})

//------------------------------------------------------------------------------------------------------

router.get('/', (req, res) => {
    res.render('index.html');
})

router.get('/login', (req, res) => {
    res.render('login.html');
})

router.get('/painel', (req, res) => {
    res.render('indexPainel.html');
})

router.get('/contato', (req, res) => {
    res.render('action_page.php');
})

// Rota Bacia
router.get('/bacia', (req, res) => {
    res.render('cadBacia.html');
})

router.get('/bacia/all', (req, res, next) => {
    knex('bacia').then(dados => {
        res.send(dados );
    }, next);
})

router.post('/bacia/save', (req, res, next) => {
    var input = JSON.parse(JSON.stringify(req.body));

    var data = {
        nome  : validator.trim(validator.escape(input.nome)),
        lat : validator.trim(validator.escape(input.lat)),
        lng : validator.trim(validator.escape(input.lng))       
    };

    knex('bacia')
        .insert(data)
        .then(dados => {
            return res.send(dados);
        }, next);
})

router.get('/bacia/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('bacia')
        .where('idBacia', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send(dados);
        }, next)
});

router.put('/bacia/update/:id', function (req, res, next) {
    const { id } = req.params;
    knex('bacia')
        .where('idBacia', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

router.delete('/bacia/delete/:id', function (req, res, next) {
    const { id } = req.params;
    knex('bacia')
        .where('idBacia', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
});

// Rota estação
router.get('/estacao', (req, res) => {
    res.render('cadEstacao.html');
})

router.get('/estacao/all', (req, res, next) => {
    knex('estacao')
    .orderBy('nome', 'asc')
    .then(dados => {
        res.send(dados);
    }, next);
})

router.get('/estacao/read', (req, res, next) => {
    knex({ a: 'bacia', b: 'estacao', c: 'operador' })
    .select({
      idBacia: 'a.idBacia',
      nomeBacia: 'a.nome',
      idEstacao: 'b.idEstacao',
      nome : 'b.nome',
      lat : 'b.lat',
      lng : 'b.lng',
      idOperador: 'b.idOperador',
      nomeOperador: 'c.nome',
      imagem: 'c.endImagem'
    })
    .whereRaw('?? = ??', ['a.idBacia', 'b.idBacia'])
    .whereRaw('?? = ??', ['b.idOperador', 'c.idOperador'])
    .then(dados => {
        return res.send(dados);
    }, next);
    })

router.post('/estacao/save', (req, res, next) => {
    var input = JSON.parse(JSON.stringify(req.body));

    var data = {
        idBacia : validator.trim(validator.escape(input.idBacia)),
        nome  : validator.trim(validator.escape(input.nome)),
        lat : validator.trim(validator.escape(input.lat)),
        lng : validator.trim(validator.escape(input.lng)) ,
        idOperador: validator.trim(validator.escape(input.idOperador)),      
    };

    knex('estacao')
        .insert(data)
        .then(dados => {
            return res.send(dados);
        }, next);
})

router.get('/estacao/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('estacao')
        .where('idEstacao', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send(dados);
        }, next)
});

router.put('/estacao/update/:id', function (req, res, next) {
    const { id } = req.params;
    knex('estacao')
        .where('idEstacao', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

router.delete('/estacao/delete/:id', function (req, res, next) {
    const { id } = req.params;
    knex('estacao')
        .where('idEstacao', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
});

// Rota análise

router.get('/analise', (req, res) => {
    res.render('cadAnalise.html');
})

router.get('/analise/all', (req, res, next) => {
    knex('analise').then(dados => {
        res.send(dados);
    }, next);
})

router.get('/analise/read', (req, res, next) => {
    session = req.session.nome;
    console.log(session);
    knex({ a: 'analise', b: 'estacao' })
    .select({
      idAnalise: 'a.idAnalise',
      idEstacao: 'b.idEstacao',
      nome : 'b.nome',
      dataColeta: 'a.dataColeta',      
      hora : 'a.hora',
      parCond : 'a.parCond',
      parTemp : 'a.parTemp',
      parOD : 'a.parOD',
      parPh : 'a.parPh',
      parTurb : 'a.parTurb',
      parNivelRio : 'a.parNivelRio'
    })
    .whereRaw('?? = ??', ['a.idEstacao', 'b.idEstacao'])
    .then(dados => {
        return res.send(dados);
    }, next);
    })

router.post('/analise/save', (req, res, next) => {

    var input = req.body;

    var data = {
        idEstacao: input.idEstacao,    
        dataColeta: input.dataColeta,
        hora: input.hora,
        parCond: input.parCond,  
        parTemp: input.parTemp,  
        parOD: input.parOD,  
        parPh: input.parPh,  
        parTurb: input.parTurb,  
        parNivelRio: input.parNivelRio 
    };

     knex('analise')
        .insert(data)
        .then(dados => {
            return res.send(dados);
        }, next);
})

router.get('/analise/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('analise')
        .where('idAnalise', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send(dados);
        }, next)
});

router.get('/analise/showEstacao/:id', function (req, res, next) {
    const { id } = req.params;
    knex({ a: 'analise', b: 'estacao' })
    .select({
      idAnalise: 'a.idAnalise',
      idEstacao: 'b.idEstacao',
      nome : 'b.nome',
      dataColeta: 'a.dataColeta',      
      hora : 'a.hora',
      parCond : 'a.parCond',
      parTemp : 'a.parTemp',
      parOD : 'a.parOD',
      parPh : 'a.parPh',
      parTurb : 'a.parTurb',
      parNivelRio : 'a.parNivelRio'
    })
    .whereRaw('?? = ??', ['a.idEstacao', 'b.idEstacao'])
    .whereRaw('a.idEstacao = ?', id)
    .then(dados => {
        return res.send(dados);
    }, next);
});

router.put('/analise/update/:id', function (req, res, next) {
    const { id } = req.params;
    var input = req.body;
    sessionUniqueID = req.session.uniqueID;
    sessionLogin = req.session.login;
    if(sessionLogin == 'admin'){
        respIdEstacao = input.idEstacao;
    }
    else
    {
        respIdEstacao = sessionUniqueID;
    }

    var data = {
        dataColeta: input.dataColeta,
        hora: input.hora,
        parCond: input.parCond,  
        parTemp: input.parTemp,  
        parOD: input.parOD,  
        parPh: input.parPh,  
        parTurb: input.parTurb,  
        parNivelRio: input.parNivelRio 
    };
    console.log(data);
    knex('analise')
        .where('idAnalise', id)
        .update(data)
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

router.delete('/analise/delete/:id', function (req, res, next) {
    const { id } = req.params;
    knex('analise')
        .where('idAnalise', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
});

// Rota operador

router.get('/operador/all', (req, res, next) => {
    knex('operador').then(dados => {
        res.send(dados);
    }, next);
})

router.get('/operador/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('operador')
        .where('idOperador', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(createError(400,'nada foi encontrado'))
            res.send(dados);
        }, next)
});

// Rota selects analise
router.get('/analise/mapa', (req, res, next) => {
    var subcolumn = knex.raw('(select max(dataColeta) from analise where idEstacao =a.idEstacao group by idEstacao)');

    knex({ a: 'analise', e: 'estacao', o: 'operador' })
	.distinct({dataColeta: 'a.dataColeta'})
    .select({
      idAnalise: 'a.idAnalise',
      idEstacao: 'a.idEstacao',
      hora : 'a.hora',
      parCond : 'a.parCond',
      parTemp : 'a.parTemp',
      parOD: 'a.parOD',
      parPh: 'a.parPh',
      parTurb: 'a.parTurb',
	  parNivelRio: 'a.parNivelRio',
	  nome: 'e.nome',
	  nomeOperador: 'o.nome',
      imagem: 'o.endImagem',
      lat : 'e.lat',
      lng : 'e.lng',
    })
    .whereRaw('?? = ??', ['a.idEstacao', 'e.idEstacao'])
    .whereRaw('?? = ??', ['e.idOperador', 'o.idOperador'])
    .whereRaw('a.dataColeta = ?', [subcolumn])
    .then(dados => {
        return res.send(dados); 
    }, next);
})

// Rota para gráficos

router.get(`/grafico/:id`, (req, res) =>{
    res.render('graficos.html');
})


module.exports = router;
