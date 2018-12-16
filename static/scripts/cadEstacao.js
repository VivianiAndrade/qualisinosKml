
window.onload = () => {
    menuCadastro = document.querySelector('#menuCadastro');
    menuGrafico = document.querySelector('#menuGrafico');
    tipoUser = document.querySelector('#tipoUser');

    lista = document.querySelector('#lista');
    botao = document.querySelector('#botao');
    idBaciaText = document.querySelector('#idBacia');
    nomeText = document.querySelector('#nome');
    latText = document.querySelector('#lat');
    lngText = document.querySelector('#lng');
    idOperadorText = document.querySelector('#idOperador');

    botao.addEventListener('click', create);
    lista.addEventListener('click', del);
    lista.addEventListener('click', edit);
    lista.addEventListener('click', update);

    read();
    readMenu();
};


function templateTbody(idEstacao, idBacia, nomeBacia, nome, lat, lng, idOperador, nomeOperador) {
    return `<tr>
     <td>${nomeBacia} </td>  
    <td>${nome}</td>
    <td>${lat}</td>
    <td>${lng}</td>
    <td>${nomeOperador}</td>
    <td>
    <button class="btn update btn-success" data-id="${idEstacao}">Editar</button>
    <button class="btn delete btn-danger" data-id="${idEstacao}">Excluir</button>
    </td>
</tr>`

}

function templateTbodyAtualizar(idEstacao, idBacia, nomeBacia, nome, lat, lng, idOperador, nomeOperador) {
    return `
    <form>
    <tr> 
        <td>
            <select class="form-control" id="idBaciaUpdate">
                <option value="${idBacia}">${nomeBacia}</option>                                  
             </select> 
        </td>      
        <td> <input type="text" id="nomeUpdate" name="nomeUpdate" value="${nome}" 'required'></td>
        <td><input type="text" id="latUpdate" name="latUpdate" value="${lat}" 'required'></td>
        <td><input type="text" id="lngUpdate" name="lngUpdate" value="${lng}" 'required'></td>
        <td><select class="form-control" id="idOperadorUpdate">
                <option value="" selected>Selecione uma opção</option>
                <option value="1">COMUSA</option>
                <option value="2">CORSAN</option>
                <option value="3">FEPAM</option>                                   
                <option value="4">SEMAE</option>                                    
            </select>  
        </td>
        <td>
        <button class="btn btn-primary atualizar"
            data-id="${idEstacao}";>Salvar</button>
    </td>
    </tr>    
    </form>`
}

function read() {
    lista.innerHTML = '';

    //chamada ajax para o servidor na rota /estacao/all

    axios.get('/estacao/read')
        .then((response) => {
            console.log(response);
            response.data.forEach(element => {
                if(element.nome!='Todas')
                lista.innerHTML += templateTbody(element.idEstacao, element.idBacia, element.nomeBacia, element.nome, element.lat, element.lng, element.idOperador, element.nomeOperador);
            });

        })
        .catch((error) => {
            console.log(error);
        });
}

function create() {
    const idBacia = idBaciaText.value;
    const nome = nomeText.value;
    const lat = latText.value;
    const lng = lngText.value;
    const idOperador = idOperadorText.value;
   
    if ((nomeText.value.length != 0) && (latText.value.length != 0) && (lngText.value.length != 0) 
            && (idBaciaText.value.length != 0) && (idOperadorText.value.length != 0)) {
        axios.post('/estacao/save', { idBacia, nome, lat, lng, idOperador })
            .then(function (response) {
                console.log(response);
                lista.innerHTML += templateTbody(response.data[0], idBacia, nome, lat, lng, idOperador);
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
        axios.get('/estacao/read')
        .then(function (response) {
            console.log(response);    
            response.data.forEach(dados => {
                if(dados.idEstacao == id){                    
                    lista.innerHTML += templateTbodyAtualizar(dados.idEstacao, dados.idBacia,dados.nomeBacia, dados.nome, dados.lat, dados.lng, dados.idOperador, dados.nomeOperador);
                }
                else{   
                    lista.innerHTML += templateTbody(dados.idEstacao, dados.idBacia, dados.nomeBacia, dados.nome, dados.lat, dados.lng, dados.idOperador, dados.nomeOperador);  
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
        const idBacia = idBaciaUpdate.value;
        const nome = nomeUpdate.value;
        const lat = latUpdate.value;
        const lng = lngUpdate.value;
        const idOperador = idOperadorUpdate.value;
        if ((nomeUpdate.value.length != 0) && (latUpdate.length != 0) && (lngUpdate.value.length != 0)
                && (idBaciaUpdate.value.length != 0) && (idOperadorUpdate.value.length != 0)) {

            axios.put(`estacao/update/${id}`, { idBacia, nome, lat, lng, idOperador })
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
        axios.delete(`/estacao/delete/${id}`)
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
                if(element.nome!='Todas')
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