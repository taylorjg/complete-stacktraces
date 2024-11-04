import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ErrorStackParser from "error-stack-parser";

export const ErrorFallback = ({ error }) => {
  const stackFrames = ErrorStackParser.parse(error);
  const madeNetworkCallRef = useRef(false);
  const [expandedStackFrames, setExpandedStackFrames] = useState();

  useEffect(() => {
    const makeNetworkCall = async () => {
      try {
        const response = await fetch(`/expandStack`, {
          method: `POST`,
          headers: {
            "Content-Type": `application/json`,
            Accept: `application/json`,
          },
          body: JSON.stringify({ stackFrames }),
        });

        const data = await response.json();

        setExpandedStackFrames(data.expandedStackFrames);
      } catch {
        setExpandedStackFrames(stackFrames);
      }
    };

    if (!madeNetworkCallRef.current) {
      madeNetworkCallRef.current = true;
      makeNetworkCall();
    }
  }, [stackFrames]);

  const formatStackFrames = stackFrames => JSON.stringify(stackFrames.map(({ source }) => source), null, 2);

  return (
    <>
      <h2>ErrorFallback</h2>

      <h3>Error Message</h3>
      <pre>{error.message}</pre>

      <h3>Original Stack Frames</h3>
      <pre>{formatStackFrames(stackFrames)}</pre>

      {Array.isArray(expandedStackFrames) && (
        <>
          <h3>Expanded Stack Frames</h3>
          <pre>{formatStackFrames(expandedStackFrames)}</pre>
        </>
      )}
    </>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    stack: PropTypes.func.isRequired,
  }),
};
