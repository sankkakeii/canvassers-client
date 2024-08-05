import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handleClick(i)}
                    className={`mx-1 px-2 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => handleClick(currentPage - 1)}
                className="mx-1 px-2 py-1 rounded bg-gray-200"
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handleClick(currentPage + 1)}
                className="mx-1 px-2 py-1 rounded bg-gray-200"
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
