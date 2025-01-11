const SearchBar = () => {
    return (
      <div className="max-w-2xl mx-auto my-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search...."
            className="w-full px-4 py-2 rounded-lg bg-gray-100"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-400 text-white px-4 py-1 rounded-lg">
            Search
          </button>
        </div>
      </div>
    );
  };
  export default SearchBar
  