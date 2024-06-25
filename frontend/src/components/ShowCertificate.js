import React, { useState } from 'react';
import axios from 'axios';
import '../style/ShowCertificate.css'; // Import the CSS file for styling

const EXPRESS_API_URL = 'http://localhost:8080';

// const ShowCertificate = ({ certificate }) => {
//     if (!certificate) {
//         return <div className="no-data">No data available</div>;
//     }

//     return (
//         <div className="certificate-container">
//             <h1>Certificate Details</h1>
//             <p><span className="label">Name:</span> {certificate.name}</p>
//             <p><span className="label">ID:</span> {certificate.id}</p>
//             <p><span className="label">Date:</span> {certificate.date}</p>
//             {/* Other certificate details */}

            
//         </div>
//     );
// };

const ShowCertificate = ({ userRole }) => {
    const [chain, setChain] = useState('');
    const [addedBlock, setAddedBlock] = useState('');
    const [validateMessage, setValidateMessage] = useState('');

    const handleValidate = () => {
        axios.get(`${EXPRESS_API_URL}/validate`)
            .then((res) => {
                console.log(res);
                setValidateMessage(res.data.message);
                if (res.data.addedBlock) {
                    setAddedBlock(res.data.addedBlock);
                }
            });
    };

    const handleGetChain = () => {
        axios.get(`${EXPRESS_API_URL}/chain`)
            .then((res) => {
                console.log(res);
                setChain(res.data);
            });
    };

    const renderObject = (obj) => {
        return (
            <pre className="rendered-object">
                {JSON.stringify(obj, null, 2)}
            </pre>
        );
    };

    return (
        <div className="certificate-container">
            <h1>Certificate Details</h1>
            <div className="test-buttons">
                <button onClick={handleValidate} className="btn-action">Test Validate</button>
                <button onClick={handleGetChain} className="btn-action">Test Get Chain</button>
            </div>
            <div className="test-results">
                <h2>New Block:</h2>
                <h3>{validateMessage}</h3>
                {addedBlock ? (
                    renderObject(addedBlock)
                ) : (
                    <p>Added block will be shown here</p>
                )}
                <h2>Chain:</h2>
                {chain ? (
                    renderObject(chain)
                ) : (
                    <p>Blockchain will be shown here</p>
                )}
            </div>
        </div>
        
    );
}

export default ShowCertificate;
