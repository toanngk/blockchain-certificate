import React from 'react';

const ShowCertificate = ({ certificate }) => {
    if (!certificate) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <h1>Certificate Details</h1>
            <p>Name: {certificate.name}</p>
            <p>ID: {certificate.id}</p>
            <p>Date: {certificate.date}</p>
            {/* Other certificate details */}
        </div>
    );
};

export default ShowCertificate;