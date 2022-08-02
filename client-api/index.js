const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Parse = require('parse/node')
const { spawn }=require('child_process')
const events = require('events');
const myEmitter = new events.EventEmitter();
//var _ = require('lodash');
var _ = require('underscore');
const {PARSE_APP_ID, PARSE_JAVASCRIPT_KEY} = require('./config')
const { disconnect } = require('process')


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

// conquered difficult questions - message

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
  res.send("success")
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
    res.send("success")
  } catch (error) {
    res.status(400)
    res.send({"error": error})
  }
})

app.post('/rating_add', async (req, res) => {
  try {

    function postsMatching() {
      var Product = Parse.Object.extend("Product");
      var query = new Parse.Query(Product);
      query.equalTo("productId", req.body.productId);
      return query.count();
    }
    const response =  await postsMatching()
    console.log("RESPONSE:", response)
    if (response === 0) {

      const Product = Parse.Object.extend("Product")
      const product = new Product();
      console.log(req.body.productId)
      product.set({
        "productId": req.body.productId,
        "healthRating" : req.body.healthRating,
        "title" : req.body.title,
        "company" : req.body.company
      })

      product.save()

  } if (response > 0) {
    console.log("already added!")
  }
  res.send({message: "Success!"})
  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})


app.post('/category', async (req, res)=> {
  function categoryMatching() {
    var Category = Parse.Object.extend("Category");
    var query = new Parse.Query(Category);
    query.equalTo("category", req.body.category);
    return query.count();
  }
  const response =  await categoryMatching()
  if (response === 0) {
    const Category = Parse.Object.extend("Category")
    const category = new Category();
    category.set({
      "category": req.body.category
    })
    category.save()
  }
})

app.get('/rating_add/:productId', async (req, res) => {
  try {

    const {productId} = req.params
    console.log("HERE")
    function postsMatching() {
      var Product = Parse.Object.extend("Product");
      var query = new Parse.Query(Product);
      query.equalTo("productId", parseInt(productId));
      return query.find();
    }
    const response = await postsMatching()
    if (response.length == 0) {
      res.send({posts: {"data" : "none"}})
    } else {
      res.send({posts: {"title": response[0].attributes.title, "company":response[0].attributes.company, "healthRating": response[0].attributes.healthRating}})
    }

  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})

//app.get necessary as well

app.get('/products/:userId', async (req, res) => {
  try {
    const {userId} = req.params
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
    console.log(response)
    res.send({"posts" : product_ids})

  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})

app.post('/categories', async (req, res) => {
  try {
    function postsMatching() {
      const Category = Parse.Object.extend("Category")
      const query = new Category();
      query.equalTo("foodCategory", req.body.category);
      return query.count();
    }
    const response =  await postsMatching()
    console.log("RESPONSE:", response)
    if (response === 0) {

      const Category = Parse.Object.extend("Category")
      const category = new Category();
      category.set({
        "foodCategory" : req.body.category
      })
      category.save()
    } if (response > 0) {
      console.log("already added!")
    }
    res.send({message: "Success!"})

  } catch (error) {
    res.status(400)
    res.send({'error' : error})
  }
})

app.get('/categories', async(req, res) => {
  const Category = Parse.Object.extend("Category")
  const query = new Category();
  res.send({posts: query.find()});
})

app.get('/reccomendations/MLBased/:userId', async (req, res) => {
  //try {
    let total = []
    // const {userId} = req.params
    // async function postsMatching(userIdPassed) {
    //   var Likes = Parse.Object.extend("Likes");
    //   var query = new Parse.Query(Likes);
    //   query.equalTo("userId", userIdPassed);
    //   let resp =  await query.find();
    //   return resp
    // }
    const {userId} = req.params
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", userId);
      return query.find();
    }
    const response =  await postsMatching()
    myEmitter.setMaxListeners(response.length)
    // products a user liked

    async function categories() {
      var query = new Parse.Query("Category")
      let resp = await query.find();
      return resp
    }
    let resp = await categories()
    let categorys = resp.map((element) => {
      return element.attributes.category
    })
    let array = []

    response.forEach(async (element) => {

      function productsMatching(productId) {
        var Products = Parse.Object.extend("Product");
        var query = new Parse.Query(Products);
        query.equalTo("productId", productId)
        return query.find();
      }

      let resp = await productsMatching(element.attributes.productId)
      if (resp.length != 0) {
        let actual_category = resp[0].attributes.title //"plant based milk" // change based on based on product

        let options = ["similarity_model.py"]
        options.push(actual_category)
        options = options.concat(categorys)
        // ^^ above this works

        //let options = ['similarity_model.py', "plant based milk", "cereal", "plant based meat"]
        const child_python= spawn('python3', options);
        array = []


        child_python.stdout.on('data', (data)=> {
          let parsed_data = JSON.parse(data)
          console.log(`json :${parsed_data}`);

          var result = parsed_data.reduce(function(result, field, index) {
            result[categorys[index]] = field;
            return result;
          }, {})

          var items = Object.keys(result).map(
            (key) => { return [key, result[key]] });

          items.sort(
            (first, second) => { return second[1] - first[1] }
          );

          var keys = items.map(
            (e) => { return e[0] });

          keys = keys.slice(0,4)
          array = [("ACTUAL:" + actual_category)]
          keys.forEach((element) => {
            array.push(element)
          })
          //console.log("ARRAY", array)
          total.push(array)

          child_python.stderr.on('data',(data)=>{
            console.log(`stderr : ${data}`);
          })

          child_python.on('close',(code)=>{
              console.log(`child process exited with code ${code}`)
              myEmitter.emit('firstSpawn-finished');
          })
        })

      }

    })//)
    let i = 0
    myEmitter.on('firstSpawn-finished', () => {
      //total.push(array)
      i = i + 1
      if (i == 1) {
        res.send({"posts": total})
      }
    })
  })

// For products a user likes, see if other users liked that product, generate list of other products the users liked, display them for the current user
app.get('/recommendations/UsertoUser/:userId', async (req, res) => {
  try {
    const {userId} = req.params
    function postsMatching(userIdPassed) {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", userIdPassed);
      return query.find();
    }
    // products a user liked
    const response =  await postsMatching(userId)
    // generate list of products other users liked
      // for each product the user liked, find if another user has also liked it
      // get those users ids and find the products they enjoyed
    function productsMatching(productId) {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("productId", productId).notEqualTo("userId", userId)
      return query.find();
    }
    // for each user in this list, find the posts matching
    product_ids = await Promise.all(response.map(async (element) => {
      let resp = await productsMatching(element.attributes.productId)
      console.log("RESPONSE", resp)
      let res = await Promise.all(resp.map(async (el) => {
        let responses = await postsMatching(el.attributes.userId)
        let final = responses.map((element) => {
          return element.attributes.productId
        })
        return final
      }))
      return res
    }))
    console.log("product_ids", product_ids)
    res.send({"posts" : product_ids})


  } catch (error) {
    res.status(400)
    res.send({"error" : error })
  }
})

app.post('/remove_rating', (req, res) => {
  //remove rating
})

app.post('/ratings', (req, res) => {

  try {
    var Ratings = Parse.Object.extend("Ratings");
    const ratings = new Ratings();
    console.log(ratings)
    ratings.set({
      "Review" : req.body.reviews,
      "Rating" : req.body.rating,
      "UserId": req.body.user.user.objectId,
      "ProductId": req.body.productId
    })

    ratings.save()
    console.log("SECOND")
} catch (error) {
  res.status(400)
  res.send({"error" : error })
}
})

app.get('/ratings/:productId', async (req, res) => {
  try {
    const {productId} = req.params
    console.log(productId)
    function postsMatching() {
      var Ratings = Parse.Object.extend("Ratings");
      var query = new Parse.Query(Ratings);
      query.equalTo("ProductId", parseInt(productId));
      return query.find();
    }
    function userName(userId) {
      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
      query.equalTo("objectId", userId);
      return query.find();
    }
    const response = await postsMatching()
    // username, rating, review
    let objToReturn = {}
    const reviews = await Promise.all(response.map(async (element) => {

      let resp = await userName(element.attributes.UserId)
      //console.log(element.attributes)
      return {"user" : resp[0].attributes.username,
      "rating" : element.attributes.Rating,
      "review" : element.attributes.Review
    }
    }))
  res.send({"posts" : reviews})

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
