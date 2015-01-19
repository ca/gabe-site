var app = angular.module('AccountModule', ['angularFileUpload']);


app.controller('AccountController', ['$scope', '$http', '$upload', function($scope, $http, $upload){
	$scope.profile = null;
	$scope.passwordInfo = {'currentPassword':'', 'newPassword':''};
	$scope.loading = false;

    $scope.init = function() {
    	console.log('AccountController: INIT');
    	fetchAccount();
    }

    function fetchAccount(){
    	$scope.loading = true;
    	
    	var url = '/api/account';
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            if (results.hasOwnProperty('profile')){
                $scope.profile = results['profile'];
            }
            else{ // user not logged in - route to home page
//            	window.location.href = "/radius";
//            	return;
            }
            
            
        	console.log('ACCOUNT: '+JSON.stringify(results));
            if (results['confirmation'] != 'success'){
            	$scope.loading = false;
                alert(results['message']);
                return;
            }

        	$scope.profile = results['profile'];
        	fetchAccountProjects();

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    function fetchAccountProjects(){
    	var url = '/api/projects?email='+$scope.profile.email;
    	$scope.loading = true;
        $http.get(url).success(function(data, status, headers, config) {
        	$scope.loading = false;
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

    
    function fetchProject(projectId){
//    	console.log('FETCH PROJECT: '+projectId);
    	
    	var url = '/api/projects/'+projectId;
    	$scope.loading = true;
        $http.get(url).success(function(data, status, headers, config) {
        	$scope.loading = false;
            var results = data['results'];
            console.log(JSON.stringify(results));
            
            if (results.hasOwnProperty('profile'))
                $scope.profile = results['profile'];
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.project = results['project'];

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.updateProfile = function(){
    	var json = JSON.stringify($scope.profile);

    	var url = '/api/profiles/'+$scope.profile.id;
    	$scope.loading = true;
        $http.put(url, json).success(function(data, status, headers, config) {
        	$scope.loading = false;
            var results = data['results'];
            console.log(JSON.stringify(results));
            
            if (results.hasOwnProperty('profile')){
            	var projects = null;
            	if ($scope.profile.projects != null)
            		projects = $scope.profile.projects;
            	
                $scope.profile = results['profile'];
                
                if (projects != null)
                	$scope.profile.projects = projects;
            }
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
            alert('Profile Successfully Updated');

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.changePassword = function(){
    	if ($scope.passwordInfo.currentPassword.length==0){
    		alert('Please Enter Your Current Password');
    		return;
    	}

    	if ($scope.passwordInfo.newPassword.length==0){
    		alert('Please Enter Your New Password');
    		return;
    	}

    	var pkg = {'action':'password', 'current password':$scope.passwordInfo.currentPassword, 'new password':$scope.passwordInfo.newPassword};
    	var json = JSON.stringify(pkg);

    	var url = '/api/profiles/'+$scope.profile.id;
    	$scope.loading = true;
        $http.put(url, json).success(function(data, status, headers, config) {
        	$scope.loading = false;
            var results = data['results'];
            console.log(JSON.stringify(results));
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
        	$scope.passwordInfo = {'currentPassword':'', 'newPassword':''};
            alert('Password Changed');

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.updateProject = function(){
    	var json = JSON.stringify($scope.project);
    	
    	for (var i=0; i<$scope.project.team.length; i++){
    		var member = $scope.project.team[i];
    		if (member.email==null)
    			continue;
    		
    		if ($scope.project.emails.indexOf(member.email) > -1)
    			continue;
    		
    		$scope.project.emails.push(member.email);
    	}
    	
    	
    	var url = '/api/projects/'+$scope.project.id;
    	$scope.loading = true;
        $http.put(url, json).success(function(data, status, headers, config) {
        	$scope.loading = false;
            var results = data['results'];
            console.log(JSON.stringify(results));
            
            if (results.hasOwnProperty('profile'))
                $scope.profile = results['profile'];
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.project = results['project'];

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.addTeamMember = function(){
    	$scope.project.team.push({'name':'', 'email':'', 'background':''});
    	
    }
    
    $scope.removeTeamMember = function(index){
    	var updatedTeam = new Array();
    	for (var i=0; i<$scope.project.team.length; i++){
    		if (i==index)
    			continue;
    		
    		updatedTeam.push($scope.project.team[i]);
    	}
    	
    	$scope.project.team = updatedTeam;
    	
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
    			}

    			if (i==1) 
    			    requestInfo['identifier'] = hierarchy[i].split('?')[0];
    			
    		}
    	}
    	
    	var p = resourcePath.split('?');
    	if (p.length==0)
    		return requestInfo;
    	
    	
		for (var j=0; j<p.length; j++){
			var a = p[j];
			var b = a.split('=');
			if (b.length>1)
				requestInfo.params[b[0]] = b[1];
		}


    	return requestInfo;
    }




}]);


