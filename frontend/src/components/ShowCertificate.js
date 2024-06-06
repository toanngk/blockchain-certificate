import React from 'react';
import '../style/ShowCertificate.css'; // Import the CSS file for styling

const ShowCertificate = ({ certificate }) => {
    if (!certificate) {
        return <div className="no-data">No data available</div>;
    }

    return (
        <div className="certificate-container">
            <h1>Certificate Details</h1>
            <p><span className="label">Name:</span> {certificate.name}</p>
            <p><span className="label">ID:</span> {certificate.id}</p>
            <p><span className="label">Date:</span> {certificate.date}</p>
            {/* Other certificate details */}
        </div>
    );
};

export default ShowCertificate;
