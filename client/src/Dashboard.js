import React, { useState, useEffect } from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import { Container, Form } from "react-bootstrap";
import useAuth from "./useAuth";
import TrackSearchResults from "./TrackSearchResults";
import Player from "./Player";

const spotifyApi = new SpotifyWebApi({
    clientId: "85eb9f062c7c4989811515125e5cd676",
});

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");

    const chooseTrack = (track) => {
        setPlayingTrack(track)
        setSearch("");
        setLyrics("");
    }

    useEffect(() => {
        if (!playingTrack) return;
        
        axios.get("http://localhost:3001/lyrics", {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search).then((res) => {
            // ถ้า cancal = true return ออกเลย ไม่ผ่าน func ข้างล่าง
            if (cancel) return;
            setSearchResults(
                res.body.tracks.items.map((track) => {
                    const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                        // ใช้หลักการเดียวกับการหา min max
                        return image.height < smallest.height ? image : smallest;
                    }, track.album.images[0]);

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                    };
                })
            );
        });
        return () => (cancel = true);
    }, [search, accessToken]);

    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
            <Form.Control
                type="search"
                placeholder="Search Songs/Artists"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {searchResults.map(track => (
                    <TrackSearchResults track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {searchResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
        </Container>
    );
};

export default Dashboard;
