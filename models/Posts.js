var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  imgLink: String,
  title: String,
  link: String,
  description: String,
  upvotes: {type: Number, default: 0},
  date: Date,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);