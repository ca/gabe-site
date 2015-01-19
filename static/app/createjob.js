var app = angular.module('CreateJobModule', ['ngSanitize', 'angularFileUpload']);


app.controller('CreateJobController', ['$scope', '$http', '$upload', function($scope, $http, $upload){
	$scope.profile = null;
	$scope.newListing = {'title':'', 'state':'al', 'type':'pt', 'image':'fEuLdSQw', 'icon':'nXYGHqO6w'};
	$scope.listings = null;
	$scope.selectedListing = null;
	$scope.city = null;
	$scope.state = null;
	$scope.loading = false;

    $scope.init = function() {
    	console.log('CreateJobsController: INIT');
		var menuRight = document.getElementById( 'cbp-spmenu-s2' );
    	classie.toggle( menuRight, 'cbp-spmenu-open' );
    }
    
    $scope.selectLocation = function(location){
    	console.log('selectLocation: '+location);
    	
    	fetchRadiusAccount(location);
    }
    
    $scope.updateListings = function(){
    	fetchListings();
    }
    
    $scope.searchMap = function(){
    	var ctrCoordinates = map.getCenter();
    	console.log('SEARCH MAP: lat=='+ctrCoordinates.k+', lng=='+ctrCoordinates.B);
    	
    	var latLng = ctrCoordinates.k+','+ctrCoordinates.B;
    	var url = '/api/listings?coordinates='+latLng;
    	
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
            
        	var find = '\n';
        	var re = new RegExp(find, 'g');

            $scope.listings = results['listings'];
            for (var i=0; i<$scope.listings.length; i++){
            	var listing = $scope.listings[i];
            	listing.description = listing.description.replace(re, '<br />');
            }
            
            
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    	
    }
    
    function fetchListings(){
    	var locations = $scope.city+','+$scope.state;
    	locations = locations.replace(' ', '+');
    	$scope.loading = true;
    	
    	var url = '/api/listings?locations='+locations;
//    	var url = 'https://www.mercurymq.com/api/listings?locations='+locations; // TESTING!

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
            
        	var find = '\n';
        	var re = new RegExp(find, 'g');

            $scope.listings = results['listings'];
            for (var i=0; i<$scope.listings.length; i++){
            	var listing = $scope.listings[i];
            	listing.description = listing.description.replace(re, '<br />');
            }
            
            
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.addNewListing = function() {
        
        if ($scope.newListing.title.length==0){
        	alert('Please Enter a Valid Title');
        	return;
        }

        $scope.loading = true;
        var keywordsArray = new Array();
        var a = $scope.newListing.keywordsString.split(",");
        for (var i=0; i<a.length; i++){
        	var keyword = a[i].trim();
        	if (a.length > 0)
        		keywordsArray.push(keyword);
        }
        
        
        $scope.newListing['keywords'] = keywordsArray;

        var url = '/api/listings';
        var json = JSON.stringify($scope.newListing);
        $http.post(url, json).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation!='success'){
                $scope.loading = false;
                alert(results['message']);
            	return;
            }
            
        	var newListing = results['listing'];
        	
        	console.log('NEW LISTING: '+JSON.stringify(newListing));
        	var location = newListing.city+','+newListing.state;
        	location = location.replace(' ', '+');
//        	window.location.href = '/radius/jobs?locations='+location;

            setTimeout(redirect('/radius/jobs?locations='+location), 3000);
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    function redirect(url){
    	window.location.href = url;
    }

    
    $scope.toggleJobDetails = function(index){
    	console.log('Toggle Job Details: '+index);
    	$scope.selectedListing = $scope.listings[index];
    	
    	
		var menuRight = document.getElementById( 'cbp-spmenu-s2' );
    	classie.toggle( menuRight, 'cbp-spmenu-open' );
    }
    
    
    
    $scope.locationString = function(string) {
  	  var parts = string.split(' ');
	  if (parts.length==1) // only one word,
	        return string.charAt(0).toUpperCase() + string.slice(1);
	  
	  var formattedString = '';
	  for (var i=0; i<parts.length; i++){
		  var word = parts[i];
		  word = word.charAt(0).toUpperCase() + word.slice(1);
		  formattedString = formattedString+' '+word;
	  }
	  
	  formattedString = formattedString.trim();
	  parts = formattedString.split(',');
	  if (parts.length==1)
		  return formattedString;
	  
	  formattedString = parts[0]+', '+parts[1].toUpperCase();
	  return formattedString;
    }
    
    
    
    
    $scope.capitalizedString = function(string) {
    	  var parts = string.split(' ');
    	  if (parts.length==1) // only one word,
    	        return string.charAt(0).toUpperCase() + string.slice(1);
    	  
    	  
    	  var formattedString = '';
    	  for (var i=0; i<parts.length; i++){
    		  var word = parts[i];
    		  word = word.charAt(0).toUpperCase() + word.slice(1);
    		  formattedString = formattedString+' '+word;
    	  }
    	  
    	  return formattedString.trim();
    }
    
    
    $scope.formattedDate = function(dateStr) {
    	var date = moment(new Date(dateStr)).format('MMM D, YYYY');
    	return date;
    }
    
	$scope.onFileSelect = function($files, property) {
    	console.log('SELECT IMAGE: ');
    	
        var url = '/api/upload';
        $scope.loading = true;
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            if (results['confirmation'] != 'success'){
            	alert(results['message']);
            	return;
            }
            
        	var uploadString = results['upload'];
            console.log('UPLOAD STRING: '+uploadString);
            
        	
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
              var file = $files[i];
              $scope.upload = $upload.upload({
                url: uploadString,
                method: 'POST',
                data: {myObj: $scope.myModelObj},
                file: file // or list of files: $files for html5 only
              }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
              }).success(function(data, status, headers, config) { // file is uploaded successfully
                  $scope.loading = false;
                  console.log(data);
                  var results = data['results'];
                
                var confirmation = results['confirmation'];
                if (confirmation!='success'){
                	alert(results['message']);
                	return;
                }
               
            	console.log(JSON.stringify(results));
            	var image = results['image'];
            	if (property=='image')
                	$scope.newListing.image = image['id'];
            	else
                	$scope.newListing.icon = image['id'];

            	
              });
            }
        }).error(function(data, status, headers, config) {
    	    $scope.loading = false;
            console.log("error", data, status, headers, config);
        });
      };
    

    
    
    
    function parseLocation(stem){
    	console.log('PARSE LOCATION: '+stem);
    	var resourcePath = location.href.replace(window.location.origin, ''); // strip out the domain root (e.g. http://localhost:8888)

    	var parts = resourcePath.split(stem+'/');
    	requestInfo = {"resource":null, "identifier":null, 'params':{}};
    	if (parts.length > 1){
    		var hierarchy = parts[1].split('/');
    		for (var i=0; i<hierarchy.length; i++){
    			if (i==0){
    				var p = hierarchy[i].split('?');
    				requestInfo['resource'] = p[0];
    				if (p.length > 1){
    					for (var j=0; j<p.length; j++){
    						var param = p[j];
    						var pieces = param.split('=');
    						if (pieces.length>1)
    							requestInfo.params[pieces[0]] = pieces[1];
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


