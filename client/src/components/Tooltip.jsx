import '../styles.css'
import { useState } from 'react';

const Tooltip = ({text, children}) => {
    const [displayTooltip, setDisplayTooltip] = useState(false);
    
    return (
        <div className="tooltip-container"
            onMouseEnter={() => setDisplayTooltip(true)}
            onMouseLeave={() => setDisplayTooltip(false)}
        >
            {children}
            <div className={`tooltip ${displayTooltip ? "open" : ""}`}>
                {text}
                <div className="arrow" />
            </div>
        </div>
    )
}

export default Tooltip;