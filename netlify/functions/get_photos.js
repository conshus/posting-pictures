const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } = process.env;
// const cloudinary = require('cloudinary').v2;


// Configuration 
// cloudinary.config({
//   cloud_name: CLOUDINARY_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET
// });

import fetch from 'node-fetch';

const API_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/resources/search`;

exports.handler = async (event, context) => {
  console.log("event.body: ", event.body);
    const searchParams = {
        "expression": "dog",
        "with_field": ["context", "tags"],
        "max_results": 10
      };
  return fetch(API_ENDPOINT, 
    {
        method: 'POST', 
        headers: { "Authorization":`${Buffer.from(CLOUDINARY_API_KEY + ':' + CLOUDINARY_API_SECRET, "binary").toString("base64")}`,"Content-Type": "application/json" }, 
        // body: JSON.stringify(searchParams)
        body: event.body
    })
    .then((response) => response.json())
    .then((data) => ({
      statusCode: 200,
      body: JSON.stringify(data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));

  // return cloudinary.v2.search
  // .expression('cat')
  // .with_field('context')
  // .with_field('tags')
  // .max_results(10)
  // .execute()
  // .then((result) =>{
  //   console.log(result);
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(result),
  //   }
  // });

};