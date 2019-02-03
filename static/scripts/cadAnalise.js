
window.onload = () => {

    menuCadastro = document.querySelector('#menuCadastro');
    menuGrafico = document.querySelector('#menuGrafico');
    tipoUser = document.querySelector('#tipoUser');

    lista = document.querySelector('#lista');
    botao = document.querySelector('#botao');
    dataColetaText = document.querySelector('#dataColeta');
    parCondText = document.querySelector('#parCond');
    parTurbText = document.querySelector('#parTurb');
    parTempText = document.querySelector('#parTemp');
    parPhText = document.querySelector('#parPh');
    parODText = document.querySelector('#parOD');
    parNivelRioText = document.querySelector('#parNivelRio');
    cboEstacaoText = document.querySelector('#cboEstacao');


    botao.addEventListener('click', create);
    lista.addEventListener('click', del);
    lista.addEventListener('click', edit);
    lista.addEventListener('click', update);

    read();
    readMenu();
};

function templateTbody(idAnalise, idEstacao, nome, dataColeta, hora, parCond, parTurb, parTemp, parPh, parOD, parNivelRio) {
    var data = new Date(dataColeta);
    return `<tr>  
    <td>${nome}</td> 
    <td>${data}</td>
    <td>${hora}</td>
    <td>${parCond}</td>
    <td>${parTurb}</td>
    <td>${parTemp}</td>
    <td>${parPh}</td>
    <td>${parOD}</td>    
    <td>${parNivelRio}</td>
    <td>
    <button class="btn update btn-success" data-id="${idAnalise}">Editar</button>
    <button class="btn delete btn-danger" data-id="${idAnalise}">Excluir</button>
    </td>
</tr>`
}
function templateTbodyAtualizar(idAnalise, idEstacao, nome, dataColeta, hora, parCond, parTurb, parTemp, parPh, parOD, parNivelRio) {
    var data = new Date(dataColeta);
    return `
    <tr> 
        <td>${nome}</td>       
        <td> <input type="hidden" id="dataUpdate" name="dataUpdate" value="${dataColeta}">${data.toLocaleDateString()}</td>
        <td> <input type="hidden" id="horaUpdate" name="horaUpdate" value="${hora}" >${hora}</td>
        <td><input type="text" id="condUpdate" name="condUpdate" value="${parCond}" ></td>
        <td><input type="text" id="turbUpdate" name="turbUpdate" value="${parTurb}" ></td>
        <td><input type="text" id="tempUpdate" name="tempUpdate" value="${parTemp}" ></td>
        <td><input type="text" id="phUpdate" name="phUpdate" value="${parPh}" ></td>
        <td><input type="text" id="odUpdate" name="odUpdate" value="${parOD}" ></td>      
        <td><input type="text" id="nivelRioUpdate" name="nivelRioUpdate" value="${parNivelRio}" ></td>
        <td>
        <button class="btn btn-primary atualizar"
            data-id="${idAnalise}";>Salvar</button>
    </td>
    </tr>`
}

function templateCboBody(idEstacao, nome){
    if(nome !='Todas')
    return ` <option value="${idEstacao}">${nome}</option>`
}

function read() {
    lista.innerHTML = '';
    cboEstacao.innerHTML = '';
    //chamada ajax para o servidor na rota /analise/read
        axios.get('/verificaLogin')
        .then(function (response) {
            console.log(response.data);
            if(response.data.login == 'admin'){
                show();
                comboEstacaoAdmin();
            }
            else{
                showId(response.data.Id);
                comboEstacao(response.data.Id);
            }
        });
        
         
}

function show(){
    axios.get('/analise/read')
    .then((response) => {
        console.log(response);
        response.data.forEach(element => {
            lista.innerHTML += templateTbody(element.idAnalise, element.idEstacao, element.nome, element.dataColeta, element.hora,
                element.parCond, element.parTurb, element.parTemp, element.parPh, element.parOD, element.parNivelRio);
        });

    })
    .catch((error) => {
        console.log(error);
    });
}

function showId(id){
    axios.get(`/analise/showEstacao/${id}`)
    .then((response) => {
        console.log(response);
        response.data.forEach(element => {
            lista.innerHTML += templateTbody(element.idAnalise, element.idEstacao, element.nome, element.dataColeta, element.hora,
                element.parCond, element.parTurb, element.parTemp, element.parPh, element.parOD, element.parNivelRio);
        });

    })
    .catch((error) => {
        console.log(error);
    });
}

function comboEstacaoAdmin(){
    axios.get('/estacao/all')
    .then((response) => { 
        response.data.forEach(element => {
            cboEstacao.innerHTML += templateCboBody(element.idEstacao, element.nome);
        });  
    })
    .catch((error) => {
        console.log(error);
    });   
}

function comboEstacao(id){
    axios.get(`/estacao/show/${id}`)
    .then((response) => { 
        console.log(response);
            cboEstacao.innerHTML += templateCboBody(response.data.idEstacao, response.data.nome);
        
    })
    .catch((error) => {
        console.log(error);
    });   
}

function create() {
    //arrumar
    const idEstacao = cboEstacaoText.value;
    var dataColeta = dataColetaText.value;
    const parCond = parCondText.value;
    const parTurb = parTurbText.value;
    const parTemp = parTempText.value;
    const parPh = parPhText.value;
    const parOD = parODText.value;
    const parNivelRio = parNivelRioText.value;
    var today = new Date(dataColeta);

    console.log(idEstacao);
    h = today.getHours();
    m = today.getMinutes();
    s = today.getSeconds();
    const hora = h + ':' + m + ':' + s;
    dataColeta = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();


    if ((dataColetaText.value.length != 0) && (parCondText.value.length != 0) && (parTurbText.value.length != 0) &&
        (parTempText.value.length != 0) && (parPhText.value.length != 0) && (parODText.value.length != 0) &&
        (parNivelRioText.value.length != 0)) {
        axios.post('/analise/save', { idEstacao, dataColeta, hora, parCond, parTemp, parOD, parPh, parTurb, parNivelRio })
            .then(function (response) {
                console.log(response);
                lista.innerHTML += templateTbody(response.data[0], idEstacao, dataColeta, hora, parCond, parTurb, parTemp, parPh, parOD, parNivelRio);
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
        axios.get('/verificaLogin')
        .then(function (response) {
            console.log(response.data);
            if(response.data.login == 'admin'){
                editRead(id);
            }
            else{
                editReadEstacao(response.data.Id, id);
            }
    });
}
}
function editRead(id){
    axios.get('/analise/read')
    .then(function (response) {
        console.log(response);
        response.data.forEach(dados => {
            if (dados.idAnalise == id) {
                lista.innerHTML += templateTbodyAtualizar(dados.idAnalise, dados.idEstacao, dados.nome,  dados.dataColeta, dados.hora, dados.parCond,
                    dados.parTurb, dados.parTemp, dados.parPh, dados.parOD, dados.parNivelRio);
            }
            else {
                lista.innerHTML += templateTbody(dados.idAnalise, dados.idEstacao, dados.nome, dados.dataColeta, dados.hora, dados.parCond,
                    dados.parTurb, dados.parTemp, dados.parPh, dados.parOD, dados.parNivelRio);
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });
}

function editReadEstacao(IdEstacao, id){
    axios.get(`/analise/showEstacao/${IdEstacao}`)
    .then(function (response) {
        console.log(response);
        response.data.forEach(dados => {
            if (dados.idAnalise == id) {
                lista.innerHTML += templateTbodyAtualizar(dados.idAnalise, dados.idEstacao, dados.nome,  dados.dataColeta, dados.hora, dados.parCond,
                    dados.parTurb, dados.parTemp, dados.parPh, dados.parOD, dados.parNivelRio);
            }
            else {
                lista.innerHTML += templateTbody(dados.idAnalise, dados.idEstacao, dados.nome, dados.dataColeta, dados.hora, dados.parCond,
                    dados.parTurb, dados.parTemp, dados.parPh, dados.parOD, dados.parNivelRio);
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });
}

function update(element) {
    if (element.target.classList.contains('atualizar')) {
        const id = element.target.dataset.id;
        //arrumar
        const dataColeta = dataUpdate.value;
        const hora = horaUpdate.value;
        const parCond = condUpdate.value;
        const parTurb = turbUpdate.value;
        const parTemp = tempUpdate.value;
        const parPh = phUpdate.value;
        const parOD = odUpdate.value;
        const parNivelRio = nivelRioUpdate.value;

        if ((dataUpdate.value.length != 0) && (horaUpdate.value.length != 0) && (condUpdate.value.length != 0) &&
            (turbUpdate.value.length != 0) && (tempUpdate.value.length != 0) && (phUpdate.value.length != 0) &&
            (odUpdate.value.length != 0) && (nivelRioUpdate.value.length != 0)) {

            axios.put(`analise/update/${id}`, { dataColeta, hora, parCond, parTemp, parOD, parPh, parTurb, parNivelRio })
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
        axios.delete(`/analise/delete/${id}`)
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