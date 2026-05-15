type Props = {
  items: string[];
};

const Breadcrumbs = ({ items }: Props) => {
  return (
    <div className="mb-6 text-[15px] text-gray-500">
      {items.map((item, index) => (
        <span key={item}>
          <span className={index === items.length - 1 ? "text-[#1c1c1c]" : ""}>
            {item}
          </span>
          {index !== items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
