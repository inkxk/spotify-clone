const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.post("/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: "85eb9f062c7c4989811515125e5cd676",
        clientSecret: "a61bd34c3dba41e2814db2c5c83728f9",
    });

    spotifyApi
        .authorizationCodeGrant(code)
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expireIn: data.body.expires_in,
            });
        })
        .catch(() => {
            res.sendStatus(400);
        });
});