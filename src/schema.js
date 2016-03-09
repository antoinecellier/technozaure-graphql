const _ = require('lodash');
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql';

const mongo = require('promised-mongo');
const db = mongo('mongodb://localhost/mydb');
const postsCollection = db.collection('posts');
const firebase = require("firebase");
const authorsRef = new firebase("https://tz-graphql.firebaseio.com/").child("authors");


const Author = new GraphQLObjectType({
  name: "Author",
  description: "Represent the type of an author of a blog post or a comment",
  fields: () => ({
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    twitterHandle: {type: GraphQLString}
  })
});

const Post = new GraphQLObjectType({
  name: "Post",
  description: "Represent the type of a blog post",
  fields: () => ({
    _id: {type: GraphQLString},
    title: {type: GraphQLString},
    summary: {type: GraphQLString},
    content: {type: GraphQLString},
    timestamp: {
      type: GraphQLFloat,
      resolve: function(post) {
        if(post.date) {
          return new Date(post.date['$date']).getTime();
        } else {
          return null;
        }
      }
    },
    author: {
      type: Author,
      resolve: function({author}) {
        return authorsRef.child(author).once("value").then(function(data) {
          return data.val();
        })
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: "Root of the Blog Schema",
  fields: () => ({
    posts: {
      type: new GraphQLList(Post),
      description: "List of posts in the blog",
      resolve: function() {
        return postsCollection.find().toArray();
      }
    },

    post: {
      type: Post,
      description: "Post by _id",
      args: {
        _id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: function(source, {_id}) {
        return postsCollection.findOne({_id : mongo.ObjectId(_id)});
      }
    },

    authors: {
      type: new GraphQLList(Author),
      description: "Available authors in the blog",
      resolve: function() {
        return authorsRef.once("value").then(function(data) {
          const authors = [];
          _.forIn(data.val(), function (value, key) {
            value._id = key;
            authors.push(value);
          });
          return authors;
        });
      }
    },

    author: {
      type: Author,
      description: "Author by _id",
      args: {
        _id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: function(source, {_id}) {
        return authorsRef.child(_id).once("value").then(function(data) {
          return data.val();
        })
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "BlogMutations",
  fields: {
    createPost: {
      type: Post,
      description: "Create a new blog post",
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        summary: {type: GraphQLString},
        author: {type: new GraphQLNonNull(GraphQLString), description: "Id of the author"}
      },
      resolve: function(source, args) {
        let post = _.clone(args);
        return authorsRef.child(post.author).once("value").then(function(data) {
          if(!data.val()) {
            throw new Error("Author is invalid");
          }
        }).then(function() {
          return postsCollection.save(post);
        })

      }
    },

    createAuthor: {
      type: Author,
      description: "Create a new author",
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        twitterHandle: {type: GraphQLString}
      },
      resolve: function(source, args) {
        const author = _.clone(args);
        const ref = authorsRef.push(author);
        return ref.then(function() {
          author._id = ref.key();
          return author;
        });
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;