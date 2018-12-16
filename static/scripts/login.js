window.onload = () => {

    botao = document.querySelector('#botao');
    loginText = document.querySelector('#login');
    senhaText = document.querySelector('#senha');

    botao.addEventListener('click', create);
    read();

}

function create() {
    //arrumar
    const login = loginText.value;
    const senha = senhaText.value;
    if ((loginText.value.length != 0) && (senhaText.value.length != 0)) {
        axios.post('/verificaLogin', { login, senha})
            .then(function (response) {
                console.log('entrei');
               console.log(response);

            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function read(){
    axios.get('/verificaLogin')
    .then(function (response) {
        console.log(response.data);
    });
}