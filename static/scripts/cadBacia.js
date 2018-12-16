
window.onload = () => {
    menuCadastro = document.querySelector('#menuCadastro');
    menuGrafico = document.querySelector('#menuGrafico');
    tipoUser = document.querySelector('#tipoUser');
    lista = document.querySelector('#lista');
    botao = document.querySelector('#botao');
    nomeText = document.querySelector('#nome');
    latText = document.querySelector('#lat');
    lngText = document.querySelector('#lng');

    botao.addEventListener('click', create);
    lista.addEventListener('click', del);
    lista.addEventListener('click', edit);
    lista.addEventListener('click', update);
    read();
    readMenu();
};

function templateTbody(idBacia, nome, lat, lng) {

    return `<tr>
   
    <td>${nome}</td>
    <td>${lat}</td>
    <td>${lng}</td>
    <td>
    <button class="btn update btn-success" data-id="${idBacia}">Editar</button>
    <button class="btn delete btn-danger" data-id="${idBacia}">Excluir</button>
    </td>
</tr>`

}

function templateTbodyAtualizar(idBacia, nome, lat, lng) {
    return `
    <form>
    <tr>
       
        <td> <input type="text" id="nomeUpdate" name="nomeUpdate" value="${nome}" 'required'></td>
        <td><input type="text" id="latUpdate" name="latUpdate" value="${lat}" 'required'></td>
        <td><input type="text" id="lngUpdate" name="lngUpdate" value="${lng}" 'required'></td>
        <td>
        <button class="btn btn-primary atualizar"
            data-id="${idBacia}";>Salvar</button>
    </td>
    </tr>
    
    </form>`
}

function read() {
    lista.innerHTML = '';

    //chamada ajax para o servidor na rota /bacia/all
    axios.get('/bacia/all')
        .then((response) => {
            console.log(response);
            response.data.forEach(element => {
                if(element.nome!='Todas')
                lista.innerHTML += templateTbody(element.idBacia, element.nome, element.lat, element.lng);
            });

        })
        .catch((error) => {
            console.log(error);
        });
}

function create() {
    const nome = nomeText.value;
    const lat = latText.value;
    const lng = lngText.value;
    if ((nomeText.value.length != 0) && (latText.value.length != 0) && (lngText.value.length != 0)) {
        axios.post('/bacia/save', { nome, lat, lng })
            .then(function (response) {
                console.log(response);
                lista.innerHTML += templateTbody(response.data[0], nome, lat, lng);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function edit(element) {
    if (element.target.classList.contains('update')) {
        const id = element.target.dataset.id;
        lista.innerHTML = '';
        axios.get('/bacia/all')
        .then(function (response) {
            console.log(response);    
            response.data.forEach(dados => {
                if(dados.idBacia == id){                    
                    lista.innerHTML += templateTbodyAtualizar(dados.idBacia, dados.nome, dados.lat, dados.lng);
                }
                else{   
                    lista.innerHTML += templateTbody(dados.idBacia, dados.nome, dados.lat, dados.lng);  
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });

    }
}

function update(element) {
    if (element.target.classList.contains('atualizar')) {
        const id = element.target.dataset.id;
        const nome = nomeUpdate.value;
        const lat = latUpdate.value;
        const lng = lngUpdate.value;
        if ((nomeUpdate.value.length != 0) && (latUpdate.length != 0) && (lngUpdate.value.length != 0)) {

            axios.put(`bacia/update/${id}`, { nome, lat, lng })
            .then((response) => {
                if (response.status = 200) {
                   read();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}

function del(element) {
       if (element.target.classList.contains('delete')) {
        // id do elemento a excluir?
        const id = element.target.dataset.id;
        axios.delete(`/bacia/delete/${id}`)
            .then(function (response) {
                if (response.status = 200) {
                    lista.removeChild(element.path[2]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
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
          return menuGrafico.innerHTML += `<li><a href="/grafico/${response.data.idEstacao}">${response.data.nome}</a></li>`
        })
        .catch((error) => {
            console.log(error);
        });

}

function templateGraficoAdmin(){
    axios.get('/estacao/all')
        .then((response) => {
            response.data.forEach(element => {
               return menuGrafico.innerHTML += `<li><a href="/grafico/${element.idEstacao}">${element.nome}</a></li>`
            });

        })
        .catch((error) => {
            console.log(error);
        });
    
}

function readMenu(){
    menuCadastro.innerHTML = '';
    //chamada ajax para o servidor na rota /analise/read
        axios.get('/verificaLogin')
        .then(function (response) {
            console.log(response.data);
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