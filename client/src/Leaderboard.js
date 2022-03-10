import * as React from 'react';
import Pagination from './Pagination';
import { listen } from './events.js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

export default function Leaderboard() {
  const theme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "*::-webkit-scrollbar": {
            width: "10px"
          },
          "*::-webkit-scrollbar-track": {
            background: "#E4EFEF"
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#1D388F61",
            borderRadius: "2px"
          }
        }
      }
    }
  });

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
          {currentdata}
        </div>   
      </div>
      {open && (
        <div className="expanded-container" style={expandedStyle.container}>
          <div className="expanded-header" style={expandedStyle.header}>Leaderboard</div>
          <TextField type="text" margin="dense" placeholder="Search..." style={minimizedStyle.points} onChange={event => {searchData(event.target.value)}}/>
          <ColumnHeader/>
          {sliceSearchList(searchlist, indexOfLastUser, indexOfFirstUser)}
          <Pagination usersPerPage={usersPerPage} totalUsers={searchlist.length} paginate={paginate}/>
        </div>
      )}
    </React.Fragment>   
  )
};

const CurrentUser = ({ rank, username, points, team }) => {
  return (
    <div>
      <Box component="span" sx={{ display: 'block',p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.775rem',
          fontWeight: '700'}}>
          <table style={expandedStyle.table}>
            <tr style={expandedStyle.row}> 
            <td style={{color: team === 1 ? "Blue" : "Red"}}>{rank}</td>
            <td style={{color: team === 1 ? "Blue" : "Red"}}>{username}</td>
            <td style={{color: team === 1 ? "Blue" : "Red"}}>{points}</td>
            </tr>
          </table>
      </Box>
    </div>
  )
};

const User = ({ rank, username, points, games, wins }) => {
  return (
    <div>
    <Box component="span" sx={{ display: 'block',p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.775rem',
          fontWeight: '700'}}>
          <table style={expandedStyle.table}>
            <tr style={expandedStyle.row}> 
            <td style={expandedStyle.column}>{rank}</td>
            <td style={expandedStyle.column}>{username}</td>
            <td style={expandedStyle.column}>{points}</td>
            <td style={expandedStyle.column}>{games}</td>
            <td style={expandedStyle.column}>{wins}</td>
            </tr>
          </table>
          </Box>
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
      <div className="col-score" style={expandedStyle.colpoints}>
        <div className="expanded-text" style={expandedStyle.coltext}>Points</div>
      </div>
      <div className="col-score" style={expandedStyle.colpoints}>
        <div className="expanded-text" style={expandedStyle.coltext}>Games</div>
      </div>
      <div className="col-score" style={expandedStyle.colpoints}>
        <div className="expanded-text" style={expandedStyle.coltext}>Wins</div>
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
    backgroundColor: "rgba(8, 99, 193, 0.2)",
    position: "fixed",
    top: "100px",
    right: "10px",
  },
  header: {
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: "rgb(66, 141, 211)",
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
  points: {
    paddingLeft: 5,
  },
  
};

const expandedStyle = {
  container: {
    
    width: 400,
    margin: "auto",
    top: 100,
    backgroundColor: "rgb(113, 183, 227)",
    position: "fixed",
    top: "20px",
    right: "37%",

  },
  header: {
    fontWeight: "bold",
    fontSize: 27,
    textAlign: "center",
    padding: "10px",
    backgroundColor: "rgb(66, 141, 211)"
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
  colpoints: {
    paddingLeft: 5,
  },
  coltext: {
    fontSize: 20,
    fontFamily: "Roboto"
  },
  table: {
    display: "flex",
    width: "100%",
  },
  column: {
  },
  row: {
    alignItems: "left",
  }
}