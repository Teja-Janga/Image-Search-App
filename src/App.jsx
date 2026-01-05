
import { useEffect, useState, useRef, useCallback } from "react";
import SearchBar from "./SearchBar";
import Result from "./Result";

const API_KEY = import.meta.env.VITE_UNSPLASH_KEY;

function App() {
    const [theme, setTheme] = useState("dark");
    const [keyword, setKeyword] = useState("");
    const [pageNum, setPage] = useState(1);
    const [result, setResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(null);

    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem("recentSearches");
        return saved ? JSON.parse(saved) : [];
    });
/* --------------------- Intersection - Obseerver ---------------------- */
    const observer = useRef();
    const lastImageElementRef = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && result.length > 0) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if(node) observer.current.observe(node);
    }, [loading, result.length]);

    const handleTextChange = (value) => {
        setKeyword(value);
        if(!value.trim()) return;
    }
/* ------------------------- handleSearch() --------------------------- */
    const handleSearch = async (resetPage = false) => {
        const currentQuery = resetPage ? keyword : searchQuery;
        const targetPage = resetPage ? 1 : pageNum;
        setLoading(true);
        setNoResults(false);
        if(!currentQuery.trim()) return;
        const URL = `https://api.unsplash.com/search/photos?page=${targetPage}&query=${currentQuery}&client_id=${API_KEY}`;
        
        try {
            const response = await fetch(URL);
            if(!response.ok) throw new Error("Data Not Found");
            const data = await response.json();

            if(data.results.length === 0) {
                setSearchQuery(currentQuery);
                setNoResults(true);
                setResult([]);
            }
            else {
                if (resetPage) {
                    setResult(data.results);
                    setSearchQuery(keyword);
                    setKeyword("");
                    setRecentSearches((prev) => {
                        const updated = [currentQuery, ...prev.filter(k => k !== currentQuery)].slice(0, 5);
                        localStorage.setItem("recentSearches", JSON.stringify(updated));
                        return updated;
                    });
                } else {
                    setResult((prev) => [...prev, ...data.results]);
                }
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
/* -------------------------------------------------------------------------- */
    useEffect(() => {
        if(pageNum > 1) handleSearch(false);
    }, [pageNum]);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
    }
    console.log(searchQuery);
/* --------------------------- return statement ---------------------------- */
    return(
        <div className={`main ${theme}`}>
            <div className="head">
                <h1>ImageSearch</h1>
                <button onClick={toggleTheme}>
                    {theme === "light" ? "🌙" : "🔆"}
                </button>
            </div>
            <SearchBar
                onTextChange={handleTextChange}
                onSearch={() => {setPage(1); handleSearch(true); }}
                keyword={keyword}
                recentSearches={recentSearches}
            />

            {noResults && (
                <div className="error-container">
                    <img
                        src="src/assets/Error.jpg"
                        alt="No Results Found"
                        className="error-image"
                    />
                    <h3>Oops! We couldn't find anything for "{searchQuery}"</h3>
                    <p>Try searching for something else like "Nature" or "Space".</p>
                </div>
            )}
            
            {error && <p className="error">{error}</p>}

            <div id="result">         
                {result.map((item, index) => {
                    if(result.length === index + 1) {
                        return (
                            <div ref={lastImageElementRef} key={item.id}>
                                <Result item={item} />
                            </div>
                        );
                    }
                    else {
                        return <Result key={item.id} item={item} />
                    } 
                })}

                {loading && pageNum === 1 &&
                    [...Array(8)].map((_, i) => 
                        <div key={i} className="skeleton-card"></div>
                    )
                }
            </div>
        </div>
    );
}

export default App
