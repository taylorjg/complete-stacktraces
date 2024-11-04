import { ErrorBoundary } from "react-error-boundary";
import { CauseError } from "./CauseError";
import { ErrorFallback } from "./ErrorFallback";

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CauseError />
    </ErrorBoundary>
  )
}
