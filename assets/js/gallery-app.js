'use strict';

var gallery_folder = 'gallery';

var app = angular.module('galleryApp', []);

app.controller('FolderCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
	var lookup = {};
	$scope.folders = [];

	$http.get(gallery_folder+'/folders.json').success(function(folders) {
		$scope.folders = folders;

		angular.forEach(folders, function(folder) {
			lookup[folder.folder_name] = folder;
			// set the active flag to false
			folder.active = false;
		});

		// Check to see we have a valid path url
		var path = $location.path().substring(1);
		if(angular.isDefined(lookup[path])) {
			lookup[path].active = true;
			$rootScope.activeFolder = lookup[path].folder_name;
		} else {
			$location.path($scope.folders[0].folder_name);
		}
	});

	$scope.$watch(function() {return $location.path(); }, function(newPath) {
		newPath = newPath.substring(1);

		if(angular.isDefined(lookup[newPath])) {
			// Navigate away...
			angular.forEach($scope.folders, function(folder) {
				if(folder.folder_name == newPath) {
					folder.active = true;
					$rootScope.activeFolder = folder.folder_name;
				} else {
					folder.active = false;
				}
			});
		}
	});
}]);

app.controller('GalleryCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	$scope.photos = [];

	$rootScope.$watch('activeFolder', function(folder) {
		if(angular.isDefined(folder)) {
			$http.get(gallery_folder+'/'+folder+'/photos.json').success(function(photos) {
				angular.forEach(photos, function(photo) {
					photo.aspect_ratio = photo.width/photo.height;
					photo.src = gallery_folder + '/' + folder + '/' + photo.src;
				});

				$scope.photos = photos;
			});
		}
	});
}]);

app.directive('gallery', ['$timeout', function($timeout) {
	return {
		scope: {
			photos: "=gallery"
		},
		link: function($scope, elem, attrs) {
			var recalc = function(photos) {
				var width = $('#gallery-container').width();
				var height = $(window).height() / 2;
				var html_string = distribute(photos, width, height);

				// Turn this resize event off first so when we empty the div it wont recalc
				$(window).off('resize.gallery');
				
				$("#gallery-container").empty().append(html_string);
				// Do it again, in case the one above was with no scroll bar but the
				// reshuffle triggered a scroll bar and now we have a scroll bar to consder too
				width = $('#gallery-container').width();
				height = $(window).height() / 2;
				html_string = distribute(photos, width, height);
				$("#gallery-container").empty().append(html_string);
				
				// When we resize we need to recalculate again
				$(window).on('resize.gallery', function() {
					recalc(photos);
				});
			}

			// Also, whenever the photos change we need to recalculate
			$scope.$watch('photos', function(photos) {
				recalc(photos);
			});
		}
	}
}]);

