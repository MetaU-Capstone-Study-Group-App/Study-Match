import { useState, useEffect } from "react";

const WeightsSlider = ({addWeight, weightType}) => {
    const [weightValue, setWeightValue] = useState(0.5);

    const handleSliderChange = (event) => {
        setWeightValue(parseFloat(event.target.value));
        addWeight(parseFloat(event.target.value), weightType);
    }

    useEffect(() => {
        addWeight(0.5, weightType);
    }, [])

    return (
        <div>
            <input 
                className="weights-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weightValue}
                onChange={handleSliderChange}
            />
            <p>{weightValue.toFixed(2)}</p>
        </div>
    )
}

export default WeightsSlider;