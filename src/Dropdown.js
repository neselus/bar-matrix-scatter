// Dropdown.js
import React from 'react';

const Dropdown = ({ options, onSelect }) => {
  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="variable-dropdown">Select Variable:</label>
      <select id="variable-dropdown" onChange={handleChange}>
        <option value="">Choose a variable</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
