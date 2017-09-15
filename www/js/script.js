var app = angular.module('myApp', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl:"views/index.html"
	})
	.when('/about',{
		templateUrl: 'views/about.html'
	})
	.when('/video/:vindex',{
		templateUrl: 'views/video.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
app.controller('myCtrl', function ($scope,$http,$location,$route,$routeParams) {
    
    //set loading variable (is ajax running?)
	$scope.at = 'EAABmSZBW6IbkBAPWVQOr9hwgrWxaObgOvqFUJYKoELeUg8MZCmVFlvQP4rnF2vay3BQM9wzUXTjkbQ4Ri5VdunhMscvr19vmUCYkqtLsPXEuYlwuqtrf729CFaLB4iknNlNm4UpdUwrmfNMOv61gsy32uPBS8ZD';
	$scope.gid = '810517042300154';
	$scope.qs = '?fields=message,attachments{media,target,type},type,source,created_time&limit=20';
	$scope.fburl = 'https://graph.facebook.com/v2.10/'+$scope.gid+'/feed'+$scope.qs+'&access_token='+$scope.at;
	$scope.identifier= 'com.codingsips.gags';
	$scope.about 	= dbGet('about');
	$scope.adCounter= 1;
    $scope.loading 	= false;
	$scope.videos = dbGet('videos');
	$scope.video  = [];
	$scope.tmp_videos = [];
	$scope.txt = '';
	
	$scope.getFeed = function(){
		$scope.loading = true;
		$http({
			method:"GET", 
            async : false,
            url: $scope.fburl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response) {
				if($scope.processData(response.data.data)==true && $scope.tmp_videos.length>1){
					$scope.videos = $scope.tmp_videos;
				}		
				$scope.loading = false;
        },function myError(response) {
			msg('Could not connect to server.<br>Please check your internet.','warning');
			$scope.videos	= dbGet('videos');
			$scope.loading = false;
        });
	}
	$scope.getFeed();
	

	$scope.processData = function(data){
		$scope.tmp_videos = [];
		$.each(data,function(i,d){
			if(d.type.indexOf('video')>=0 && d.hasOwnProperty('source')){
				var msg = 'Untitled';
				if(d.hasOwnProperty('message')){
					msg = d.message;
					msg = msg.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').substring(0,30);
				}
				if(msg == ''){
					msg = 'Untitled';
				}
				var isYt = d.source.indexOf('youtube');				
				if(isYt<0){
					$scope.tmp_videos.push({
						'vframe': '<iframe src="'+d.source+'&showinfo=0&rel=0" frameborder="0" allowfullscreen></iframe>',
						'title':msg,
						'vthumb':d.attachments.data[0].media.image.src,
						'date':d.created_time.substring(0,10),
					});
				}
			}
		});
		return true;
	}
		
	$scope.$on('$routeChangeStart', function(event, next, current){
		if(next.templateUrl == 'views/video.html'){
			$scope.vindex = next.params.vindex;
			$scope.video = $scope.videos[next.params.vindex];			
		}
		
		$('.alert').remove();
	});
	$scope.$on('$viewContentLoaded', function(){
		if($route.current.loadedTemplateUrl == 'views/index.html'){			
			$('.swipebox').swipebox();
			$('#myCarousel').carousel({
				interval: 2000
			});
		}
		window.scrollTo(0, 0);//on view change scroll to top
		$scope.intad();			
	});
	
	$scope.videoNavs = function(){
		var navz = '';
		var nxt = parseInt($scope.vindex) + 1;
		var prv = parseInt($scope.vindex) - 1;
		if($scope.videos[prv]!==undefined){
			navz += '<a href="#/video/'+prv+'" class="btn btn-xs btn-info pull-left"><i class="fa fa-arrow-left"></i> Previous Video</a>';
		}
		if($scope.videos[nxt]!==undefined){
			navz += '<a href="#/video/'+nxt+'" class="btn btn-xs btn-info pull-right"><i class="fa fa-arrow-right"></i> Next Video</a>';
		}
		navz +='<div class="clearfix"></div>';
		return navz;
	}
	
	$scope.newsNavs = function(){
		var navz = '';
		var nxt = parseInt($scope.nindex) + 1;
		var prv = parseInt($scope.nindex) - 1;
		if($scope.news[prv]!==undefined){
			navz += '<a href="#/news/'+prv+'" class="btn btn-xs btn-info pull-left"><i class="fa fa-arrow-left"></i> Previous News</a>';
		}
		if($scope.news[nxt]!==undefined){
			navz += '<a href="#/news/'+nxt+'" class="btn btn-xs btn-info pull-right"><i class="fa fa-arrow-right"></i> Next News</a>';
		}
		navz +='<div class="clearfix"></div>';
		return navz;
	}
	
	$scope.intad = function(){
		$scope.adCounter++;
		if($scope.adCounter==2){
			if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
		}
		if($scope.adCounter>9){
			$scope.adCounter=0;
			if(AdMob) AdMob.showInterstitial();			
		}
	}
	
	/*about starts here*/
	var about = JSON.parse(localStorage.getItem("about"));
	if(about == null){
		about = 'coming soon';
	}
	$http({
		method:"GET", 
		async :true,
		url: 'http://apps.alampk.com/api/mobile-apps-by-alam.php?id='+$scope.identifier,
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {				
		about = response.data;
		dbSave("about", about);
		
	},function myError(jqXHR, exception) {
		//nothing to display
	});
	$scope.about = about;
   /*about ends here*/
});

app.filter("h", ['$sce', function ($sce) {
	return function (str) {
		return $sce.trustAsHtml(str);
	};
}]);

$(function(){
    //collapse top menu dropdown after click on mobile view
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });
}); 

app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

app.filter('myDate', function myDate($filter){
  return function(text){
    var  tempdate= new Date(text.replace(/-/g,"/"));
    return $filter('date')(tempdate, "MMM-dd-yyyy");
  }
});

app.filter('nl2br', function myDate($sce){
	return function(str,is_xhtml) { 
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
		var msg = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
		return $sce.trustAsHtml(msg);
	}
});

