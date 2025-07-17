import '../styles.css'

const Pill = ({groupScore}) => {
    const HIGH_COMPATIBILITY_THRESHOLD = 0.75;
    const MEDIUM_COMPATIBILITY_THRESHOLD = 0.50;
    const pillColor = parseFloat(groupScore) >= HIGH_COMPATIBILITY_THRESHOLD ? "pill-component-green" : (parseFloat(groupScore) >= MEDIUM_COMPATIBILITY_THRESHOLD ? "pill-component-yellow" : "pill-component-red");
    return (
        <div className="pill-component" id={pillColor}>
            <div>Group Compatibility: {groupScore}</div>
        </div>
    )
}

export default Pill;