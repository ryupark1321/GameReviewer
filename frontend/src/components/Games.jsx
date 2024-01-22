import React from 'react';
import { Link } from 'react-router-dom'

const Games = ({ games: Array }) => {  
  return (
    <div>
      <h1>All Games</h1>
      { 
        (games.length === 0) ? (<h2> Loading.... </h2>) :  
          (<tbody>
          {
            games.map((game) => 
              <Link to={"/games/"+ game['appid']}>
                <p> { game['name'] } </p>
              </Link>
            )
          } 
          </tbody>)
      }
      
    </div>
  );
};

export default Games;