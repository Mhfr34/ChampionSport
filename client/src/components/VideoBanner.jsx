import React from 'react'
import VideoBg from "../utils/videos/banner..mp4"
const VideoBanner = () => {
  return (
    <div className="main">
      <video src={VideoBg} autoPlay loop muted/>
    </div>
  )
}

export default VideoBanner
