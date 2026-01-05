
function SearchBar({onTextChange, onSearch, keyword, recentSearches}) {
    const categories = ["Nature", "Food", "Cars", "Animals", "Space", "Anime"];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch()
    }

    return(
        <div className="search-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={keyword}
                    id="search-input"
                    placeholder="Search for images..."
                    onChange={(e) => onTextChange(e.target.value)}
                />
                <button onClick={onSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
            <div className="category-chips">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className="chip"
                        onClick={() => {
                            onTextChange(cat);
                            setTimeout(onSearch, 100);
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <span>Recent: </span>
                    {recentSearches.map((term, index) => (
                        <button
                            key={index}
                            className="recent-link"
                            onClick={() => {
                                onTextChange(term);
                                setTimeout(onSearch, 100);
                            }}
                        >
                            {term}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
export default SearchBar