import { Plant } from '@/types/plant';

export const samplePlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '1-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-15',
        caption: 'New growth emerging'
      },
      {
        id: '1-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-15',
        caption: 'First split leaf'
      },
      {
        id: '1-3',
        url: '/api/placeholder/600/400',
        date: '2024-03-15',
        caption: 'Growing taller'
      }
    ]
  },
  {
    id: '2',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '2-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-10',
        caption: 'Newly potted'
      },
      {
        id: '2-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-10',
        caption: 'Settling in'
      }
    ]
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '3-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-20',
        caption: 'Fresh from nursery'
      },
      {
        id: '3-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-20',
        caption: 'New leaf unfurling'
      },
      {
        id: '3-3',
        url: '/api/placeholder/600/400',
        date: '2024-03-20',
        caption: 'Growing strong'
      }
    ]
  },
  {
    id: '4',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '4-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-05',
        caption: 'Propagation cuttings'
      },
      {
        id: '4-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-05',
        caption: 'Roots developing'
      },
      {
        id: '4-3',
        url: '/api/placeholder/600/400',
        date: '2024-03-05',
        caption: 'New growth'
      }
    ]
  },
  {
    id: '5',
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '5-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-12',
        caption: 'Young plant'
      },
      {
        id: '5-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-12',
        caption: 'Growing taller'
      }
    ]
  },
  {
    id: '6',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    thumbnailUrl: '/api/placeholder/400/300',
    photos: [
      {
        id: '6-1',
        url: '/api/placeholder/600/400',
        date: '2024-01-08',
        caption: 'Compact growth'
      },
      {
        id: '6-2',
        url: '/api/placeholder/600/400',
        date: '2024-02-08',
        caption: 'New shoots'
      }
    ]
  }
];
