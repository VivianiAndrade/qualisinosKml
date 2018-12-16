window.onload = () => {
    menuCadastro = document.querySelector('#menuCadastro');
    menuGrafico = document.querySelector('#menuGrafico');
    tipoUser = document.querySelector('#tipoUser');

    read();
}

function templateCadastro(){
    return ` 
    <li><a href="/analise">Análise</a></li>`
}

function templateCadastroAdmin(){
    return ` 
    <li><a href="/bacia">Bacia Hidrográfica</a></li>
    <li><a href="/estacao">Estação</a></li>
    <li><a href="/analise">Análise</a></li>`
}

function templateGrafico(id){
    axios.get(`/estacao/show/${id}`)
        .then((response) => {           
          return  menuGrafico.innerHTML += `<li><a href="/grafico/${response.data.idEstacao}">${response.data.nome}</a></li>`
        })
        .catch((error) => {
            console.log(error);
        });

}

function templateGraficoAdmin(){
    axios.get('/estacao/all')
        .then((response) => {
            response.data.forEach(element => {
                if(element.nome != 'Todas')
               return menuGrafico.innerHTML += `<li><a href="/grafico/${element.idEstacao}">${element.nome}</a></li>`
            });

        })
        .catch((error) => {
            console.log(error);
        });
    
}

function read(){
    menuCadastro.innerHTML = '';
    tipoUser.innerHTML = '';
    //chamada ajax para o servidor na rota /analise/read
        axios.get('/verificaLogin')
        .then(function (response) {
            if(response.data.login == 'admin'){
                tipoUser.innerHTML += 'Administrador';
                menuCadastro.innerHTML += templateCadastroAdmin();
                templateGraficoAdmin();
            }
            else{
                tipoUser.innerHTML += 'Estação: '+response.data.userLogado;
                menuCadastro.innerHTML += templateCadastro();
                templateGrafico(response.data.Id);
            }
        });

}