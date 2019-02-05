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
        name: "Segundo Questionário",
        template: "step2.html"
      },   
      {
        step: 3,
        name: "Terceiro Questionário",
        template: "step3.html"
      }, 
      {
        step: 4,
        name: "Quarto Questionário",
        template: "step3.html"
      },    
      {
        step: 5,
        name: "Quarto Questionário",
        template: "step3.html"
      },      
    ];
    $scope.vm.user = {};
    
    //Functions
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