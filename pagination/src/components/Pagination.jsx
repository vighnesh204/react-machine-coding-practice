import React from 'react'

const Pagination = ({ noOfPages, currentPage, setCurrentPage}) => {
      const handlePageChange = (n) => {
        setCurrentPage(n);
      }
    
      const goToPrevPage = () =>{
        setCurrentPage(prev => prev -1);
      }
    
      
      const goToNextPage = () =>{
        setCurrentPage(prev => prev + 1);
      }
    
  return (
    <div className="text-white text-center m-4 p-2 ">
        <button 
        disabled = {currentPage === 0} 
        className="px-3 py-2 rounded-lg border m-1 cursor-pointer" 
        onClick={()=> goToPrevPage()}
        >
          ◀️
        </button>

      {
        [...Array(noOfPages).keys()].map(n => <button key={n} className={`${n === currentPage && "bg-blue-500 font-semibold"} px-3 py-2 rounded-lg  border m-1 transition-all cursor-pointer`} onClick={()=> handlePageChange(n)}>{n}</button>)
      }

      <button disabled = {currentPage === noOfPages - 1} 
      className="px-3 py-2 rounded-lg  border m-1 cursor-pointer"
      onClick={()=> goToNextPage()}
      >
      ▶️
      </button>

    </div>
  )
}

export default Pagination