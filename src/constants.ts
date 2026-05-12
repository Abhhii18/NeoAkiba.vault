import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gojo-001',
    name: 'Gojo Satoru Unlimited Void',
    anime: 'Jujutsu Kaisen',
    price: 89,
    image: 'https://images.unsplash.com/photo-1613376023733-0d743826a990?auto=format&fit=crop&q=80&w=800', // Anime girl figure
    description: 'High-quality 1/8 scale figure of Gojo Satoru performing his Domain Expansion: Unlimited Void. Features translucent purple effects and intricate detail.',
    rating: 4.9,
    stock: 12,
    category: 'Scale Figure',
    featured: true,
    createdAt: { seconds: 1715437446 }
  },
  {
    id: 'naruto-002',
    name: 'Naruto Uzumaki Sage Mode',
    anime: 'Naruto Shippuden',
    price: 75,
    image: 'https://images.unsplash.com/photo-1578632738980-43312a52de6a?auto=format&fit=crop&q=80&w=800', // Toy figure
    description: 'The Hero of the Hidden Leaf in his iconic Sage Mode. Includes interchangeble hands and Rasenshuriken effect parts.',
    rating: 4.8,
    stock: 25,
    category: 'Vibration Stars',
    featured: true,
    createdAt: { seconds: 1715337446 }
  },
  {
    id: 'luffy-003',
    name: 'Monkey D. Luffy Gear 5',
    anime: 'One Piece',
    price: 95,
    image: 'https://images.unsplash.com/photo-1636572481914-a07d36917486?auto=format&fit=crop&q=80&w=800', // Anime figure
    description: 'The peak of Luffy\'s power! This Gear 5 figure captures the drum of liberation with spectacular cloud effects and a joyful pose.',
    rating: 5.0,
    stock: 8,
    category: 'King of Artist',
    featured: true,
    createdAt: { seconds: 1715537446 }
  },
  {
    id: 'levi-004',
    name: 'Levi Ackerman Cleaning Ver.',
    anime: 'Attack on Titan',
    price: 82,
    image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&q=80&w=800', // Robot/Figure
    description: 'The humanity\'s strongest soldier in his most fearsome form: with a feather duster and face mask. A must-have for cleaning enthusiasts.',
    rating: 4.7,
    stock: 15,
    category: 'Scale Figure',
    featured: false,
    createdAt: { seconds: 1715237446 }
  },
  {
    id: 'vegeta-005',
    name: 'Vegeta Ultra Ego',
    anime: 'Dragon Ball Super',
    price: 99,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', // Dragon figure
    description: 'The Prince of Saiyans has transcended his limits! This Ultra Ego figure features purple hair and battle-damaged armor.',
    rating: 4.9,
    stock: 10,
    category: 'Masterlise',
    featured: true,
    createdAt: { seconds: 1715637446 }
  }
];
