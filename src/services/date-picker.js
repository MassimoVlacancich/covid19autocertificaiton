import React from 'react';

export const DatePicker = ({ name, register, required }) => ( 
    <input 
        type="date" 
        className="form-control"
        name={name}
        ref={register({required})}
    />
)

function generateOptionsForRange(start, end) {
    let items = [];         
    for (let i = start; i >= end; i--) {             
        items.push(<option key={i} value={i}>{i}</option>);
    }
    return items
}

export const MobileDatePickerYear = ({ name, register, required }) => (
    <div className="input-group">
        <select 
            className="custom-select"
            id={name}
            name={name}
            placeholder="Data di nascita" 
            ref={register({required})}
        >
        {generateOptionsForRange(2020, 1900)}
        </select>
    </div>
)

export const MobileDatePickerMonth = ({ name, register, required }) => (
    <div className="input-group">
        <select className="custom-select"
            id={name}
            name={name}
            ref={register({required})}
        >
        {generateOptionsForRange(12, 1)}
        </select>
    </div>
)

export const MobileDatePickerDay = ({ name, register, required }) => (
    <div className="input-group">
        <select className="custom-select"
            id={name}
            name={name}
            ref={register({required})}
        >
        {generateOptionsForRange(31, 1)}
        </select>
    </div>
)