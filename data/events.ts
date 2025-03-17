export interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  location: string;
  time: string;
  imageUrl: string;
}

// Helper function to create dates relative to today
const createDate = (dayOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date;
};

// Sample events data with flyers for different dates
export const events: Event[] = [
  {
    id: '1',
    title: 'Jornada 1',
    date: createDate(0), // Today
    description: 'Gazir se enfrenta contra Chuty en la primer jordana, duelo de campeones.',
    location: 'Winzc Center',
    time: '15:00 - 20:00',
    imageUrl: 'https://pbs.twimg.com/media/FuWHs9XXoAEm5Gn?format=jpg&name=900x900'
  },
  {
    id: '2',
    title: 'Campeonato Regional',
    date: createDate(1), // Tomorrow
    description: 'Campeonato regional con equipos de toda la zona. Ven y apoya a tu equipo favorito.',
    location: 'Complejo Deportivo Norte',
    time: '10:00 - 18:00',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&h=500&fit=crop&crop=edges&q=80'
  },
  {
    id: '3',
    title: 'Torneo Amistoso',
    date: createDate(2), // Day after tomorrow
    description: 'Torneo amistoso entre equipos locales. Entrada gratuita para todos los asistentes.',
    location: 'Parque Municipal',
    time: '16:30 - 19:00',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&h=500&fit=crop&crop=edges&q=80'
  },
  {
    id: '4',
    title: 'Copa Invitacional',
    date: createDate(-1), // Yesterday
    description: 'Copa invitacional con los mejores equipos del país. No te pierdas esta oportunidad única.',
    location: 'Estadio Metropolitano',
    time: '18:00 - 22:00',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&h=500&fit=crop&crop=edges&q=80'
  },
  {
    id: '5',
    title: 'Encuentro de Estrellas',
    date: createDate(-2), // Two days ago
    description: 'Encuentro de las estrellas del deporte. Exhibiciones, concursos y mucha diversión.',
    location: 'Arena Central',
    time: '17:00 - 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=900&h=500&fit=crop&crop=edges&q=80'
  },
  {
    id: '6',
    title: 'Torneo de Fin de Año',
    date: createDate(5), // 5 days from now
    description: 'Cierra el año con el mejor torneo. Grandes premios y sorpresas para todos los participantes.',
    location: 'Complejo Deportivo Sur',
    time: '14:00 - 20:00',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Apertura de Temporada',
    date: createDate(7), // 7 days from now
    description: 'Comienza el año con el torneo de apertura. Nuevos equipos, nuevas reglas, nuevas emociones.',
    location: 'Estadio Principal',
    time: '16:00 - 20:00',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '8',
    title: 'Torneo de Primavera',
    date: createDate(10), // 10 days from now
    description: 'Torneo de primavera con los mejores jugadores. Disfruta de un día lleno de competencia y diversión.',
    location: 'Parque de los Deportes',
    time: '11:00 - 17:00',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2049&auto=format&fit=crop'
  },
  {
    id: '9',
    title: 'Campeonato Juvenil',
    date: createDate(-5), // 5 days ago
    description: 'Campeonato para jóvenes talentos. Ven a descubrir las futuras estrellas del deporte.',
    location: 'Centro Deportivo Juvenil',
    time: '09:00 - 16:00',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '10',
    title: 'Evento Especial',
    date: createDate(3), // 3 days from now
    description: 'Evento especial con invitados de honor. No te pierdas esta oportunidad única de conocer a tus ídolos.',
    location: 'Plaza Central',
    time: '17:30 - 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop'
  }
]; 