const { GITHUB_PAT, PAT, SITE_ID } = process.env;
import fetch from 'node-fetch';
// const querystring = require("querystring");
// import querystring from "querystring";
import { Octokit } from "@octokit/core";
const octokit = new Octokit({ auth: GITHUB_PAT });
// const fs = require('fs');
// const cloudinary = require('cloudinary').v2;
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: 'dwane',
//   api_key: '732652697931981',
//   api_secret: 'LC8tU-vQCWPaK7_vnpPzxWbl9mg'
// });


exports.handler = async (event, context) => {

    const { identity, user } = context.clientContext;

    // console.log("process.env: ", process.env);
    // const returnValue = user.email || "nothing";

    // console.log("querystring.parse(event.body): ", querystring.parse(event.body));
    // console.log("event.body: ", event.body);
    // const params = JSON.parse(event.body);
    // console.log("params.name: ", params.name);

    // console.log("name: ", name);
    // console.log("identity: ", identity);
    // console.log("user: ", user);

    // console.log("context: ", context);

    // if (user){
        const userResponse = await fetch('https://api.netlify.com/api/v1/user',{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                // "User-Agent": "MyApp (YOUR_NAME@EXAMPLE.COM)",
                // 'Authorization': 'Bearer ' + "QX27v2jCdNZlAamPQaru1u0JjDF440uF-EgWUlnlBlA"
                'Authorization': 'Bearer ' + PAT
                // 'Authorization': 'Bearer ' + "Zr20wX4I6jleYD61COTHLvZWdCfjFxQy8-NyVTnIFBk"
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = await userResponse.json();
        // console.log("user data: ", data);
        // const userId = user.user_metadata.avatar_url.split('/u/')[1].split('?v=')[0];
        // const dataId = data.avatar_url.split('/u/')[1].split('?v=')[0];
        // console.log("userId: ", userId);
        // console.log("dataId: ", dataId);

        const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                // "User-Agent": "MyApp (YOUR_NAME@EXAMPLE.COM)",
                // 'Authorization': 'Bearer ' + "QX27v2jCdNZlAamPQaru1u0JjDF440uF-EgWUlnlBlA"
                'Authorization': 'Bearer ' + PAT
                // 'Authorization': 'Bearer ' + "Zr20wX4I6jleYD61COTHLvZWdCfjFxQy8-NyVTnIFBk"
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const siteData = await siteResponse.json();
        // console.log("siteData: ", siteData.build_settings.repo_path);
        const githubRepo = siteData.build_settings.repo_path.split(`${data.slug}/`)[1];
        // console.log("githubRepo: ", githubRepo);


        // if (user.app_metadata.provider === data.login_providers[0] && user.email === data.email && userId === dataId ){
            // Authorized
            console.log("convert data to base64");
            const newSettings = {
                name: 'John Doe',
                age: 30,
                email: 'johndoe@example.com'
            };
            // const base64newSettings = Buffer.from(JSON.stringify(newSettings)).toString('base64');
            // console.log("event.body: ", event.body);
            // const base64newSettings = Buffer.from(event.body).toString('base64');

            // console.log("base64newSettings: ", base64newSettings);

            console.log("get settings file");
            const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: data.slug,
                repo: githubRepo,
                path: 'post-pics-settings.json',
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            // console.log("originalFile: ",originalFile);

            const settingsContent = Buffer.from(originalFile.data.content, "base64").toString();
            // console.log("get sha");
            // const originalFileSHA = originalFile.data.sha;

            // console.log("update file with new data");
            // await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            //     owner: data.slug,
            //     repo: githubRepo,
            //     path: 'post-pics-settings.json',
            //     message: `updates settings - ${Date.now()}`,
            //     committer: {
            //       name: user.user_metadata.full_name,
            //       email: user.email
            //     },
            //     content: base64newSettings,
            //     sha: originalFileSHA,
            //     headers: {
            //       'X-GitHub-Api-Version': '2022-11-28'
            //     }
            // });

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': '*', 
                },
                body: settingsContent,
            };    
        // } else {
        //     return {
        //         statusCode: 200,
        //         headers: {
        //             "Access-Control-Allow-Origin": "*", // Allow from anywhere
        //             'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        //             'Access-Control-Allow-Methods': '*', 
        //         },
        //         body: JSON.stringify({verified: false}),
        //     };    
        // }
    
    // } else {
    //     // Not authorized
    //     return {
    //         statusCode: 401,
    //         headers: {
    //             "Access-Control-Allow-Origin": "*", // Allow from anywhere 
    //             'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //             'Access-Control-Allow-Methods': '*', 
    //         },
    //         body: JSON.stringify({status: 'Not Authorized!'}),
    //     };
    // }

    
};