const Filter = ({ filter, onFilterChange }) => {
    return (
      <div>
        <input
          type="text"
          placeholder="Search names..."
          value={filter}
          onChange={onFilterChange}
        />
      </div>
    );
  };
  
  export default Filter;
  