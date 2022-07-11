const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Parse = require('parse/node')
const {PARSE_APP_ID, PARSE_JAVASCRIPT_KEY} = require('./config')


const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())
const MASTER_KEY = "EZzrcPqV2upIeItA2XKyLP16yIybXOVOimEfIFFf"

Parse.initialize("rHsJxlTuorkf0XCwgevAbPTMPBzutWozKgsPGQ9C", "e8iN7gYsSWrQvtE9UhHM5QrRWjbzZkb3QDPqCL0Q", `${MASTER_KEY}`)
Parse.serverURL = "https://parseapi.back4app.com"



app.post('/register', async (req, res) => {
  let user = new Parse.User(req.body)

  try {
      await user.signUp()
      res.status(201)
      res.send({"user" : user})
  } catch (error) {
      res.status(400)
      res.send({ loginMessage: error.message, RegisterMessage: '', typeStatus: "danger",  infoUser: user})//{"error" : "Failed to create user: " + error })
  }
})

app.post('/login', async (req, res) => {
  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password)
    console.log("in login", user)
    res.send({"user" : user, "sessionToken" : user.getSessionToken()})
  } catch (error) {
    res.status(400)
    res.send({"error" : error.message })
  }
})

app.post('/logout', async (req, res) => {
  let query = new Parse.Query("_Session")

  query.equalTo("sessionToken", req.body.sessionToken)

  query.first( { useMasterKey : true}).then(function (user) {
    if (user) {
      console.log(user)

      user
      .destroy(
        {useMasterKey: true}
      )
      .then ( function(res) {
        console.log("success")
      })
      .catch(function (error) {
        console.log(error)
        return null
      })
    } else {
      console.log("Nothing here")
      //res.send({ loginMessage: error.message, RegisterMessage: '', typeStatus: "danger",  infoUser: user})
      res.send({})
    }
  })
})

// axios.get(...../products, {
//  id = dfnekg
// })

app.post('/add_products', async (req, res) => {
  try {

    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", req.body.user.user.objectId).equalTo("productId", req.body.productId);
      return query.count();
    }
    const response =  await postsMatching()
    console.log("RESPONSE:", response)
    if (response === 0) {

      const Likes = Parse.Object.extend("Likes")
      const likes = new Likes();

      likes.set({
        "userId": req.body.user.user.objectId,
        "productId": req.body.productId
      })

      likes.save()
  } if (response > 0) {
    console.log("already added!")
  }

  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})

app.post('/remove_products', async (req, res) => {
  try {
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", req.body.user.user.objectId).equalTo("productId", req.body.productId);
      return query.find();
    }
    postsMatching().then(function(posts) {
      console.log("deleting " + JSON.stringify(posts));
      Parse.Object.destroyAll(posts);
    }, function(error) {
      console.log("error " + JSON.stringify(error));
    });

  } catch (error) {
    res.status(400)
    res.send({"error": error})
  }
})

//app.get necessary as well

app.get('/products/:userId', async (req, res) => {
  try {
    const {userId} = req.params
    console.log(userId)
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", userId);
      return query.find();
    }
    const response =  await postsMatching()
    product_ids = response.map((element) => {
      return element.attributes.productId
  })
    console.log(product_ids)
    res.send({"posts" : product_ids})

  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})



app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Header", "access-control-allow-methods");
  res.send(Parse.User.current())
})

app.listen(port, () => {
  console.log(`Parse Web Demo app listening on port ${port}`)
})
