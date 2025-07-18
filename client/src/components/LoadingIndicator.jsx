import { FadeLoader } from "react-spinners";

const LoadingIndicator = ({loading}) => {
    return (
        <FadeLoader
            className="loading-indicator"
            loading={loading}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    )
}

export default LoadingIndicator;