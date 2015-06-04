angular.module("app",['firebase','ui.bootstrap'])

.value('fbURL','https://soloficcion.firebaseio.com/')

.factory('Post', function($firebaseArray, $firebaseObject, fbURL){
	var ref = new Firebase(fbURL);
	var posts = $firebaseArray(ref.child('posts'));

	var Post = {
		all: posts,
		create: function(post){
			return posts.$add(post);
		},
		get: function(postId){
			return $firebaseObject(ref.child('posts').child(postId));
		},
		delete: function(post){
			return posts.$remove(post);
		}
	};
	return Post;
})

.controller("MainCtrl", function($scope, $modal, Post){

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.nombre = "moises linares";

	// revemo Record
	$scope.removeRecord = function(post){		
		Post.delete(post);	
		$scope.alerts.push({type: 'danger', msg: 'Se ha eliminado.'});		
	}

	$scope.posts = Post.all;
	$scope.open = function(userId){
		var modalInstance = $modal.open({
			templateUrl: 'add_user_modal',
			controller: $scope.model,
			resolve: {
				id: function() {
					return userId;
				}
			}
		}).result.then(function(result) {			
			if(angular.isDefined(result.$id)){
				var post_temp = Post.get(result.$id);
				post_temp = result
				post_temp.$save();		
				$scope.alerts.push({type: 'success', msg: 'Se ha Editado'});
			} else {
				Post.create(result);
				$scope.alerts.push({type: 'success', msg: 'Se ha Creado!!.'});				
			}			
		});
	}


	$scope.model = function($scope, $modalInstance, id, Post){

		if(angular.isDefined(id)){
			$scope.post = Post.get(id);
		}

		// add new post or edit post
		$scope.add = function(){			
			$modalInstance.close($scope.post);
		}

		// close modal
		$scope.cancel = function(){			
			$modalInstance.dismiss('cancel');
		}

	}
});

