// Simple AngularJS controller for text field validation example

angular.module('app', ['br.cidades.estados','firebase', 'checklist-model'])

  // only the one controller in this little example
  .controller('AppCtrl', function($scope, $window, $parse, brCidadesEstados, $firebaseArray) {
      
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
        name: "Produtos Adicionais",
        template: "step5.html"
      },      
	  {
        step: 6,
        name: "Escolha final",
        template: "step6.html"
      },  
	  {
		step: 7,
		name: "Finalização",
		template: "step7.html"
	  } 
    ];
    
    //Cada item na variavel apresentação é um novo parágrafo.
    //A ordem do texto é a mesma inserida aqui
    $scope.vm.apresentacao = [
        {
            name: "Esta pesquisa trata de um novo Sistema de secagem e armazenagem de grãos. Este Sistema evita o uso da lenha e do gás liquefeito de petróleo (GLP) para reduzir custos e impactos ambientais. Ao responder essa pesquisa, você contribui com a criação de um conjunto de produtos e serviços com tecnologia de ponta desenvolvida pela Universidade Federal do Rio Grande do Sul – UFRGS."
        },
        {
            name: "O tempo de preenchimento é de aproximadamente 10 minutos. Os seus dados são confidenciais, sigilosos e não serão divulgados individualmente."
        },
        {
            name: "A UFRGS e seus pesquisadores agradecem sua contribuição. Esta pesquisa tem o apoio do Canal Rural e foi enviada às principais propriedades do Agronegócio Brasileiro."
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
            {index: 0, name: "Não possui silo e entrega a produção para cooperativas"},
            {index: 1, name: "Não possui silo e entrega a produção para indústrias alimentícias"},
            {index: 2, name: "Possui silo de secagem com ar natural"},
            {index: 3, name: "Possui silo de secagem com GLP (Gás Liquefeito de Petróleo)"},
            {index: 4, name: "Possui silo de secagem com lenha"},
        ]
    };
    
  $scope.vm.culturas = { 
          pergunta: "Quais tipos de cultura você trabalha?",
          hint: "Observação: Marcar as principais culturas, que geram maior renda",
          selecionado: [],
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
            {index: 0, name: "Pequeno produtor: até 20 hectares"},
            {index: 1, name: "Médio produtor: superior a 20 hectares e até 100 hectares"},
            {index: 2, name: "Grande produtor: superior a 100 hectares e até 500 hectares"},
            {index: 3, name: "Super produtor: superior a 500 hectares"}
        ]
    };
	
    $scope.vm.resultado = {"produto_escolhido": null, "tipo_compra": null, "unico_silo": true};
    $scope.vm.erros = {"campo_requerido": "*Campo deve ser preenchido.", "produto_requerido": "Você deve selecionar as opções e selecionar um produto final."};
    $scope.vm.produtos = { 
          qalternativas: "Em relação à este cenário, qual dos quatro produtos você preferiria para o processo de secagem e armazenagem de grãos?",
          selecionados:  {"current":1, "bloco1": null, "bloco2": null, "bloco3":null, "bloco4":null, "escolha_usuario":null},
          introducao: {
                        titulo: "Preferências do silo de secagem e armazenagem de grãos",
                        paragrafos: [{texto: "Uma nova tecnologia está sendo desenvolvida para melhorar o processo de secagem e armazenagem de grãos. Esta tecnologia se baseia em uma máquina de secagem que a partir da água e da energia elétrica fornece calor para secar o grão. Esta solução visa entregar um sistema composto por produtos e serviços que forneçam a gestão parcial ou integral para a secagem e a armazenagem de grãos, podendo ser adquirida nas modalidades compra ou aluguel. Inicialmente, serão apresentadas 16 possibilidades de Produtos em 4 blocos. As possíveis configurações da máquina de secagem, são apresentadas a seguir:"}]
                        },
          combinacao : [{texto: "Nesta seção, quatro produtos escolhidos anteriormente são apresentados, dentre essas, qual é a sua preferida?"}],
		  adicionais : {texto: "Para o produto que você escolheu, se fosse adquiri-lo, qual a melhor modalidade de aquisição?", opcoes: [{texto:"Compra"},{texto: "Aluguel mensal"}]},
		  escolha_final : {titulo:"Escolha final", selecionado: null,  paragrafos: [{texto:"Você optou pelo(a) {0} do produto {1} por R$ {2} com itens adicionais no valor total de R$ {3} (Manutenção: R$ {6}, Relatórios: R$ {7} e Energia: R$ {8})"}, {texto: "Com R$ {4} por mês você poderia {5} esse mesmo produto com os mesmos itens adicionais. Sabendo disso, você manteria a opção de {0}?"}]},
		  calculadora: {titulo:"Até quanto pagaria para ter um serviço adicional? (deslize a régua para definir o valor)"},
		  interesse: [
		  {value:0,min:0,max:1600,texto:"Para obter: Manutenção (Valores por mês)",opcoes: [{texto:"Sem manutenção"},{texto:"Manutenção Corretiva"},{texto:"Manutenção Corretiva e Preventiva"}]},
		  {value:0,min:0,max:2500,texto:"Para obter: Geração de relatórios da situação atual dos grãos secos e armazenados no(s) silo(s)",opcoes: [{texto:"Sem relatório"},{texto:"Relatório de Secagem – umidade, temperatura: máquina e secagem, energia e controle da emissão de CO2"},{texto:"Relatório de Secagem e Armazenagem – umidade, temperatura da máquina e secagem, energia e controle da emissão de CO2, análise do grão: temperatura, presença de fungos e micotoxinas"}]},
		  {value:0,min:0,max:500,texto:"Para obter: Tipo de Energia para o funcionamento do silo",opcoes: [{texto:"Energia elétrica"},{texto:"Painel solar em metade da parte superior do silo: Propicia redução parcial no consumo de Energia Elétrica"},{texto:"Painel solar em toda a parte superior do silo: Propicia redução total no consumo de Energia Elétrica"}]},
		  {value:0,min:0,max:1000,texto:"Tipo de Energia para o funcionamento do silo",opcoes: [{texto:"Energia elétrica"},{texto:"Painel solar em toda a parte superior de 1 silo: Propicia redução parcial no consumo de Energia Elétrica"},{texto:"Painel solar em toda a parte superior de 2 silos: Propicia redução total no consumo de Energia Elétrica"}]}
		 ],
		  caracterizacao : { 
				genero: {opcoes: ["Masculino", "Feminino"], selecionado: null}, 
				idade: {selecionado: null},
				decisoes: [
							{texto: "Sou propenso a riscos", selecionado: null},
							{texto: "Tomo decisões rápidas", selecionado: null},
							{texto: "Compro apenas o que preciso", selecionado: null},
							{texto: "Gosto de comprar novidades", selecionado: null},
							{texto: "Gosto de ouvir a opinião dos outros antes de decidir", selecionado: null},
							{texto: "Faço compras considerando o impacto ambiental dos produtos", selecionado: null},
							],
				aquisicao : {respostas: ["Decido considerando o que vejo, cheiro, sinto nas mãos",
							"Decido baseado em minhas emoções, meu coração",
							"Decido considerando argumentos lógicos",
							"Decido considerando minha intuição"], selecionado: null},
				sustentabilidade: [
							{texto: "Possuo um estilo de vida saudável e acredito que a saúde e a sustentabilidade estão associadas.", selecionado: null},
							{texto: "Sinto-me pressionado pela sociedade para adotar um comportamento positivo em relação ao meio ambiente e por isso o faço", selecionado: null},
							{texto: "Preocupo-me com o meio ambiente e com os efeitos negativos causados pela ação humana", selecionado: null},
							{texto: "A informação e o conhecimento sobre sustentabilidade e produtos ecológicos me influenciam positivamente nas decisões referentes a lavoura", selecionado: null},
							{texto: "A busca pela redução de resíduos me influencia a adotar um posicionamento favorável do meio ambiente nas decisões da lavoura", selecionado: null}],
		  },
          items: [
                    { id: 1, nome:"Produto 1", uri:"img/prod1.png", bloco:1, aluguel:7650, compra:90000},
                    { id: 2, nome:"Produto 2", uri:"img/prod2.png", bloco:1, aluguel:7300, compra:89000},
                    { id: 3, nome:"Produto 3", uri:"img/prod3.png", bloco:1, aluguel:6500, compra:81000},
                    { id: 4, nome:"Produto 4",  uri:"img/prod4.png", bloco:1, aluguel:6750, compra:82000},
                    { id: 5, nome:"Produto 5",  uri:"img/prod5.png", bloco:2, aluguel:6250, compra:79000},
                    { id: 6, nome:"Produto 6",  uri:"img/prod6.png", bloco:2, aluguel:6850, compra:84000},
                    { id: 7, nome:"Produto 7",  uri:"img/prod7.png", bloco:2, aluguel:6200, compra:77000},
                    { id: 8, nome:"Produto 8",  uri:"img/prod8.png", bloco:2, aluguel:6400, compra:80000},
                    { id: 9, nome:"Produto 9",  uri:"img/prod9.png", bloco:3, aluguel:7500, compra:95000},
                    { id: 10, nome:"Produto 10",  uri:"img/prod10.png", bloco:3, aluguel:6600, compra:83000},
                    { id: 11, nome:"Produto 11",  uri:"img/prod11.png", bloco:3, aluguel:7700, compra:92000},
                    { id: 12, nome:"Produto 12",  uri:"img/prod12.png", bloco:3, aluguel:6100, compra:76000},
                    { id: 13, nome:"Produto 13",  uri:"img/prod13.png", bloco:4, aluguel:6300, compra:78000},
                    { id: 14, nome:"Produto 14",  uri:"img/prod14.png", bloco:4, aluguel:7900, compra:96000},
                    { id: 15, nome:"Produto 15",  uri:"img/prod15.png", bloco:4, aluguel:6000, compra:75000},
                    { id: 16, nome:"Produto 16",  uri:"img/prod16.png", bloco:4, aluguel:8000, compra:100000},
                  ]                       
    };
    
    
    
    $scope.vm.user = {};
	    
    //****************************************************************************************************************************************//
    //Functions
    
    $scope.setSelecionado = function(object, value) {
        object.selecionado = value;
    };
    
    
    $scope.vm.gotoStep = function(newStep) {
	  if ($scope.vm.validateStep(newStep -1)){
			$scope.vm.currentStep = newStep;
	  }
    }
	
	$scope.validationOn = false;
	
	$scope.vm.validateStep = function(step) {
		$scope.validationOn = true;
		/*
		if (step >= 2 && step <4) {
			if ($scope.vm.renda_bruta.selecionado == null || $scope.vm.processos_secagem.selecionado == null || $scope.vm.selectedState == null || $scope.vm.selectedState == '' || $scope.vm.selectedCity == null || $scope.vm.selectedCity == ''){
				return false;
			}
		} else if (step >= 4 && step <= 6) {
			if ($scope.vm.resultado.produto_escolhido == null){
				return false;
			}
		} else if (step >= 7) {
		
		}*/
		
		
		$scope.validationOn = false;
		return true;
	}
	
    
    $scope.vm.getStepTemplate = function(){
      for (var i = 0; i < $scope.vm.steps.length; i++) {
            if ($scope.vm.currentStep == $scope.vm.steps[i].step) {
                return $scope.vm.steps[i].template;
            }
        }
    }
    
    $scope.vm.save = function() {
		var culturas = [];
		
		angular.forEach($scope.vm.culturas.respostas.selecionado, function(item){
			culturas.push(item.name);
        });
			  
		var result = 
			 {
				 "cidade": $scope.vm.selectedCity,
				 "estado": $scope.vm.selectedState.sigla,
				 "ct": culturas,
				 "rb":$scope.vm.renda_bruta.selecionado, //renda bruta
				 "tc":$scope.vm.resultado.tipo_compra, //tipo de compra
				 "ps":$scope.vm.processos_secagem.selecionado,//processo secagem
				 "vm": $scope.vm.produtos.interesse[0].value, //valor manutencao
				 "vr": $scope.vm.produtos.interesse[1].value, // valor relatorio
				 "ve": $scope.vm.produtos.interesse[3].value, // valor energia
				 "vp": $scope.vm.sum(),
				 "pe": $scope.vm.resultado.produto_escolhido.id,
				 "ef": $scope.vm.produtos.escolha_final.selecionado,
				 "genero": $scope.vm.produtos.caracterizacao.genero.selecionado,
				 "idade" : $scope.vm.produtos.caracterizacao.idade.selecionado,
				 "decisoes": $scope.vm.produtos.caracterizacao.decisoes,
				 "aquisicao" : $scope.vm.produtos.caracterizacao.aquisicao.selecionado,
				 "sustentabilidade": $scope.vm.produtos.caracterizacao.sustentabilidade
			 };
	
		json = JSON.stringify(result);
	
		var ref = firebase.database().ref();
		
 		// download the data into a local object
		var array = $firebaseArray(ref);
		array.$add(json);
	}  
	
	$scope.refresh = function () {
		$window.location.reload();
	}
      
    $scope.selecionarProduto = function (index, bloco) {
        index++;
        escolhaUsuario = $window.confirm('Você escolheu o produto ' + index + ', deseja continuar?');
        
        if(escolhaUsuario){
            var bloco_str = 'vm.produtos.selecionados.bloco' + bloco;
            $parse(bloco_str).assign($scope, index);
            $scope.vm.produtos.selecionados.current = bloco + 1;
        }        
    }
	
	
	$scope.selecionarProdutoFinal = function (selecionado, bloco) {
        escolhaUsuario = $window.confirm('Você escolheu o produto ' + selecionado + ', deseja continuar?');
        
        if(escolhaUsuario){
			$scope.vm.resultado.produto_escolhido = $scope.vm.produtos.items.find(x => x.id === selecionado);
			$scope.vm.resultado.unico_silo = $scope.vm.checkRange500();
			$scope.vm.currentStep = 5;
        }        
    }
	
	$scope.vm.sum = function (){ 
		if ($scope.vm.resultado.produto_escolhido != null) {
			
			var valueRetAluguel = ($scope.vm.resultado.produto_escolhido.aluguel - 0) + ($scope.vm.produtos.interesse[0].value - 0) + ($scope.vm.produtos.interesse[1].value - 0) + ($scope.vm.produtos.interesse[2].value - 0) + ($scope.vm.produtos.interesse[3].value - 0);
					
			var valueRetCompra =  ($scope.vm.resultado.produto_escolhido.compra-0) + ($scope.vm.produtos.interesse[0].value-0) + ( $scope.vm.produtos.interesse[1].value-0) + ($scope.vm.produtos.interesse[2].value - 0) + ($scope.vm.produtos.interesse[3].value - 0);
			
			if ($scope.vm.resultado.tipo_compra === 'Aluguel mensal'){
				return valueRetAluguel;
			}
			return valueRetCompra;
		}
		return 0;
	}
	
	$scope.vm.sumAdicional = function (){ 
		if ($scope.vm.resultado.produto_escolhido != null) {
		
			var total = ($scope.vm.produtos.interesse[0].value - 0) + ($scope.vm.produtos.interesse[1].value - 0) + ($scope.vm.produtos.interesse[2].value - 0) + ($scope.vm.produtos.interesse[3].value - 0);
			
			return total;
		}
		return 0;
	}
	
	$scope.vm.checkRange500 = function(){
		var produtosNoRange500 = [1, 2, 6, 7, 10, 12, 13, 15];
		var isInRange = false;
		
		for (i = 0; i < produtosNoRange500.length; i++) {
			if ($scope.vm.resultado.produto_escolhido.id === produtosNoRange500[i]){
				isInRange = true;
				break;
			}
		}
		return isInRange;
	}
	
    $scope.estados = brCidadesEstados.estados;

    $scope.buscarCidadesPorSigla = function() {
		if ($scope.vm.selectedState != null) {
			$scope.cidades = brCidadesEstados.buscarCidadesPorSigla($scope.vm.selectedState.sigla);
		}
    }
	
	
	$scope.format = function () {
	  // The string containing the format items (e.g. "{0}")
	  // will and always has to be the first argument.
	  var theString = arguments[0];

	  // start with the second argument (i = 1)
	  for (var i = 1; i < arguments.length; i++) {
		  // "gm" = RegEx options for Global search (more than one instance)
		  // and for Multiline search
		  var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
		  theString = theString.replace(regEx, arguments[i]);
	  }

	  return theString;
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