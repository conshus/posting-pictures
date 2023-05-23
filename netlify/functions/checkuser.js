import fetch from 'node-fetch';
// https://www.npmjs.com/package/node-fetch
const { PAT } = process.env;

exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;
    // const returnValue = user.email || "nothing";

    console.log("user: ", user);
    if (user){
        const response = await fetch('https://api.netlify.com/api/v1/user',{
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
        const data = await response.json();
        console.log("data: ", data);
        const userId = user.user_metadata.avatar_url.split('/u/')[1].split('?v=')[0];
        const dataId = data.avatar_url.split('/u/')[1].split('?v=')[0];
        console.log("userId: ", userId);
        console.log("dataId: ", dataId);
        if (user.app_metadata.provider === data.login_providers[0] && user.email === data.email && userId === dataId ){
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': '*', 
                },
                body: JSON.stringify({verified: true}),
            };    
        } else {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': '*', 
                },
                body: JSON.stringify({verified: false}),
            };    
        }
    
    }
    // Do stuff and return a response...
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': '*', 
        },
        body: JSON.stringify({verified: false}),
    };

};