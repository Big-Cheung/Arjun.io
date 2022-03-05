import React from 'react'
import { RGBA_ASTC_10x10_Format } from 'three';

const testdata = [
  {username: 'name1', score: 10},
  {username: 'name2', score: 20},
  {username: 'name3', score: 30},
  {username: 'name4', score: 40},
  {username: 'name5', score: 50},
];

const leaderStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    float: "right",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  header: {
    fontWeight: "bold",
    fontSize: 15,
  },
  text: {
    fontSize: 11,
  },
  user: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    textAlign: "center",
    padding: 5,
  },
  rank: {
    paddingLeft: 5
  },
  username: {
    paddingLeft: 5
  },
  score: {
    paddingLeft: 5
  }
};

export default function Leaderboard() {
  let userlist = testdata.map((user, i) =>
  <User username={ user.username } rank={ i + 1 } score={ user.score } />
  );
  return (
    <div className="leadercontainer" style = { leaderStyles.container }>
      <LeaderboardTitle/>
      { userlist }
    </div>
  )
};

const LeaderboardTitle = () => {
  return (
    <div>
      <div className = "leaderheader" style={ leaderStyles.header }>Leaderboard</div>
    </div>
  )
};

const User = ({ rank, username, score}) => {
  return (
    <div className="leaderuser" style={ leaderStyles.user }>
      <div className="leaderrank" style={ leaderStyles.rank }>
        <div className="leadertext" style={ leaderStyles.text }>{ rank }</div>
      </div>
      <div className="leadername" style={ leaderStyles.username }> 
        <div className="leadertext" style={ leaderStyles.text }>{ username }</div>
      </div>
      <div className="leaderscore" style={ leaderStyles.score }>
        <div className="leadertext" style={ leaderStyles.text }>{ score }</div>
      </div>
    </div>
  )
};