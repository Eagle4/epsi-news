
angular.module('flapperNews', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}])
.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };

  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
    return $http.post('/posts', post).success(function(data){
      o.posts.push(data);
    });
  };
  o.deleteComment = function(post,comment){
	return $http.delete('/posts/'+post._id+'/comments/'+comment._id);
  };

  o.deletePost = function(post){
	return $http.delete('/posts/'+post._id);
  };
  
  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data){
        post.upvotes += 1;
      });
  };

  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
      .success(function(data){
        comment.upvotes += 1;
      });
  };

  return o;
}])
.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
  $scope.test = 'Hello world!';

  $scope.posts = posts.posts;
  console.log("scope : ",$scope);
  $scope.addPost = function(){
    if($scope.title === '') { return; }
    posts.create({
	  imgLink: $scope.imgLink,
      title: $scope.title,
      link: $scope.link,
	  description: $scope.description
    });
	
    $scope.imgLink = '';
	$scope.title = '';
    $scope.link = '';
	$scope.description = '';
  };

  $scope.deletePost = function(post){
		posts.deletePost(post).success(function(post) {
			posts.getAll();
    });
  }
	
  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };

}])
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
  $scope.post = post;

  $scope.addComment = function(){
    if($scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };
	$scope.deleteComment = function(comment){
		posts.deleteComment(post, comment);
	}
  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };
}]);
