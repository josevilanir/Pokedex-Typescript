import { PokemonList } from '@/components/PokemonList';
import heroImage from '@/assets/pokemon-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Pokédex Explorer
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Discover the amazing world of Pokémon with detailed stats, evolutions, and more!
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <PokemonList />
    </div>
  );
};

export default Index;
