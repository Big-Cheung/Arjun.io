import React from 'react';
import Button from '@material-ui/core/Button';

const Pagination = ({ usersPerPage, totalUsers, paginate}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className="pagination" style={paginateStyle.container}>
        {pageNumbers.map(number => (
          <div key={number} className="page-item" style={paginateStyle.pages}>
            <Button variant="outlined" 
              color="primary" onClick={() => paginate(number)} className='page-link'>
              {number}
            </Button>       
          </div>
        ))}
      </div>
    </nav>
  )
}

const paginateStyle = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  pages: {
    alignItems: "center",
    color: "black",
    float: "center",
    // paddingTop: 8,
    // paddingLeft: 12,
    // paddingRight: 12,
    // paddingBottom: 8,
    // textDecoration: "none",
    // borderWidth: 1,
    // borderStyle: "solid",
    // fontSize: 16,
  },
}
export default Pagination