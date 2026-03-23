export type RawgGame = {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
  rating?: number;
  platforms?: { platform: { id: number; name: string } }[];
  genres?: { id: number; name: string }[];
  description_raw?: string;
};

export type RawgGameDetails = RawgGame & {
  description: string;
  website?: string;
  screenshots?: { id: number; image: string }[];
};

export type UserGameStatus = 'playing' | 'completed' | 'dropped' | 'backlog';

export type Review = {
  id: string;
  game_id: number;
  score: number;
  review_text: string;
  created_at: string;
};
