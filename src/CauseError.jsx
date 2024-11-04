export const CauseError = () => {
  const function1 = () => {
    function2();
  };
  
  const function2 = () => {
    function3();
  };
  
  const function3 = () => {
    throw new Error("Boom!");
  };
  
  function1();

  return <div>CauseError component</div>;
};
