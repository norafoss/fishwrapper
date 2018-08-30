const Lib = require('./lib');
const Login = require('./login');
const INSTA_TABLE = process.env.INSTA_TABLE

class InstaShorts {

  static index(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      dynamoDb.scan({TableName: INSTA_TABLE}, function (err, data) {
        if (err) {
          console.log(err);
          Lib.error(res, req, err);
        } else {
          Lib.render(res, req, 'insta_shorts/index', {shorts: data.Items});
        }
      });
    }
  }

  static new_short(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      Lib.render(res, req, 'insta_shorts/new');
    }
  }

  static create(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      const params = {
        TableName: INSTA_TABLE,
        Item: {
          instaId: req.body.content.toLocaleLowerCase().substr(0, 20).replace(/\s/g, '-'),
          content: req.body.content
        } 
      };
      dynamoDb.put(params, function (err) {
        if (err) {
          console.log(err);
          Lib.error(res, req, err);
        } else {
          res.redirect('/insta_shorts');
        }
      });
    }
  }

  static edit(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      const params = {
        TableName: INSTA_TABLE,
        Key: {
          instaId: req.params.instaId
        }
      };
      dynamoDb.get(params, function (err, data) {
        if (err) {
          console.log(err);
          Lib.error(res, req, err);
        } else {
          Lib.render(res, req, 'insta_shorts/edit', {short: data.Item});
        }
      });
    }
  }

  static update(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      const params = {
        TableName: INSTA_TABLE,
        Key: {
          instaId: req.body.instaId
        },
        UpdateExpression: 'SET content = :content',
        ExpressionAttributeValues: {
          ':content': req.body.content
        } 
      };
      dynamoDb.update(params, function (err) {
        if (err) {
          console.log(err);
          Lib.error(res, req, err);
        } else {
          res.redirect('/insta_shorts');
        }
      });
    }
  }

  static destroy(req, res, dynamoDb) {
    if (Login.authenticate(req, res)) {
      const params = {
        TableName: INSTA_TABLE,
        Key: {
          instaId: req.params.instaId
        }
      };
      dynamoDb.delete(params, function (err) {
        if (err) {
          console.log(err);
          Lib.error(res, rew, err);
        } else {
          res.redirect('/insta_shorts');
        }
      });
    }
  }
}
module.exports = InstaShorts;
