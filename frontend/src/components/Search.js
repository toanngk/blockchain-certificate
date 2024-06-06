import React, { useState } from 'react';
import '../style/Search.css'; // Import the CSS file for styling

const Search = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Thêm logic tìm kiếm ở đây
    };

    return (
        <div className="search-container">
            <div className="search-form">
                <h2>Tìm Kiếm Chứng Chỉ</h2>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Tìm Kiếm:</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Tìm Kiếm</button>
                </form>
            </div>
        </div>
    );
};

export default Search;
