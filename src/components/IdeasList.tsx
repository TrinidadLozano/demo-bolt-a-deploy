import { Idea } from '../types/idea';
import { Lightbulb, Clock, CheckCircle2, PlayCircle } from 'lucide-react';

interface IdeasListProps {
  ideas: Idea[];
}

const statusConfig = {
  'pendiente': {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  'en progreso': {
    label: 'En Progreso',
    color: 'bg-blue-100 text-blue-800',
    icon: PlayCircle,
  },
  'hecha': {
    label: 'Hecha',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
};

export function IdeasList({ ideas }: IdeasListProps) {
  if (ideas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay ideas todavía. ¡Agrega tu primera idea!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-blue-600" />
        Mis Ideas
      </h2>

      <div className="grid gap-4">
        {ideas.map((idea) => {
          const status = statusConfig[idea.estado];
          const StatusIcon = status.icon;

          return (
            <div
              key={idea.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {idea.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4">{idea.descripcion}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>
                      {new Date(idea.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
