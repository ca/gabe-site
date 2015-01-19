var app = angular.module('CandidatesModule', []);


app.controller('CandidatesController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.accounts = null;
	$scope.loading = false;

    $scope.init = function() {
    	console.log('AccountsController: INIT');
    	var requestInfo = parseLocation('radius');
    	
    	if (requestInfo.params['locations'] != null){ 
        	fetchRadiusAccount(requestInfo.params['locations']);
    		return;
    	}
    	
    	// no location passed in url - use location from IP Address
    	var states = {
    	    'Alabama': 'AL',
    	    'Alaska': 'AK',
    	    'American Samoa': 'AS',
    	    'Arizona': 'AZ',
    	    'Arkansas': 'AR',
    	    'California': 'CA',
    	    'Colorado': 'CO',
    	    'Connecticut': 'CT',
    	    'Delaware': 'DE',
    	    'District Of Columbia': 'DC',
    	    'Florida': 'FL',
    	    'Georgia': 'GA',
    	    'Guam': 'GU',
    	    'Hawaii': 'HI',
    	    'Idaho': 'ID',
    	    'Illinois': 'IL',
    	    'Indiana': 'IN',
    	    'Iowa': 'IA',
    	    'Kansas': 'KS',
    	    'Kentucky': 'KY',
    	    'Louisiana': 'LA',
    	    'Maine': 'ME',
    	    'Marshall Islands': 'MH',
    	    'Maryland': 'MD',
    	    'Massachusetts': 'MA',
    	    'Michigan': 'MI',
    	    'Minnesota': 'MN',
    	    'Mississippi': 'MS',
    	    'Missouri': 'MO',
    	    'Montana': 'MT',
    	    'Nebraska': 'NE',
    	    'Nevada': 'NV',
    	    'New Hampshire': 'NH',
    	    'New Jersey': 'NJ',
    	    'New Mexico': 'NM',
    	    'New York': 'NY',
    	    'North Carolina': 'NC',
    	    'North Dakota': 'ND',
    	    'Northern Mariana Islands': 'MP',
    	    'Ohio': 'OH',
    	    'Oklahoma': 'OK',
    	    'Oregon': 'OR',
    	    'Palau': 'PW',
    	    'Pennsylvania': 'PA',
    	    'Puerto Rico': 'PR',
    	    'Rhode Island': 'RI',
    	    'South Carolina': 'SC',
    	    'South Dakota': 'SD',
    	    'Tennessee': 'TN',
    	    'Texas': 'TX',
    	    'Utah': 'UT',
    	    'Vermont': 'VT',
    	    'Virgin Islands': 'VI',
    	    'Virginia': 'VA',
    	    'Washington': 'WA',
    	    'West Virginia': 'WV',
    	    'Wisconsin': 'WI',
    	    'Wyoming': 'WY'
    	  }    	
    	
    	console.log('FIND LOCATION');

    	$.get("http://ipinfo.io", function (response) {
    		console.log(JSON.stringify(response));
    		var city = response.city;
    		var state = states[response.region];
    		
    		var currentLocation = city+','+state;
        	fetchRadiusAccount(currentLocation);
    	}, "jsonp");
    	
    }
    
    $scope.selectLocation = function(location){
    	console.log('selectLocation: '+location);
    	
    	fetchRadiusAccount(location);
    }
    
    
    function fetchRadiusAccount(locations){
    	locations = locations.replace(' ', '+');
    	$scope.loading = true;
    	
    	var url = '/api/radiusaccounts?locations='+locations;
//    	var url = 'https://www.mercurymq.com/api/radiusaccounts?locations='+locations; // TESTING!

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
            
        	var a = results['accounts'];
        	for (var i=0; i<a.length; i++){
        		var account = a[i];
        		var skills = account.skills;
    			account.abbreviatedSkills = new Array();
    			var max = (skills.length > 5) ? 5 : skills.length;
    			for (var j=0; j<max; j++)
    				account.abbreviatedSkills.push(skills[j]);
        	}
        	
        	$scope.accounts = a;


        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
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


