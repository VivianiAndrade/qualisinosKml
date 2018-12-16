window.onload = () => {
    menuCadastro = document.querySelector('#menuCadastro');
    menuGrafico = document.querySelector('#menuGrafico');
    tipoUser = document.querySelector('#tipoUser');
    read();
    new MyChart();
};

class MyChart {
    constructor() {
        this.iniciaElementos();
        this.carregaDados().then(() => this.render());
    }

    iniciaElementos() {

        this.chartPhElement = document.querySelector("#dataPhChart");
        this.chartPh = this.criarChartPh();
      
        this.chartTurbElement = document.querySelector("#dataTurbChart");
        this.chartTurb = this.criarChartTurb();

        this.chartTempElement = document.querySelector("#dataTempChart");
        this.chartTemp = this.criarChartTemp();

        this.chartODElement = document.querySelector("#dataODChart");
        this.chartOD = this.criarChartOD();

        this.chartCondElement = document.querySelector("#dataCondChart");
        this.chartCond = this.criarChartCond();

        this.chartNivelElement = document.querySelector("#dataNivelChart");
        this.chartNivel = this.criarChartNivel();

        this.carregaDados();
        this.render();
    }

    carregaDados() {
        var url   = window.location.pathname;
        var items = url.split("/");
        return axios
            .get(`/analise/showEstacao/${items[2]}`)
            .then(response => {
                this.prepararDados(response.data);

            })
            .catch(error => {
                alert("oops, something went wrong!", error);
            });
    }
    
    prepararDados(dados) {

        this.labelData = {};
        this.dadosPh = {};
        this.dadosTurb = {};
        this.dadosTemp = {};
        this.dadosCond = {};
        this.dadosOD = {};
        this.dadosNivel = {};

        dados.forEach(element => {
            const dataFormatada = new Date(element.dataColeta).toISOString().split("T")[0];
            this.labelData[dataFormatada] = this.labelData[dataFormatada] + 1 || 1;
            this.dadosPh[dataFormatada] = element.parPh;
            this.dadosTurb[dataFormatada] = element.parTurb;
            this.dadosTemp[dataFormatada] = element.parTemp;
            this.dadosCond[dataFormatada] = element.parCond;
            this.dadosOD[dataFormatada] = element.parOD;
            this.dadosNivel[dataFormatada] = element.parNivelRio;
        });
    
      this.render(Object.keys(this.labelData),Object.values(this.dadosPh),Object.values(this.dadosTurb),Object.values(this.dadosTemp),
                  Object.values(this.dadosCond), Object.values(this.dadosOD), Object.values(this.dadosNivel) );


    }

    render(dados1, dados2, dados3, dados4, dados5, dados6, dados7) {
        this.chartPh.data.labels = dados1;
        this.chartPh.data.datasets[0].data = dados2;

        this.chartTurb.data.labels = dados1;
        this.chartTurb.data.datasets[0].data = dados3;

        this.chartTemp.data.labels = dados1;
        this.chartTemp.data.datasets[0].data = dados4;

        this.chartCond.data.labels = dados1;
        this.chartCond.data.datasets[0].data = dados5;

        this.chartOD.data.labels = dados1;
        this.chartOD.data.datasets[0].data = dados6;

        this.chartNivel.data.labels = dados1;
        this.chartNivel.data.datasets[0].data = dados7;

        //atualizar grafico
        this.chartPh.update();
        this.chartTurb.update();
        this.chartTemp.update();
        this.chartCond.update();
        this.chartOD.update();
        this.chartNivel.update();

    }

    criarChartPh() {
        return new Chart(this.chartPhElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'blue',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Valor de pH"
                },
                legend: {
                    display: false
                }
            }
        });

    }
    criarChartTurb() {
        return new Chart(this.chartTurbElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'gray',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Valor de Turbidez em NTU"
                },
                legend: {
                    display: false
                }
            }
        });

    }
    criarChartTemp() {
        return new Chart(this.chartTempElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'orange',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Temperatura em ºC"
                },
                legend: {
                    display: false
                }
            }
        });

    }
    criarChartOD() {
        return new Chart(this.chartODElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'green',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Concentração de OD em mg/L "
                },
                legend: {
                    display: false
                }
            }
        });

    }
    criarChartCond() {
        return new Chart(this.chartCondElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'black',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Valor de Condutividade mS/cm"
                },
                legend: {
                    display: false
                }
            }
        });

    }
    criarChartNivel() {
        return new Chart(this.chartNivelElement, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Valor",
                        data: [],
                        borderColor: 'brown',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                              //  beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Nível local em metros"
                },
                legend: {
                    display: false
                }
            }
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