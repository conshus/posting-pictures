import fetch from 'node-fetch';
// https://www.npmjs.com/package/node-fetch
const { NETLIFY_PAT } = process.env;

exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;
    if (user){
        const response = await fetch('https://api.netlify.com/api/v1/user',{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + NETLIFY_PAT
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
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': '*', 
        },
        body: JSON.stringify({status: 'Not Authorized!'}),
    };

};