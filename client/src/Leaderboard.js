import React from 'react'
import { RGBA_ASTC_10x10_Format } from 'three';

// testdata to be removed later
const testdata = [
  {username: 'name1', score: 10},
  {username: 'name2', score: 20},
  {username: 'name3', score: 30},
  {username: 'name4', score: 40},
  {username: 'name5', score: 50},
];

// Minimized Leaderboard
export default function Leaderboard() {
  let sorted = testdata.sort((a, b) => b.score - a.score);
  let userlist = sorted.map((user, i) =>
  <User username={user.username} rank={i + 1} score={user.score} />
  );
  return (
    <div className="minimized-container" style = {minimizedStyle.container}>
      <LeaderboardButton/>      
      {userlist.slice(0, 5)}
    </div>
  )
};

const LeaderboardButton = () => {
  return (
    <button className = "leaderboard-button" onClick={handleClick} style={minimizedStyle.header}>Leaderboard</button>
  )
};

const User = ({ rank, username, score}) => {
  return (
    <div className="minimized-user" style={minimizedStyle.user}>
      <div className="minimized-rank" style={minimizedStyle.rank}>
        <div className="minimized-text" style={minimizedStyle.text}>{rank}</div>
      </div>
      <div className="minimized-name" style={minimizedStyle.username}> 
        <div className="minimized-text" style={minimizedStyle.text}>{username}</div>
      </div>
      <div className="minimized-score" style={minimizedStyle.score}>
        <div className="minimized-text" style={minimizedStyle.text}>{score}</div>
      </div>
    </div>
  )
};

const handleClick = () => {
    console.log("works");
}
const minimizedStyle = {
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
      backgroundColor: "transparent",
      textAlign: "center",
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
      paddingLeft: 5,
    },
    username: {
      paddingLeft: 5,
    },
    score: {
      paddingLeft: 5,
    }
  };