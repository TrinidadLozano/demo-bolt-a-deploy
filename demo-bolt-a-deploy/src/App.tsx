import { useState, useEffect } from 'react';
import { IdeaForm } from './components/IdeaForm';
import { IdeasList } from './components/IdeasList';
import { ideasService } from './services/ideasService';
import { Idea, NewIdea } from './types/idea';
import { Sparkles } from 'lucide-react';

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIdeas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ideasService.getAll();
      setIdeas(data);
    } catch (err) {
      setError('Error al cargar las ideas');
      console.error('Error loading ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleAddIdea = async (newIdea: NewIdea) => {
    try {
      const createdIdea = await ideasService.create(newIdea);
      setIdeas([createdIdea, ...ideas]);
    } catch (err) {
      console.error('Error adding idea:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Gestor de Ideas
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Captura y organiza todas tus ideas en un solo lugar
          </p>
        </header>

        <IdeaForm onSubmit={handleAddIdea} />

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando ideas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadIdeas}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <IdeasList ideas={ideas} />
        )}
      </div>
    </div>
  );
}

export default App;
