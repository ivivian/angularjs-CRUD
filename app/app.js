/*
 * This source code is licensed under the Apache License 2.0!
 * @author ivivian <669775@gmail.com>
 * version: 1.0
 * https://github.com/ivivian/angularjs-CRUD
 */

var app = angular.module('myApp', ['ngRoute']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/api.php'
    var obj = {};
    obj.getCustomers = function(){
		//Because IIS does not support .htaccess, Modify api URL
        return $http.get(serviceBase + '?ffunc=customers');
    }
    obj.getCustomer = function(customerID){
        return $http.get(serviceBase + '?ffunc=customer&id=' + customerID);
    }

    obj.insertCustomer = function (customer) {
    return $http.post(serviceBase + '?ffunc=insertCustomer', customer).then(function (results) {
		console.log(serviceBase + '?ffunc=insertCustomer');
        return results;
    });
	};

	obj.updateCustomer = function (id,customer) {

	    return $http.post(serviceBase + '?ffunc=updateCustomer', {id:id, customer:customer}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteCustomer = function (customerID) {
	    return $http.get(serviceBase + '?ffunc=deleteCustomer&id=' + customerID).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
    services.getCustomers().then(function(data){
	
	//修改转显示换分类名字而不是内码
	angular.forEach(data.data, function(dataitem){
		if(dataitem.ftype=="1")
			dataitem.ftype="Logistics";
		else
			dataitem.ftype="Brands";
	});

     $scope.customers = data.data;
    });
});

app.controller('editCtrl', function ($http,$scope, $rootScope, $location, $routeParams, services, customer) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    $rootScope.title = (customerID > 0) ? 'Edit' : 'Add';
    $scope.buttonText = (customerID > 0) ? 'Update' : 'Add Save';
      var original = customer.data;
      original._id = customerID;
      $scope.customer = angular.copy(original);
      $scope.customer._id = customerID;
	  /**** 类型 ****/
      $scope.roles = [
        {"name" : "Logistics", "id" : 1},
        {"name" : "Brands", "id" : 2},
      ];
	  	  
      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete number: "+$scope.customer._id)==true)
        	services.deleteCustomer(customerID).then(
					function(){$location.path('/');}			
					);
      };

      $scope.saveCustomer = function(customer) {
        
        if (customerID <= 0) {
			//With the update operation modifies
            services.insertCustomer(customer).then(
					function(){$location.path('/');}			
					);
        }
        else {
			//Save and then wait for the end of the steering update the display list, solve new updated data asynchronously to save time and sometimes there is no time list page display problems
			services.updateCustomer(customerID, customer).then(
				function(){$location.path('/');}
				);
			//Processing Method Two
			//$http.post('services/api.php?ffunc=updateCustomer', {id:customerID, customer:customer}).then(function (status) {
			//	$location.path('/');
			//});			
		}


		
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Customers',
        templateUrl: 'partials/customers.html',
        controller: 'listCtrl'
      })
      .when('/edit-customer/:customerID', {
        title: 'Edit Customers',
        templateUrl: 'partials/edit-customer.html',
        controller: 'editCtrl',
        resolve: {
          customer: function(services, $route){
            var customerID = $route.current.params.customerID;
            return services.getCustomer(customerID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);