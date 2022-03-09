import * as React from 'react';
import Pagination from './Pagination';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
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
        <Button className = "leaderboard-button" onClick={() => setOpen(!open)} data-toggle = "modal" style={minimizedStyle.header}>Leaderboard</Button>     
        {userlist.slice(0, 5)}
      </div>
      {open && (
        <div className="expanded-container" style={expandedStyle.container}>
          <div className="expanded-header" style={expandedStyle.header}>Leaderboard</div>
          <TextField type="text" margin="dense" placeholder="Search..." style={minimizedStyle.score} onChange={event => {searchData(event.target.value)}}/>
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
    <div>
{/* <div className="minimized-user" style={minimizedStyle.user}>
      <div className="minimized-rank" style={minimizedStyle.rank}>
        <div className="minimized-text" style={minimizedStyle.text}>{rank}</div>
      </div>
      <div className="minimized-name" style={minimizedStyle.username}> 
        <div className="minimized-text" style={minimizedStyle.text}>{username}</div>
      </div>
      <div className="minimized-score" style={minimizedStyle.score}>
        <div className="minimized-text" style={minimizedStyle.text}>{score}</div>
      </div>
      
    </div> */}
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
            <td style={expandedStyle.column}>{score}</td>
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
  score: {
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
  colscore: {
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