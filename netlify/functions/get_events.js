const { GITHUB_PAT, NETLIFY_PAT, SITE_ID } = process.env;
import fetch from 'node-fetch';
import { Octokit } from "@octokit/core";
const octokit = new Octokit({ auth: GITHUB_PAT });

exports.handler = async (event, context) => {

    const { identity, user } = context.clientContext;

    const userResponse = await fetch('https://api.netlify.com/api/v1/user',{
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + NETLIFY_PAT
        },
    });
    const data = await userResponse.json();

    const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`,{
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + NETLIFY_PAT
        },
    });
    const siteData = await siteResponse.json();

    const githubRepo = siteData.build_settings.repo_path.split(`${data.slug}/`)[1];
    console.log("get events file");
    const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: data.slug,
        repo: githubRepo,
        path: 'post-pics-events.json',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    const eventsContent = Buffer.from(originalFile.data.content, "base64").toString();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': '*', 
        },
        body: eventsContent,
    };     
};