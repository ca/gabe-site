var app = angular.module('HomeModule', []);


app.controller('HomeController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.newProject = {'title':'', 'profile':{'name':'', 'email':'', 'password':''}};
	$scope.loading = false;
	$scope.showLogin = false;

    $scope.init = function() {
    	var requestInfo = parseLocation('');
    	if (requestInfo.params.hasOwnProperty('login')){
    		var login = requestInfo.params['login'];
    		$scope.showLogin = (login=='yes') ? true : false;
    	}
    	
    	console.log('HomeController: INIT'+JSON.stringify(requestInfo));
    	fetchAccount();
    }
    
    function fetchAccount(){
    	var url = '/api/account';
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            if (results.hasOwnProperty('profile'))
                $scope.profile = results['profile'];
            
        	console.log('ACCOUNT: '+JSON.stringify(results));
            if (results['confirmation'] != 'success')
                return;
            
        	$scope.profile = results['profile'];
        	fetchAccountProjects();

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchAccountProjects(){
    	var url = '/api/projects?email='+$scope.profile.email;
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            console.log(JSON.stringify(results));
            
            if (results.hasOwnProperty('profile'))
                $scope.profile = results['profile'];
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.profile.projects = results['projects'];

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    	
    }

    
    $scope.login = function(){
    	console.log('login');
    	
    	if ($scope.newProject.profile.email.length==0){
    		alert('Please enter your email.');
    		return;
    	}
    	
    	if ($scope.newProject.profile.password.length==0){
    		alert('Please enter your password.');
    		return;
    	}
    	
    	
    	$scope.loading = true;
        var json = JSON.stringify($scope.newProject.profile);
        console.log('LOGIN: '+json);

    	var url = '/api/login';
        $http.post(url, json).success(function(data, status, headers, config) {
            var results = data['results'];
        	console.log('RESPONSE: '+JSON.stringify(results));
            if (results['confirmation'] != 'success'){
            	$scope.loading = false;
                alert('LOGIN FAILED: '+results['message']);
                return;
            }
            
        	var profile = results['profile'];
        	window.location.href = "/site/account"; // similar behavior as clicking on a link

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.submitProject = function(){
    	console.log('SUBMIT PROJECT');
    	if ($scope.newProject.title.length==0){
    		document.getElementById('title').style.borderColor = "red";
    		return;
    	}
    	
    	if ($scope.newProject.profile.email.length==0){
    		document.getElementById('email').style.borderColor = "red";
    		return;
    	}
    	
    	if ($scope.newProject.profile.password.length==0){
    		document.getElementById('password').style.borderColor = "red";
    		return;
    	}
    	
    	var emails = new Array();
    	emails.push($scope.newProject.profile.email);
    	$scope.newProject['emails'] = emails;

    	var json = JSON.stringify($scope.newProject);
    	console.log('Register: '+json);
    	
    	$scope.loading = true;
    	var url = '/api/projects';
        $http.post(url, json).success(function(data, status, headers, config) {
        	$scope.loading = false;
            var results = data['results'];
        	console.log('PROJECT: '+JSON.stringify(results));
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
        	var project = results['project'];
        	window.location.href = "/site/project/"+project.id; // similar behavior as clicking on a link

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.validateField = function(property){
    	console.log('validate Field: '+property);
		var field = document.getElementById(property);
    	
		if (property=='title'){
	    	if ($scope.newProject[property]==null){
	    		field.style.borderColor = "red";
	    		return;
	    	}
		}
		else{
	    	if ($scope.newProject.profile[property].length == 0){
	    		field.style.borderColor = "red";
	    		return;
	    	}
		}
    	
    	
    	field.style.borderColor = "#ddd";

    }
    
    
    $scope.toggle = function(){
    	$scope.showLogin = !$scope.showLogin;
    	
    	var fields = ['title', 'email', 'password'];
    	for (var i=0; i<fields.length; i++)
    		document.getElementById(fields[i]).style.borderColor = "#ddd";
    }
    
    
    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function parseLocation(stem){
    	console.log('PARSE LOCATION: '+stem);
    	var resourcePath = location.href.replace(window.location.origin, ''); // strip out the domain root (e.g. http://localhost:8888)

    	var parts = resourcePath.split(stem+'/');
    	var requestInfo = {"resource":null, "identifier":null, 'params':{}};
    	if (parts.length > 1){
    		var hierarchy = parts[1].split('/');
    		for (var i=0; i<hierarchy.length; i++){
    			if (i==0){
    				var parts = hierarchy[i].split('?');
    				requestInfo['resource'] = parts[0];
    				if (parts.length > 1){ // params
    					for (var j=0; j<parts.length; j++){
    						var a = parts[j];
    						var b = a.split('=');
    						if (b.length>1){
    							requestInfo.params[b[0]] = b[1];
    						}
    					}
    				}
    			}

    			if (i==1) {
    			    requestInfo['identifier'] = hierarchy[i].split('?')[0];
    			}
    		}
    	}

    	return requestInfo;
    }




}]);


