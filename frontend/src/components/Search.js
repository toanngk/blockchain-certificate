import React, { useState } from 'react';
import '../style/Search.css'; // Import the CSS file for styling
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [blockData, setBlockData] = useState(null); // State to hold block data

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Query the Semester table to get BlockchainID
            const response = await fetch(`http://localhost:8080/semester/${query}/blockchainId`);
            const data = await response.json();
            const blockchainId = data.blockchainId;

            // Step 2: Fetch the blockchain data from the backend
            const blockchainResponse = await axios.get('http://localhost:8080/chain');
            const blockchainJson = blockchainResponse.data;

            // Step 3: Find the block in blockchain.json with matching hash
            let block = null;
            for (let i = 0; i < blockchainJson.chain.length; i++) {
                if (blockchainJson.chain[i].hash === blockchainId) {
                    block = blockchainJson.chain[i];
                    break;
                }
            }

            // Step 4: Set block data to state to display in UI
            if (block) {
                setBlockData(block.data);
            } else {
                setBlockData(null); // Clear block data if not found
                alert('No data found for the provided semester ID.');
            }
        } catch (error) {
            console.error('Error searching for block data:', error);
            alert('Error searching for block data. Please try again.');
        }
    };

    return (
        <div className="search-container">
            <div className="search-form-container">
                <div className="search-form">
                    <h2>Tìm Kiếm Chứng Chỉ</h2>
                    <form onSubmit={handleSearch}>
                        <div className="form-group">
                            <label>Mã Học kỳ:</label>
                            <input
                                type="number"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn-submit">Tìm Kiếm</button>
                    </form>
                </div>
            </div>

            {/* Display block data as a table */}
            {blockData && (
                <div className="block-data">
                    <h3>Dữ liệu của block</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Mã số sinh viên</th>
                                <th>Mã học kỳ</th>
                                <th>Môn học</th>
                                <th>Điểm số</th>
                                <th>Ngày cấp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockData.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.studentId}</td>
                                    <td>{entry.semesterId}</td>
                                    <td>{entry.subject}</td>
                                    <td>{entry.grade}</td>
                                    <td>{entry.issuedDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Search;
