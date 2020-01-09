import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getYoutubeVideos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileYoutube = ({ getYoutubeVideos, username, videos }) => {
  useEffect(() => {
    getYoutubeVideos(username);
  }, [getYoutubeVideos, username]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Youtube Videos / Portfolio</h2>
      {videos === null ? (
        <Spinner />
      ) : (
        // <div>
        //   hello
        //   {videos.data && console.log(videos.data.items[0].snippet.title)}
        // </div>
        videos.data &&
        videos.data.items.map(video => (
          <div key={video.id} className="repo bg-white p-1 my-1">
            <div>
              <h4>{video.snippet.title}</h4>
              <p>{video.snippet.description}</p>
            </div>
            <div>
              <iframe
                width="284"
                height="160"
                src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title={video.snippet.title}
              ></iframe>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileYoutube.propTypes = {
  videos: PropTypes.object.isRequired,
  getYoutubeVideos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ videos: state.profile.videos });

export default connect(mapStateToProps, { getYoutubeVideos })(ProfileYoutube);
