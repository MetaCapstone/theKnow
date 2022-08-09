const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Parse = require("parse/node");
const { spawn } = require("child_process");
const events = require("events");
const myEmitter = new events.EventEmitter();
var _ = require("underscore");
const { PARSE_APP_ID, PARSE_JAVASCRIPT_KEY } = require("./config");
const { disconnect } = require("process");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
const MASTER_KEY = "EZzrcPqV2upIeItA2XKyLP16yIybXOVOimEfIFFf";

Parse.initialize(
  "rHsJxlTuorkf0XCwgevAbPTMPBzutWozKgsPGQ9C",
  "e8iN7gYsSWrQvtE9UhHM5QrRWjbzZkb3QDPqCL0Q",
  `${MASTER_KEY}`
);
Parse.serverURL = "https://parseapi.back4app.com";

app.post("/register", async (req, res) => {
  let user = new Parse.User(req.body);
  try {
    await user.signUp();
    res.status(201);
    res.send({ user: user });
  } catch (error) {
    res.status(400);
    res.send({
      loginMessage: error.message,
      RegisterMessage: "",
      typeStatus: "danger",
      infoUser: user,
    }); //{"error" : "Failed to create user: " + error })
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password);
    res.send({ user: user, sessionToken: user.getSessionToken() });
  } catch (error) {
    res.status(400);
    res.send({ error: error.message });
  }
});

app.post("/logout", async (req, res) => {
  let query = new Parse.Query("_Session");

  query.equalTo("sessionToken", req.body.sessionToken);

  query.first({ useMasterKey: true }).then(function (user) {
    if (user) {
      user
        .destroy({ useMasterKey: true })
        .then(function (res) {
          console.log("success");
        })
        .catch(function (error) {
          console.log(error);
          return null;
        });
    } else {
      res.send({});
    }
  });
});

app.post("/add_products", async (req, res) => {
  try {
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query
        .equalTo("userId", req.body.user.user.objectId)
        .equalTo("productId", req.body.productId);
      return query.count();
    }
    const response = await postsMatching();
    if (response === 0) {
      const Likes = Parse.Object.extend("Likes");
      const likes = new Likes();

      likes.set({
        userId: req.body.user.user.objectId,
        productId: req.body.productId,
      });

      likes.save();
    }
    if (response > 0) {
    }
    res.send("success");
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/add_image", async (req, res) => {
  try {
    const Images = Parse.Object.extend("Images");
    const image = new Images();

    image.set({
      productId: req.body.productId,
      imageRegular: req.body.imageRegular,
      imageRaw: req.body.imageRaw,
    });

    image.save();

    res.send("success");
  } catch (err) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/get_images/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    function postsMatching() {
      var Images = Parse.Object.extend("Images");
      var query = new Parse.Query(Images);
      query.equalTo("productId", parseInt(productId));
      return query.find();
    }
    const response = await postsMatching();
    if (response.length == 0) {
      res.send({ posts: { data: "none" } });
    } else {
      res.send({
        posts: {
          imageRegular: response[0].attributes.imageRegular,
          imageRaw: response[0].attributes.imageRaw,
        },
      });
    }
  } catch (err) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/remove_products", async (req, res) => {
  try {
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query
        .equalTo("userId", req.body.user.user.objectId)
        .equalTo("productId", req.body.productId);
      return query.find();
    }
    postsMatching().then(
      function (posts) {
        Parse.Object.destroyAll(posts);
      },
      function (error) {
        console.log("error " + JSON.stringify(error));
      }
    );
    res.send("success");
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/rating_add", async (req, res) => {
  try {
    function postsMatching() {
      var Product = Parse.Object.extend("Product");
      var query = new Parse.Query(Product);
      query.equalTo("productId", req.body.productId);
      return query.count();
    }
    const response = await postsMatching();
    if (response === 0) {
      const Product = Parse.Object.extend("Product");
      const product = new Product();
      product.set({
        productId: req.body.productId,
        healthRating: req.body.healthRating,
        title: req.body.title,
        company: req.body.company,
      });

      product.save();
    }
    if (response > 0) {
      console.log("already added!");
    }
    res.send({ message: "Success!" });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/category", async (req, res) => {
  function categoryMatching() {
    var Category = Parse.Object.extend("Category");
    var query = new Parse.Query(Category);
    query.equalTo("category", req.body.category);
    return query.count();
  }
  const response = await categoryMatching();
  if (response === 0) {
    const Category = Parse.Object.extend("Category");
    const category = new Category();
    category.set({
      category: req.body.category,
    });
    category.save();
  }
});

app.get("/rating_add/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    function postsMatching() {
      var Product = Parse.Object.extend("Product");
      var query = new Parse.Query(Product);
      query.equalTo("productId", parseInt(productId));
      return query.find();
    }
    const response = await postsMatching();
    if (response.length == 0) {
      res.send({ posts: { data: "none" } });
    } else {
      res.send({
        posts: {
          title: response[0].attributes.title,
          company: response[0].attributes.company,
          healthRating: response[0].attributes.healthRating,
        },
      });
    }
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/userRatings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    function postsMatching() {
      var Ratings = Parse.Object.extend("Ratings");
      var query = new Parse.Query(Ratings);
      query.equalTo("UserId", userId);
      return query.find();
    }
    const response = await postsMatching();
    product_ids = response.map((element) => {
      return element.attributes.productId;
    });
    const reviews = response.map((element) => {
      return {
        rating: element.attributes.Rating,
        review: element.attributes.Review,
        productId: element.attributes.ProductId,
        objectId: element.id,
      };
    });
    res.send({ posts: reviews });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/products/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    function postsMatching() {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", userId);
      return query.find();
    }
    const response = await postsMatching();
    product_ids = response.map((element) => {
      return element.attributes.productId;
    });
    res.send({ posts: product_ids });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/categories", async (req, res) => {
  try {
    function postsMatching() {
      const Category = Parse.Object.extend("Category");
      const query = new Category();
      query.equalTo("foodCategory", req.body.category);
      return query.count();
    }
    const response = await postsMatching();
    if (response === 0) {
      const Category = Parse.Object.extend("Category");
      const category = new Category();
      category.set({
        foodCategory: req.body.category,
      });
      category.save();
    }
    if (response > 0) {
      console.log("already added!");
    }
    res.send({ message: "Success!" });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/categories", async (req, res) => {
  const Category = Parse.Object.extend("Category");
  const query = new Category();
  res.send({ posts: query.find() });
});

app.get("/reccomendations/MLBased/:userId", async (req, res) => {
  let total = [];
  const { userId } = req.params;
  function postsMatching() {
    var Likes = Parse.Object.extend("Likes");
    var query = new Parse.Query(Likes);
    query.equalTo("userId", userId);
    return query.find();
  }
  const response = await postsMatching();
  myEmitter.setMaxListeners(response.length);
  // products a user liked

  async function categories() {
    var query = new Parse.Query("Category");
    let resp = await query.find();
    return resp;
  }
  let resp = await categories();
  let categorys = resp.map((element) => {
    return element.attributes.category;
  });
  let array = [];

  response.forEach(async (element) => {
    function productsMatching(productId) {
      var Products = Parse.Object.extend("Product");
      var query = new Parse.Query(Products);
      query.equalTo("productId", productId);
      return query.find();
    }

    let resp = await productsMatching(element.attributes.productId);
    if (resp.length != 0) {
      let actual_category = resp[0].attributes.title;

      let options = ["similarity_model.py"];
      options.push(actual_category);
      options = options.concat(categorys);

      const child_python = spawn("python3", options);
      array = [];

      child_python.stdout.on("data", (data) => {
        let parsed_data = JSON.parse(data);
        console.log(`json :${parsed_data}`);

        var result = parsed_data.reduce(function (result, field, index) {
          result[categorys[index]] = field;
          return result;
        }, {});

        var items = Object.keys(result).map((key) => {
          return [key, result[key]];
        });

        items.sort((first, second) => {
          return second[1] - first[1];
        });

        var keys = items.map((e) => {
          return e[0];
        });

        keys = keys.slice(0, 4);
        array = ["ACTUAL:" + actual_category];
        keys.forEach((element) => {
          array.push(element);
        });
        total.push(array);

        child_python.stderr.on("data", (data) => {
          console.log(`stderr : ${data}`);
        });

        child_python.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
          myEmitter.emit("firstSpawn-finished");
        });
      });
    }
  });
  let i = 0;
  myEmitter.on("firstSpawn-finished", () => {
    i = i + 1;
    if (i == 1) {
      res.send({ posts: total });
    }
  });
});

// For products a user likes, see if other users liked that product, generate list of other products the users liked, display them for the current user
app.get("/recommendations/UsertoUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    function postsMatching(userIdPassed) {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("userId", userIdPassed);
      return query.find();
    }
    // products a user liked
    const response = await postsMatching(userId);
    // generate list of products other users liked
    // for each product the user liked, find if another user has also liked it
    // get those users ids and find the products they enjoyed
    function productsMatching(productId) {
      var Likes = Parse.Object.extend("Likes");
      var query = new Parse.Query(Likes);
      query.equalTo("productId", productId).notEqualTo("userId", userId);
      return query.find();
    }
    // for each user in this list, find the posts matching
    product_ids = await Promise.all(
      response.map(async (element) => {
        let resp = await productsMatching(element.attributes.productId);
        let res = await Promise.all(
          resp.map(async (el) => {
            let responses = await postsMatching(el.attributes.userId);
            let final = responses.map((element) => {
              return element.attributes.productId;
            });
            return final;
          })
        );
        return res;
      })
    );
    res.send({ posts: product_ids });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/userProfile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    function userName() {
      var UserInfo = Parse.Object.extend("UserInfo");
      var query = new Parse.Query(UserInfo);
      query.equalTo("userId", userId);
      return query.first();
    }

    let resp = await userName();
    res.send({ posts: resp.attributes });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/userProfile", async (req, res) => {
  try {
    // query for user id, grab first entry
    Parse.User.enableUnsafeCurrentUser();
    const query = new Parse.Query(Parse.Object.extend("UserInfo"));
    query.equalTo("userId", req.body.userId);

    async function postsMatching(query) {
      query.equalTo("userId", req.body.userId);
      return query.count();
    }
    let resp = await postsMatching(query);
    let userInfo = [];
    if (resp > 0) {
      userInfo = await query.first();
    } else {
      const UserInfo = Parse.Object.extend("UserInfo");
      userInfo = new UserInfo();
    }
    userInfo.set({
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      height: req.body.height,
      weight: req.body.weight,
      gender: req.body.gender,
    });
    await userInfo.save();
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.post("/remove_rating", async (req, res) => {
  function postsMatching() {
    const Ratings = Parse.Object.extend("Ratings");
    const query = new Parse.Query(Ratings);
    query.equalTo("objectId", req.body.objectId);
    return query.first();
  }

  let resp = await postsMatching();
  resp.destroy();
  res.send({ message: "success!" });
});

app.post("/ratings", (req, res) => {
  try {
    var Ratings = Parse.Object.extend("Ratings");
    const ratings = new Ratings();
    ratings.set({
      Review: req.body.reviews,
      Rating: req.body.rating,
      UserId: req.body.user.user.objectId,
      ProductId: req.body.productId,
    });

    ratings.save();
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/ratings/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    function postsMatching() {
      var Ratings = Parse.Object.extend("Ratings");
      var query = new Parse.Query(Ratings);
      query.equalTo("ProductId", parseInt(productId));
      return query.find();
    }
    function countReviews() {
      var Ratings = Parse.Object.extend("Ratings");
      var query = new Parse.Query(Ratings);
      query.equalTo("ProductId", parseInt(productId));
      return query.count();
    }
    const counts = await countReviews();

    function userName(userId) {
      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
      query.equalTo("objectId", userId);
      return query.find();
    }
    const response = await postsMatching();
    // username, rating, review
    let avg = 0.0;
    const reviews = await Promise.all(
      response.map(async (element) => {
        avg += element.attributes.Rating;
        let resp = await userName(element.attributes.UserId);
        return {
          user: resp[0].attributes.username,
          rating: element.attributes.Rating,
          review: element.attributes.Review,
        };
      })
    );
    avg = avg / counts;
    res.send({ posts: reviews, count: counts, average: avg });
  } catch (error) {
    res.status(400);
    res.send({ error: error });
  }
});

app.get("/healthRatings/:productId/:userId", async (req, res) => {
  const { productId, userId } = req.params;
  let url = "https://api.nal.usda.gov/fdc/v1/foods/search";
  let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib";
  let columns = [
    "fat",
    "protein",
    "transFat",
    "saturatedFat",
    "calories",
    "sugar",
    "fiber",
  ];
  let better = ["+", "+", "-1", "-1", "-0", "-0", "+"];
  let weight = [1, 1, 0.25, 0.25, 0.5, 1, 1];
  let total_weight = 5;

  async function getProfileData() {
    let resp = await axios.get(`http://localhost:3001/userProfile/${userId}`);
    return resp.data.posts;
  }

  async function getData() {
    let response = await axios
      .get(
        `https://api.nal.usda.gov/fdc/v1/food/${productId}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        {
          headers: {
            Authorization: `api_key=${access_token}`,
          },
        }
      )
      .catch((err) => console.log(err));
    if (response) {
      return response.data;
    }
  }
  let product = await getData();

  let userInfo = [];
  if (userId != "undefined") {
    userInfo = await getProfileData();
  }

  if (Object.keys(product).length > 0) {
    let protein = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Protein"
    )?.amount;
    protein = protein === "undefined" ? 0 : protein;
    let carbohydrate = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Carbohydrate, by difference"
    )?.amount;
    carbohydrate = carbohydrate === "undefined" ? 0 : carbohydrate;
    let transFat = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Fatty acids, total trans"
    )?.amount;
    transFat = transFat === "undefined" ? 0 : transFat;
    let sugar = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Sugars, total including NLEA"
    )?.amount;
    sugar = sugar === "undefined" ? 0 : sugar;
    let fat = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Total lipid (fat)"
    )?.amount;
    fat = fat === "undefined" ? 0 : fat;
    let saturatedFat = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Fatty acids, total saturated"
    )?.amount;
    saturatedFat = saturatedFat === "undefined" ? 0 : saturatedFat;
    let calories = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Energy"
    )?.amount;
    calories = calories === "undefined" ? 0 : calories;
    let fiber = product?.foodNutrients?.find(
      (o) => o.nutrient.name === "Fiber, total dietary"
    )?.amount;
    fiber = fiber === "undefined" ? 0 : fiber;

    let nutrients = [
      fat,
      protein,
      transFat,
      saturatedFat,
      calories,
      sugar,
      fiber,
    ];

    if (userId == "undefined") {
      makeRatingProduct(nutrients);
    } else {
      makeSpecializedRatingProduct(nutrients);
    }

    async function makeSpecializedRatingProduct(nutrients) {
      let calories_user = 0;
      if (parseInt(userInfo.height) < 4) {
        if (parseInt(userInfo.weight) <= 165) {
          calories_user = 1600;
        } else {
          calories_user = 1800;
        }
      } else {
        if (parseInt(userInfo.weight) <= 200) {
          calories_user = 1800;
        } else {
          calories_user = 2000;
        }
      }
      if (userInfo.gender == "M") {
        calories_user += 300;
      }

      let dietary_information_user = {
        fat: calories_user * 0.03,
        protein: 0.36 * parseInt(userInfo.weight),
        transFat: 2,
        saturatedFat: calories_user * 0.05,
        calories: calories_user,
        sugar: [25, 36],
        fiber: [25, 38],
      };

      let rating_avg = 0;
      let rating = 0;
      nutrients.map((element, idx) => {
        if (better[idx] === "+") {
          let high_val = 0;
          if (userInfo.gender == "M") {
            high_val = 1;
          }
          let percentage = 0;
          if (Array.isArray(dietary_information_user[columns[idx]])) {
            percentage =
              (element / dietary_information_user[columns[idx]][high_val]) *
              100;
          } else {
            percentage =
              (element / dietary_information_user[columns[idx]]) * 100;
          }
          if (percentage < 10) {
            rating = 1;
          } else if (percentage >= 10 && percentage < 20) {
            rating = 2;
          } else if (percentage >= 20 && percentage < 30) {
            rating = 3;
          } else if (percentage >= 30 && percentage < 40) {
            rating = 4;
          } else {
            rating = 5;
          }
        } else if (better[idx] === "-1" || better[idx] === "-0") {
          let high_val = 0;
          if (userInfo.gender == "M") {
            high_val = 1;
          }
          let percentage = 0;
          if (Array.isArray(dietary_information_user[columns[idx]])) {
            percentage =
              (element / dietary_information_user[columns[idx]][high_val]) *
              100;
          } else {
            percentage =
              (element / dietary_information_user[columns[idx]]) * 100;
          }
          if (
            element > dietary_information_user[columns[idx]] ||
            percentage > 75
          ) {
            rating = 1;
          } else if (percentage > 60) {
            rating = 2;
          } else if (percentage > 40 && percentage <= 60) {
            rating = 3;
          } else if (percentage > 20 && percentage <= 40) {
            rating = 4;
          } else {
            rating = 5;
          }
        }

        rating_avg += weight[idx] * rating;
      });

      rating_avg = Math.round(rating_avg / total_weight);
      res.send({ posts: rating_avg });
    }
  }

  async function makeRatingProduct(nutrients) {
    let dietary_information = {
      fat: [44, 77],
      protein: [50, 175],
      transFat: [0, 2],
      saturatedFat: [0, 22],
      calories: [1000, 2000],
      sugar: [25, 36],
      fiber: [21, 38],
    };

    let rating_avg = 0;
    nutrients.map((element, idx) => {
      let rating = 0;
      // if good for you
      if (better[idx] === "+") {
        let high_val = 0; //deciding which upper bound to use
        if (element > dietary_information[columns[idx]][0]) {
          high_val = 1;
        }
        let percentage =
          (element / dietary_information[columns[idx]][high_val]) * 100;
        if (percentage < 10) {
          rating = 1;
        } else if (percentage >= 10 && percentage < 20) {
          rating = 2;
        } else if (percentage >= 20 && percentage < 30) {
          rating = 3;
        } else if (percentage >= 30 && percentage < 40) {
          rating = 4;
        } else {
          rating = 5;
        }
      } else if (better[idx] === "-1") {
        if (element > dietary_information[columns[idx]][1]) {
          rating = 1;
        } else {
          let percentage =
            (element / dietary_information[columns[idx]][1]) * 100;
          if (percentage > 60) {
            rating = 2;
          } else if (percentage > 40 && percentage <= 60) {
            rating = 3;
          } else if (percentage > 20 && percentage <= 40) {
            rating = 4;
          } else {
            rating = 5;
          }
        }
      } else if (better[idx] === "-0") {
        if (element > dietary_information[columns[idx]][1]) {
          rating = 1;
        } else {
          let percentage =
            (element / dietary_information[columns[idx]][0]) * 100;
          if (percentage > 60) {
            rating = 2;
          } else if (percentage > 40 && percentage <= 60) {
            rating = 3;
          } else if (percentage > 20 && percentage <= 40) {
            rating = 4;
          } else {
            rating = 5;
          }
        }
      }

      rating_avg += weight[idx] * rating;
    });

    rating_avg = Math.round(rating_avg / total_weight);

    res.send({ posts: rating_avg });
  }
});

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Header", "access-control-allow-methods");
  res.send(Parse.User.current());
});

app.listen(port, () => {
  console.log(`Parse Web Demo app listening on port ${port}`);
});
