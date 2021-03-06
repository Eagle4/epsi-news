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
      var myAuthor = '';
    if($scope.author !== '' && $scope.author !== undefined) {
        myAuthor = $scope.author;
    }
      else {
        myAuthor = 'anonymous';
      }
    if($scope.body !== '' && $scope.body !== undefined) {
        posts.addComment(post._id, {
          body: $scope.body,
          author: myAuthor,
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });    
    }
    $scope.body = '';
  };
	$scope.deleteComment = function(comment){
		posts.deleteComment(post, comment);
		alert('êtes vous sur de vouloir supprimer ce commentaire');
		function refreshScope(objComment){
			for(index in $scope.post.comments){
				if (objComment === $scope.post.comments[index]){
					$scope.post.comments.splice(index,1)
				}
			}
		}
		refreshScope(comment);
	}
  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };
}]);