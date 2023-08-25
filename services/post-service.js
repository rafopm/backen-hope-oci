require("dotenv").config();
const oracledb = require("oracledb");
const Database = require("../config/database");

oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];
oracledb.autoCommit = true;

class PostService {
  constructor() {}

  static async init() {
    await Database.init();
    return new PostService();
  }

  async getAll() {
    let connection;
    const result = [];
    try {
      connection = await oracledb.getConnection();
      const postCollection = await connection
        .getSodaDatabase()
        .createCollection("posts");

      let posts = await postCollection.find().getDocuments();
      posts.forEach((element) => {
        result.push({
          id: element.key,
          createdOn: element.createdOn,
          lastModified: element.lastModified,
          ...element.getContent(),
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    return result;
  }

  async getById(postId) {
    let connection, post, result;

    try {
      connection = await oracledb.getConnection();

      const postCollection = await connection
        .getSodaDatabase()
        .createCollection("posts");
      post = await postCollection.find().key(postId).getOne();
      result = {
        id: post.key,
        createdOn: post.createdOn,
        lastModified: post.lastModified,
        ...post.getContent(),
      };
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

    return result;
  }

  async save(post) {
    let connection, novopost, result;

    try {
      connection = await oracledb.getConnection();
      const postCollection = await connection
        .getSodaDatabase()
        .createCollection("posts");
      /*
                insertOneAndGet() does not return the doc
                for performance reasons
                see: http://oracle.github.io/node-oracledb/doc/api.html#sodacollinsertoneandget
            */
      novopost = await postCollection.insertOneAndGet(post);
      result = {
        id: novopost.key,
        createdOn: novopost.createdOn,
        lastModified: novopost.lastModified,
      };
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

    return result;
  }

  async update(id, post) {
    let connection, result;

    try {
      connection = await oracledb.getConnection();
      const postCollection = await connection
        .getSodaDatabase()
        .createCollection("posts");
      post = await postCollection.find().key(id).replaceOneAndGet(post);
      result = {
        id: post.key,
        createdOn: post.createdOn,
        lastModified: post.lastModified,
      };
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

    return result;
  }

  async deleteById(postId) {
    let connection;
    let removed = false;

    try {
      connection = await oracledb.getConnection();
      const postCollection = await connection
        .getSodaDatabase()
        .createCollection("posts");
      removed = await postCollection.find().key(postId).remove();
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    return removed;
  }

  async closePool() {
    console.log("Cerrando conexion...");
    try {
      await oracledb.getPool().close(10);
      console.log("Pool cerrado");
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = PostService;