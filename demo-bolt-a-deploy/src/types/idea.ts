export interface Idea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en progreso' | 'hecha';
  created_at: string;
}

export type NewIdea = Omit<Idea, 'id' | 'created_at'>;
