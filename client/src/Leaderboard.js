import * as React from 'react';
import Pagination from './Pagination';
import { listen } from './events.js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function Leaderboard() {

  // Leaderboard Button
  const [open, setOpen] = React.useState(false);

  // Fetch current game data
  const [currentdata, setCurrentData] = React.useState();
  React.useEffect(() => {
    listen("updateScores", (e) => { 
      setCurrentData(getMax(e)
        .map((user) =>
          <CurrentUser username={user[0]} rank={e.indexOf(user) + 1} points={user[1]} team={user[2]} />
      ));
    })
  }, []);

  // O(N) find current top 5 players
  function getMax(array) {
    if (array.length <= 5) {
      return array.sort((a, b) => {return b[1] - a[1]});
    }
    let max = array.slice(0, 5);
    max.sort((a, b) => {return b[1] - a[1]});

    for (let i = 5; i < array.length; i++) {
      if (array[i][1] > max[4][1]) {
        max[0] = array[i];
        max.sort((a, b) => {return b[1] - a[1]});
      }
    }
    return max;
  }

  // Fetch All Leaderboard Data
  const [userdata, setUserdata] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:3001/leaderboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          },
      })
      .then((response) => response.json())
      .then((users) => setUserdata(users));
  }, [open]);

  // Process and update data
  const [indexOfLastUser, setLastIdx] = React.useState(0);
  const [indexOfFirstUser, setFirstIdx] = React.useState(10);
  const [searchlist, setSearchList] = React.useState();

  React.useEffect(() => {
    let expandedlist = userdata.map((user) =>
      <User username={user[1]} rank={userdata.indexOf(user) + 1} points={user[0]} games={user[2]} wins={user[3]} />
    );
    setSearchList(expandedlist);
  }, [userdata])

  // Search
  const searchData = (query) => {
    if (query !== undefined) {
      setSearchList(userdata
        .filter(user => user[1].toLowerCase().includes(query.toLowerCase()))
        .map((user) =>
        <User username={user[1]} rank={userdata.indexOf(user) + 1} points={user[0]} games={user[2]} wins={user[3]} />));
    } else setSearchList(userdata)
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
  
  // UI
  return (
    <React.Fragment>
      <div className="minimized-container" style={minimizedStyle.container}>
        <Button className = "leaderboard-button" onClick={() => setOpen(!open)} data-toggle = "modal" style={minimizedStyle.header}>Leaderboard</Button>
        <div>
          <table>
            <tbody>

              {currentdata}
            </tbody>
          </table>
        </div>   
      </div>
      {open && (
        <div className="expanded-container" style={expandedStyle.container}>
          <div className="expanded-header" style={expandedStyle.header}>Leaderboard</div>
          <TextField type="text" margin="dense" placeholder="Search..." style={expandedStyle.search} onChange={event => {searchData(event.target.value)}}/>
          
          <div style={{padding: 5}}>
            <table style={
              {    
                border: "1px solid black",
                borderCollapse: "collapse",
              }} width="100%">
                  <colgroup>
                    <col span="1" style={{width: "5%"}}/>
                    <col span="1" style={{width: "50%"}}/>
                    <col span="1" style={{width: "15%"}}/>                    
                    <col span="1" style={{width: "15%"}}/>
                    <col span="1" style={{width: "15%"}}/>
                  </colgroup>
                <tbody>
                  <tr style={
                  {    
                    border: "1px solid black",
                    borderCollapse: "collapse",
                                }}>
                    <th>#</th>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Games</th>
                    <th>Wins</th>
                  </tr>
                  {sliceSearchList(searchlist, indexOfLastUser, indexOfFirstUser)}  
                </tbody>
            </table> 
            <div style={{paddingTop: 5}}>
              <Pagination usersPerPage={usersPerPage} totalUsers={searchlist.length} paginate={paginate} style={expandedStyle.paginate}/>
            </div>
          </div>  
        </div>
      )}
    </React.Fragment>   
  )
};

// Current Leaderboard
const CurrentUser = ({ rank, username, points, team }) => {
  return (
    <tr style={minimizedStyle.row}> 
      <td style={{color: team === 1 ? "#f24ef2" : "#5bc4fc", paddingTop: 5, paddingBottom: 5, fontSize: 15, fontFamily: "Consolas"}}>{rank}</td>
      <td style={{color: team === 1 ? "#f24ef2" : "#5bc4fc", paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 15, fontFamily: "Consolas"}}>{username}</td>
      <td style={{color: team === 1 ? "#f24ef2" : "#5bc4fc", paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 15, fontFamily: "Consolas"}}>{points}</td>
    </tr>
  )
};

// Total Leaderboard
const User = ({ rank, username, points, games, wins }) => {
  return (   
    <tr style={expandedStyle.row}> 
      <td style={expandedStyle.text}>{rank}</td>
      <td style={expandedStyle.text}>{username}</td>
      <td style={expandedStyle.text}>{points}</td>
      <td style={expandedStyle.text}>{games}</td>
      <td style={expandedStyle.text}>{wins}</td>
    </tr>  
  )
};

const minimizedStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    float: "right",
    backgroundColor: "rgba(8, 99, 193, 0.2)",
    position: "fixed",
    top: 0,
    right: 0,
  },
  header: {
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: "rgb(66, 141, 211)",
    textAlign: "center",
    fontFamily: "Consolas"
  },
  row: {
    alignItems: "left",
    background: "transparent",
  },
};

const expandedStyle = {
  container: {
    width: 400,
    margin: "auto",
    top: 100,
    backgroundColor: "rgb(113, 183, 227)",
    position: "fixed",
    top: 100,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
  },
  search: {
    paddingLeft: 5,
    paddingRight: 5,
    width: "100%",
    fontFamily: "Consolas"
  },
  header: {
    fontWeight: "bold",
    fontSize: 27,
    textAlign: "center",
    padding: 10,
    backgroundColor: "rgb(66, 141, 211)",
    borderRadius: "10px 10px 0px 0px",
    fontFamily: "Consolas"
  },
  text: {
  },
  paginate: {
    paddingTop: 5,
  }
}