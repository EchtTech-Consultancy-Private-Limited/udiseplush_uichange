import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
const LazyLoading = () => {
    return (
        <div className="spinner">
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default LazyLoading;