import Card from '../card/card.jsx'
import converterData from './converterCards.json';

const Converter = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-12">CONVERTER</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {converterData.cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Converter
