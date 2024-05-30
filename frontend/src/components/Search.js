import React, { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Thêm logic tìm kiếm ở đây
    };

    return (
        <div>
            <h2>Tìm Kiếm Chứng Chỉ</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Tìm Kiếm:</label>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                    />
                </div>
                <button type="submit">Tìm Kiếm</button>
            </form>
        </div>
    );
};

export default Search;
