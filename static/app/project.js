var app = angular.module('ProjectModule', ['angularFileUpload']);


app.controller('ProjectController', ['$scope', '$http', '$upload', function($scope, $http, $upload){
	$scope.project = null;
	$scope.loading = false;

    $scope.init = function() {
    	var requestInfo = parseLocation('site');
    	console.log('ProjectController: INIT'+JSON.stringify(requestInfo));
    	
    	if (requestInfo.identifier==null)
    		return;
    	
    	fetchProject(requestInfo.identifier);
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


