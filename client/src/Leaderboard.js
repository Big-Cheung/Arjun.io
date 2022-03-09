import React from 'react';
import Pagination from './Pagination';

// testdata to be removed later
const origdata = [
  {username: 'name1', score: 10},
  {username: 'name2', score: 20},
  {username: 'name3', score: 30},
  {username: 'name4', score: 40},
  {username: 'name5', score: 50},
  {username: 'name6', score: 60},
  {username: 'name7', score: 70},
  {username: 'name8', score: 80},
  {username: 'name9', score: 90},
  {username: 'name10', score: 100},
  {username: 'name11', score: 110},
  {username: 'name12', score: 120},
  {username: 'name13', score: 130},
  {username: 'name14', score: 140},
  {username: 'name15', score: 150},
  {username: 'name16', score: 160},
  {username: 'name17', score: 170},
  {username: 'name18', score: 180},
  {username: 'name19', score: 190},
  {username: 'name20', score: 200},
];

const testdata = origdata.sort((a, b) => b.score - a.score).map((item, i) => {
    item.rank = i + 1;
    return item;
});

export default function Leaderboard() {
  
  // Leaderboard Button
  const [open, setOpen] = React.useState(false);

  // Process Data
  let sorted = testdata.sort((a, b) => b.score - a.score);
  let userlist = sorted.map((user, i) =>
  <User username={user.username} rank={user.rank} score={user.score} />
  );
  const [indexOfLastUser, setLastIdx] = React.useState(0);
  const [indexOfFirstUser, setFirstIdx] = React.useState(10);  // Search
  const [searchlist, setSearchList] = React.useState(userlist);
  let page_number = 0;
  const searchData = (query) => {
    if (query !== undefined) {
      setSearchList(testdata
        .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
        .map((user, i) =>
        <User username={user.username} rank={user.rank} score={user.score} />));
    } else setSearchList(testdata)
  }

  const sliceSearchList = (a, b, c) => {
      if (b < a.length)
        return a.slice(b, c);
      else
        return a
  }

  // Pagination
  const usersPerPage = 10;
  const paginate = (pageNumber) => {
    setLastIdx((pageNumber -1 ) * usersPerPage);
    setFirstIdx(((pageNumber -1 ) * usersPerPage) + usersPerPage);
  }
  
  return (
    <React.Fragment>
      <div className="minimized-container" style={minimizedStyle.container}>
        <button className = "leaderboard-button" onClick={() => setOpen(!open)} data-toggle = "modal" style={minimizedStyle.header}>Leaderboard</button>     
        {userlist.slice(0, 5)}
      </div>
      {open && (
        <div className="expanded-container" style={expandedStyle.container}>
          <div className="expanded-header" style={expandedStyle.header}>Leaderboard</div>
          <input type="text" placeholder="Search..." onChange={event => {searchData(event.target.value)}}/>
          <ColumnHeader/>
          {sliceSearchList(searchlist, indexOfLastUser, indexOfFirstUser)}
          <Pagination usersPerPage={usersPerPage} totalUsers={searchlist.length} paginate={paginate}/>
        </div>
      )}
    </React.Fragment>   
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

const ColumnHeader = () => {
  return(
    <div className="col-header" style={expandedStyle.colheader}>
      <div className="col-rank" style={expandedStyle.colrank}>
        <div className="expanded-text" style={expandedStyle.coltext}>#</div>
      </div>
      <div className="col-name" style={expandedStyle.colname}>
        <div className="expanded-text" style={expandedStyle.coltext}>Name</div>
      </div>
      <div className="col-score" style={expandedStyle.colscore}>
        <div className="expanded-text" style={expandedStyle.coltext}>Score</div>
      </div>
  </div>
  ) 
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
    position: "fixed",
    top: "100px",
    right: "10px"
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
  },
};

const expandedStyle = {
  container: {
    backgroundColor: "white",
    height: 400,
    width: 400,
    margin: "auto",
    top: 100,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  text: {
    fontSize: 11,
  },
  colheader: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    textAlign: "center",
  },
  colrank: {
    paddingLeft: 5,
  },
  colname: {
    paddingLeft: 5,
  },
  colscore: {
    paddingLeft: 5,
  },
  coltext: {
    fontSize: 20,
  }
}