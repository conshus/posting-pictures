const { GITHUB_PAT, NETLIFY_PAT, SITE_ID } = process.env;
import fetch from 'node-fetch';
import { Octokit } from "@octokit/core";
const octokit = new Octokit({ auth: GITHUB_PAT });

exports.handler = async (event, context) => {

    const { identity, user } = context.clientContext;

    if (user){
        const userResponse = await fetch('https://api.netlify.com/api/v1/user',{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + NETLIFY_PAT
            },
        });
        const data = await userResponse.json();
        const userId = user.user_metadata.avatar_url.split('/u/')[1].split('?v=')[0];
        const dataId = data.avatar_url.split('/u/')[1].split('?v=')[0];

        const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + NETLIFY_PAT
            },
        });
        const siteData = await siteResponse.json();
        const githubRepo = siteData.build_settings.repo_path.split(`${data.slug}/`)[1];

        if (user.app_metadata.provider === data.login_providers[0] && user.email === data.email && userId === dataId ){
            const base64updatedLatestPicsContents = Buffer.from(event.body).toString('base64');

            console.log("get latest pics file");
            const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: data.slug,
                repo: githubRepo,
                path: 'post-pics-latest-pics.json',
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            console.log("get sha");
            const originalFileSHA = originalFile.data.sha;

            console.log("update latest pics file");
            // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: data.slug,
                repo: githubRepo,
                path: 'post-pics-latest-pics.json',
                message: `updating 'post-pics-latest-pics.json' - ${Date.now()}`,
                committer: {
                  name: user.user_metadata.full_name,
                  email: user.email
                },
                content: base64updatedLatestPicsContents,
                sha: originalFileSHA,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': '*', 
                },
                body: JSON.stringify({status: 'Success'}),
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
    
    } else {
        // Not authorized
        return {
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from anywhere 
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': '*', 
            },
            body: JSON.stringify({status: 'Not Authorized!'}),
        };
    }
    
};