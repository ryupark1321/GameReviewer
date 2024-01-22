import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1> SteawmReviewAI </h1>
      <Link to="/games">
        <span>All Games</span>
      </Link>
      <h3> Welcome to SteamReviewAI page.</h3> 
      <p> We provide information about games on steam and an AI-based summary of the most popular steam reviews. </p>
    </div>  
  );
};

export default Home;