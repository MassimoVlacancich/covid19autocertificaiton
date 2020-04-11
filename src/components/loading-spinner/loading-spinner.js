import React from 'react';
import './loading-spinner.css'

export function LoadingSpinner(props) {
    return (
        <div className="loading">
            <div className="visual">
                <img className="pulse" alt="Loading..." src="icons/pdf_icon.png" />
                {props.loadingText}
            </div>
        </div>
    )
}