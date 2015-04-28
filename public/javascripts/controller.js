app.controller('MainCtrl', [
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
	  description: $scope.description,
      date: new Date()
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

}]);

app.controller('PostsCtrl', [
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