import React from "react";

const TrackSearchResults = ({ track, chooseTrack }) => {
    return (
        <div className="d-flex m-2 align-items-center" style={{ cursor: "pointer" }} onClick={() => chooseTrack(track)}>
            <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} alt="album cover" />
            <div className="ms-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    );
};

export default TrackSearchResults;
