interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  imageUrl: string;
  bannerUrl: string;
  age: number;
  nationality: string;
  rapStyle: string;
  stats: PlayerStats;
  achievements: string[];
  description: string;
}

export const mockPlayers: Record<string, PlayerInfo> = {
  aczino: {
    id: 'aczino',
    name: 'Aczino',
    imageUrl: 'https://i.imgur.com/jYqtBnD.jpg',
    bannerUrl: 'https://i.imgur.com/2N4rPxX.jpg',
    age: 32,
    nationality: 'México',
    rapStyle: 'Agresivo, Punchlines, Técnico',
    stats: {
      wins: 120,
      losses: 20,
      draws: 10,
      winRate: 80
    },
    achievements: [
      'Campeón FMS Internacional 2022',
      'Campeón Red Bull Internacional 2017',
      'Bicampeón FMS México'
    ],
    description: 'Mauricio Hernández González, conocido como Aczino, es considerado uno de los mejores freestylers de la historia. Su estilo único combina técnica, agresividad y un dominio excepcional del español.'
  },
  chuty: {
    id: 'chuty',
    name: 'Chuty',
    imageUrl: 'https://thepooltm.com/wp-content/uploads/2023/10/CHUTY_FANART.jpg',
    bannerUrl: 'https://fluge.es/wp-content/uploads/2023/08/CHUTY-SE-PROCLAMO-CAMPEON-DE-LA-FINAL-NACIONAL-DE-RED-BULL-BATALLA-2023-EN-VALENCIA-2.jpg',
    age: 30,
    nationality: 'España',
    rapStyle: 'Técnico, Punchlines',
    stats: {
      wins: 100,
      losses: 25,
      draws: 15,
      winRate: 75
    },
    achievements: [
      'Campeón FMS España',
      'Campeón Red Bull España'
    ],
    description: 'Chuty es uno de los referentes del freestyle español, conocido por su técnica impecable y su capacidad para estructurar rimas complejas.'
  }
};