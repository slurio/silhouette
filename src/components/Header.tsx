type Header = {
  title: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: Header) => {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  );
};

export default Header;
