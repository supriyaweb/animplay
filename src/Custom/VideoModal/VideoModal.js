import React from "react";
import "./VideoModal.css";


const VideoModal = ({ animnum, videoUrl, closeModal }) => {

  return (
    <div className="modal"  style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="animnum">{animnum}</span>
        <span className="close" onClick={closeModal}>&times;</span>
        <iframe
          width="100%"  // Adjust the width to fit the modal
          height="315"  // Automatically adjust the height
          src={videoUrl}
          title="YouTube video player"
          frameborder="0"
          mute="true"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;
