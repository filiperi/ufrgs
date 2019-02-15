// Simple AngularJS controller for text field validation example

angular.module('app', ['br.cidades.estados'])

  // only the one controller in this little example
  .controller('AppCtrl', function($scope, brCidadesEstados) {
      
    // Page data model, initially blank ('pristine') with our own status tracking
    $scope.model = { 
      novalidation: '',                 // text field without validation
      requiredmaxtwenty: '',            // text field, required, max 20 chars
      requiredimmediate: '',            // text field updates immediately
      formstatus: 'unsubmitted'         // status display
    };
      
    $scope.vm.selectedState = '';
    $scope.vm.selectedCity = '';
    $scope.vm.currentStep = 1;
    
    $scope.vm.steps = [
      {
        step: 1,
        name: "Apresentação",
        template: "step1.html"
      },
      {
        step: 2,
        name: "Caracterização",
        template: "step2.html"
      },   
      {
        step: 3,
        name: "Preferências",
        template: "step3.html"
      }, 
      {
        step: 4,
        name: "Produtos",
        template: "step4.html"
      },    
      {
        step: 5,
        name: "Quarto Questionário",
        template: "step3.html"
      },      
    ];
    
    //Cada item na variavel apresentação é um novo parágrafo.
    //A ordem do texto é a mesma inserida aqui
    $scope.vm.apresentacao = [
        {
            name: "Esta pesquisa trata de um novo sistema de secagem e armazenagem de grãos que evita o uso da lenha e do gás liquefeito de petróleo (GLP) para reduzir os desperdícios monetários para os agricultores e reduzir impactos ambientais. Ao responder essa pesquisa, você contribui com a criação de um conjunto de produtos e serviços com tecnologia de ponta desenvolvida pela Universidade Federal do Rio Grande do Sul – UFRGS."
        },
        {
            name: "O tempo de preenchimento é de aproximadamente 10 minutos. Os seus dados são confidenciais, permanecem em sigilo de pesquisa, não serão divulgados individualmente."
        },
        {
            name: "A UFRGS e seus pesquisadores agradecem sua contribuição.  Esta pesquisa tem o apoio do Canal Rural e foi enviada aos principais municípios e propriedades de agronegócio brasileiras."
        },
        {
            name: "Sua opinião irá contribuir com o desenvolvimento de uma agricultura sustentável. Ao final da pesquisa, se tiver interesse em receber o relatório do estudo sem custo, deixe seu e-mail."
        },
        {
            name: "Agradecemos sua Contribuição!"
        }
    ];
    
    
    $scope.vm.processos_secagem = 
    { 
          pergunta: "Qual a situação atual de seu processo de secagem?",
          selecionado: null,
          respostas: [
            {name: "Não possui silo e entrega a produção para cooperativas"},
            {name: "Não possui silo e entrega a produção para indústrias alimentícias"},
            {name: "Possui silo de secagem com ar natural"},
            {name: "Possui silo de secagem com GLP (Gás Liquefeito de Petróleo)"},
            {name: "Possui silo de secagem com lenha"},
        ]
    };
    
  $scope.vm.culturas = { 
          pergunta: "Quais tipos de cultura você trabalha?",
          hint: "Observação: Marcar as principais culturas, que geram maior renda",
          selecionado: null,
          respostas: [
            {name: "Arroz"},
            {name: "Aveia"},
            {name: "Cevada"},
            {name: "Feijão"},
            {name: "Girassol"},
            {name: "Milho"},
            {name: "Soja"},
            {name: "Sorgo"},
            {name: "Trigo"},
            {name: "Outros"}
        ]
    };
    
     $scope.vm.renda_bruta = { 
          pergunta: "Em relação a renda bruta agropecuária anual em qual dessas faixas você se classifica?",
          hint: "1 hectare é equivalente a 10.000 m² ou 1 alqueire é equivalente a 4,84 hectares",
          selecionado: null,
          respostas: [
            {name: "Pequeno produtor: até 20 hectares"},
            {name: "Médio produtor: superior a 20 hectares e até 100 hectares"},
            {name: "Grande produtor: superior a 100 hectares e até 500 hectares"},
            {name: "Super produtor: superior a 500 hectares"}
        ]
    };
    
    
    $scope.vm.produtos = { 
          qalternativas: "Dentre as alternativas de produto abaixo, qual você preferiria para o processo de secagem  de grãos?",
          introducao: {
                        titulo: "Preferências do silo de secagem e armazenagem de grãos",
                        paragrafos: [
                                      {texto: "Uma nova tecnologia foi desenvolvida para melhorar o processo de secagem e armazenagem de grãos, esta tecnologia se baseia em uma máquina de secagem que a partir de água e energia elétrica fornece calor para secar o grão. Esta solução visa entregar um sistema composto por produtos e serviços que forneçam a gestão da secagem e armazenagem de grãos, podendo ser adquirida nas modalidades compra e aluguel. Inicialmente, serão questionadas as possíveis configurações da máquina de secagem, as seguintes alternativas para configurar o produto são:"},
                                      {texto: "(A) Capacidade do Silo: Um ou Dois Silos de armazenagem com capacidades de secar 30 toneladas de grãos em 7 dias."},
                                      {texto: "(B) Funcionamento da máquina: O funcionamento da máquina pode ser controlado de forma manual (deverão ser contratados ao menos dois funcionários para a secagem ocorrer) ou automática (o proprietário pode controlar a máquina, sem necessidade de contratação)."},
                                      {texto: "(C) Movimentação do Silo: O silo pode ser fixo (devendo estar fixo na propriedade) ou transportável (o silo demanda de um local plano para o funcionamento, sendo possível deixa-lo na lavoura)."},
                                      {texto: "(D) Controle da Emissão de CO2: A máquina de secagem pode ter ou não um mecanismo que quantifique o gás carbônico (CO2) emitido, com esse controle, o agricultor pode vender os créditos de carbono (moedas verdes), tendo retorno financeiro."},
                                      {texto: "Considerando as possibilidades abaixo, julgue nas próximas etapas, qual produto, satisfaz suas necessidades"}
                                    ]
                          },
          bloco1: {
                    produtos:[
                    {
                        nome:"Produto 1",
                        uri:"img/prod1.png"
                    },
                    {
                        nome:"Produto 2",
                        uri:"img/prod2.png"
                    },
                    {
                        nome:"Produto 3",
                        uri:"img/prod3.png"
                    },
                    {
                        nome:"Produto 4",
                        uri:"img/prod4.png"
                    }],
                  }                       
    };
    
    
    
    
    
    $scope.vm.user = {};
    
    //****************************************************************************************************************************************//
    //Functions
    
    $scope.setSelecionado = function(object, value) {
        object.selecionado = value;
    };
    
    
    $scope.vm.gotoStep = function(newStep) {
      $scope.vm.currentStep = newStep;
    }
    
    $scope.vm.getStepTemplate = function(){
      for (var i = 0; i < $scope.vm.steps.length; i++) {
            if ($scope.vm.currentStep == $scope.vm.steps[i].step) {
                return $scope.vm.steps[i].template;
            }
        }
    }
    
    $scope.vm.save = function() {
      alert(
        "Saving form... \n\n" + 
        "Name: " + $scope.vm.user.name + "\n" + 
        "Email: " + $scope.vm.user.email + "\n" + 
        "Age: " + $scope.vm.user.age);
    }  
      
      
    $scope.estados = brCidadesEstados.estados;

    $scope.buscarCidadesPorSigla = function(){
      $scope.cidades = brCidadesEstados.buscarCidadesPorSigla($scope.vm.selectedState.sigla);
    }
    
    // Declare a reference to the form, which will be 'form.test' on the page
    $scope.form = { };
    
    // We don't actually submit this form anywhere, we just test validity
    // and report back.
    $scope.submitForm = function() {
      if ($scope.form.test.$valid) {
        $scope.model.formstatus = "valid";    // that was a happy form  
      } else {
        $scope.model.formstatus = "invalid";  // sad trombone
      }
    };
    
    // Form clear function
    $scope.clearForm = function() {
      // clear the fields
      $scope.vm.selectedState = '';
      $scope.vm.selectedCity = '';
      
      $scope.model.novalidation = '';
      $scope.model.requiredmaxtwenty = '';
      $scope.model.requiredimmediate = '';
      // reset our internal state
      $scope.model.formstatus = 'unsubmitted';
      // reset the field validation for the form
      $scope.form.test.$setPristine();
    };
}
);