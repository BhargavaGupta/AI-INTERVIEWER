// src/components/VideoPreview.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const VideoPreview = () => {
    const location = useLocation();
    const { videoURL } = location.state || {};

    if (!videoURL) {
        return <div>No video to display</div>;
    }

    return (
        <div>
            <h1>Video Preview</h1>
            <video src={videoURL} controls className="video-output" />
        </div>
    );
};

export default VideoPreview;
