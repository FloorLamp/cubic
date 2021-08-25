export const TokenLogo = () => {
  return <img src="/img/cubic.svg" className="w-3 mx-1 inline" />;
};

export const TokenLabel = () => {
  return (
    <span className="inline-flex items-center leading-none">
      <TokenLogo /> CUBE
    </span>
  );
};
