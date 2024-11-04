import PropTypes from "prop-types";

export const ErrorFallback = ({ error }) => {
  console.log("ErrorFallback");
  
  return (
    <>
    <h2>ErrorFallback</h2>
      <pre>{error.stack}</pre>
    </>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    stack: PropTypes.func.isRequired,
  }),
};
