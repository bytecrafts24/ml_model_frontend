const Card = ({ title, icon, description }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-400">
        <div className="flex flex-col items-center gap-4">

          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="w-12 h-12">
            {icon}
          </div>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    );
  };
export default Card

  