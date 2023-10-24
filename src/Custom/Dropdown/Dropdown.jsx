import React, { useState } from 'react';
import './Dropdown.css';

const MyDropdown = ({ title, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mydropdown">
            <button className="mydropdown-toggle" onClick={toggleDropdown}>
                {title}
            </button>
            {isOpen && (
                <ul className="mydropdown-menu">
                    {options.map((option) => (
                        <li key={option.label} onClick={option.onClick}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyDropdown;
