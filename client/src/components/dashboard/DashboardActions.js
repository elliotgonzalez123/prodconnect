import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
  return (
    <div class="dash-buttons">
      <Link to="/edit-profile" class="btn btn-light">
        <i class="fas fa-user-circle text-primary"></i> Edit Profile
      </Link>
      <Link to="/add-experience" class="btn btn-light">
        <i class="fab fa-black-tie text-primary"></i> Add Experience
      </Link>
      <Link to="/add-credits" class="btn btn-light">
        <i class="fa fa-film  text-primary"></i> Add Production Credits
      </Link>
    </div>
  );
};

export default DashboardActions;
