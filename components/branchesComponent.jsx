// components/BranchDropdown.js
import React from 'react';
import branches from '@/components/branches';

const BranchDropdown = ({ selectedBranch, setSelectedBranch }) => {
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedBranch(selectedValue);
        localStorage.setItem('selectedBranch', selectedValue);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="branch">
                Select Branch
            </label>
            <select
                name="branch"
                value={selectedBranch}
                onChange={handleSelectChange}
                className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="" disabled>Select a branch</option>
                {branches.map((branch, index) => (
                    <option key={index} value={branch}>{branch}</option>
                ))}
            </select>
        </div>
    );
};

export default BranchDropdown;
