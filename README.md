# theKnow

## Project Description: 

“The Know” (Name undecided) aims to keep consumers in the know about the products they’re buying, enabling them to make educated and responsible decisions with as much information as possible. For any product on the website, there will be ratings (developed from existing information and research) to quantify the health and sustainability of a product as well as the expensiveness of the product compared to similar products. Users will also be able to leave reviews and ratings on the product, and the average rating as well as their individual reviews will be available for other users to view, upvote, and comment on. The website asks users to make an account, where they’ll be able to keep track of their favorite products, get recommendations about products they may enjoy, and keep track of their ratings and reviews. Users will also be able to take a photo of a product label/enter some information to generate ratings and add to the list of products available on the site. Users will also be able to scan the label to search up the product. 

## Project Features:  
- User authentication, leaving ratings and reviews under products
- Searching up a product 
- Get ratings on products (health, expensiveness, sustainability) 
- Get recommendations on products they’ve enjoyed and previous purchases
- Scan the label to search up the product


## User Stories

As _someone_ I want to do _something_ in order to _something else_

1. As a consumer, I want to find the most inexpensive product of that kind so I can save money.
2. As a consumer, I want to find the most sustainable product of that kind so I can be environmentally conscious.
3. As a consumer, I want to find the best rated product of that kind so that I can be sure that I'm spending my money correctly.
4. As a consumer, I want to be able to leave reviews on products I liked and disliked to show other consumers my experience with the product.
5. As a consumer, I want to be able to view products that fit with my goals and be an educated consumer about what I use so I can better understand my impact on the world around me.
6. As a consumer, I want to understand my carbon footprint so I can make more educated decisions about where I should buy products from.
7. As a consumer, I want to understand how companies treat their workers and pick products from companies that I can support to be a more educated consumer. 
8. As a consumer, I want to make sure I understand all allergen information so that I don't have an allergic reaction to something.
9. As a consumer, I want to make sure the food I'm eating has no animal products so that I can adhere me diet best to my values. 
10. As a consumer, I want to have an easy way to view information about products that allows me to do less research for the same information.

## Endpoints
| HTTP Verb | Name             | Description                             | User stories         |
|-----------|------------------|-----------------------------------------|----------------------|
| POST      | user/product id  | liked product by user                   | 1,2,3,5,6,7,8,9,10   |
| DELETE    | user/product id  | remove like from product                | 1,2,3,5,6,7,8,9,10   |
| GET       | products         | display products                        | 1,2,3,4,5,6,7,8,9,10 |
| POST      | products/user id | new products added by users             | 10                   |
| PUT       | user/id          | update user profile                     | 1,2,3,4,5,6,7,8,9,10 |
| PUT       | rating/user id   | putting a rating associated with a user | 4                    |

## Pages/Screens on the app


### Loading Screen
![LogoName](https://user-images.githubusercontent.com/40477441/176319668-51f08426-ccf4-4671-aeaf-4e8737ce38ee.png)

### Main Page
![1](https://user-images.githubusercontent.com/40477441/176319641-311e4faf-6b33-4616-9f36-14a1e62af140.png)
![2](https://user-images.githubusercontent.com/40477441/176319656-5ae9ba82-a589-4c20-b1d5-b562bf64b121.png)

### Product Page
![1](https://user-images.githubusercontent.com/40477441/176319716-57d05b11-75ff-463d-8ec2-1cbcc802634b.png)
![2](https://user-images.githubusercontent.com/40477441/176319726-b512a59c-d025-4563-9a9d-bba635f9b28d.png)

### Sign-in Page
![LOGIN](https://user-images.githubusercontent.com/40477441/176319619-81169e91-3027-4254-a0d3-16203ca8db08.png)

### Purchase Page

