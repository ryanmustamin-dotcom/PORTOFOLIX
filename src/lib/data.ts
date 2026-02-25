export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  location: string;
};

export type Comment = {
  id: string;
  text: string;
  user: User;
  timestamp: Date;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  likes: number;
  thumbnailUrl: string;
  mediaUrls: string[];
  creator: User;
  comments: Comment[];
  publishedAt: Date;
};

const users: User[] = [
  {
    id: 'user-1',
    name: 'Elena Garcia',
    username: 'elenag',
    avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
    bio: 'Digital artist & illustrator exploring the synergy between nature and technology.',
    location: 'Barcelona, Spain',
  },
  {
    id: 'user-2',
    name: 'Ben Carter',
    username: 'bencarter',
    avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
    bio: 'Photographer capturing fleeting moments in urban landscapes.',
    location: 'New York, USA',
  },
  {
    id: 'user-3',
    name: 'Aiko Tanaka',
    username: 'aikotanaka',
    avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    bio: 'UX/UI designer crafting intuitive and beautiful digital experiences.',
    location: 'Tokyo, Japan',
  },
];

const comments: Comment[] = [
  {
    id: 'comment-1',
    text: 'Absolutely stunning work! The color palette is breathtaking.',
    user: users[1],
    timestamp: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: 'comment-2',
    text: 'Love the concept and execution. So inspiring!',
    user: users[2],
    timestamp: new Date('2023-10-26T11:30:00Z'),
  },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Cosmic Drift',
    description:
      'A series of abstract 3D renders exploring nebulae and cosmic phenomena. Created using Blender and finished in Photoshop, this project aims to capture the chaotic beauty of space.',
    category: 'Digital Art',
    tags: ['3D', 'Abstract', 'Space', 'Blender', 'Photoshop'],
    likes: 1250,
    thumbnailUrl: 'https://picsum.photos/seed/proj1/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj1/1200/800', 'https://picsum.photos/seed/proj1-2/1200/800'],
    creator: users[0],
    comments: comments,
    publishedAt: new Date('2023-10-25T09:00:00Z'),
  },
  {
    id: '2',
    title: 'Alpine Echoes',
    description:
      'A photographic journey through the Swiss Alps. This series focuses on the dramatic interplay of light and shadow on the mountain peaks.',
    category: 'Photography',
    tags: ['Landscape', 'Nature', 'Mountains', 'Photography', 'Travel'],
    likes: 2400,
    thumbnailUrl: 'https://picsum.photos/seed/proj2/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj2/1200/800'],
    creator: users[1],
    comments: [],
    publishedAt: new Date('2023-10-24T14:00:00Z'),
  },
  {
    id: '3',
    title: 'Oasis - Wellness App',
    description:
      'Complete UI/UX design for a mobile wellness application. The design prioritizes a calm, clean, and motivating user interface to guide users on their wellness journey.',
    category: 'UI/UX',
    tags: ['UI', 'UX', 'Mobile App', 'Figma', 'Wellness'],
    likes: 3100,
    thumbnailUrl: 'https://picsum.photos/seed/proj6/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj6/1200/800', 'https://picsum.photos/seed/proj6-2/1200/800'],
    creator: users[2],
    comments: [],
    publishedAt: new Date('2023-10-23T11:00:00Z'),
  },
  {
    id: '4',
    title: 'The Wanderer',
    description: 'A character concept for a fantasy game. Includes initial sketches, color studies, and final illustration.',
    category: 'Illustration',
    tags: ['Character Design', 'Fantasy', 'Illustration', 'Procreate'],
    likes: 890,
    thumbnailUrl: 'https://picsum.photos/seed/proj4/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj4/1200/800'],
    creator: users[0],
    comments: [],
    publishedAt: new Date('2023-10-22T18:00:00Z'),
  },
  {
    id: '5',
    title: 'Minimalist Branding for "NORD"',
    description: 'A branding and identity project for a fictional Scandinavian furniture company. Focus on clean lines, typography, and a monochrome palette.',
    category: 'Branding',
    tags: ['Branding', 'Minimalist', 'Graphic Design', 'Logo'],
    likes: 1500,
    thumbnailUrl: 'https://picsum.photos/seed/proj3/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj3/1200/800'],
    creator: users[2],
    comments: [],
    publishedAt: new Date('2023-10-21T10:00:00Z'),
  },
  {
    id: '6',
    title: 'Tokyo at Night',
    description: 'Street photography series capturing the vibrant and electric atmosphere of Tokyo after dark.',
    category: 'Photography',
    tags: ['Street Photography', 'Night', 'City', 'Tokyo'],
    likes: 4200,
    thumbnailUrl: 'https://picsum.photos/seed/proj5/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj5/1200/800'],
    creator: users[1],
    comments: [],
    publishedAt: new Date('2023-10-20T20:00:00Z'),
  },
    {
    id: '7',
    title: 'Cybernetic Dreams',
    description: 'A vibrant digital painting exploring themes of cyberpunk and human augmentation.',
    category: 'Digital Art',
    tags: ['Cyberpunk', 'Digital Painting', 'SciFi', 'Portrait'],
    likes: 1800,
    thumbnailUrl: 'https://picsum.photos/seed/proj7/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj7/1200/800'],
    creator: users[0],
    comments: [],
    publishedAt: new Date('2023-10-19T12:00:00Z'),
  },
  {
    id: '8',
    title: 'Artisan Coffee Packaging',
    description: 'Packaging design for a boutique coffee brand. The design uses hand-drawn illustrations and eco-friendly materials.',
    category: 'Branding',
    tags: ['Packaging', 'Illustration', 'Branding', 'Graphic Design'],
    likes: 950,
    thumbnailUrl: 'https://picsum.photos/seed/proj8/600/400',
    mediaUrls: ['https://picsum.photos/seed/proj8/1200/800'],
    creator: users[2],
    comments: [],
    publishedAt: new Date('2023-10-18T15:00:00Z'),
  },
];

export const getProjects = () => projects;
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getProjectsByUser = (username: string) => projects.filter((p) => p.creator.username === username);
export const getUserByUsername = (username: string) => users.find((u) => u.username === username);
export const getCategories = () => [...new Set(projects.map((p) => p.category))];
