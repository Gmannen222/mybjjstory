export type BeltRank = 'white' | 'blue' | 'purple' | 'brown' | 'black'

export type TrainingType = 'gi' | 'nogi' | 'open_mat' | 'private' | 'competition'

export type TechniqueCategory =
  | 'guard'
  | 'pass'
  | 'sweep'
  | 'submission'
  | 'takedown'
  | 'escape'
  | 'other'

export type UserRole = 'athlete' | 'competitor' | 'instructor' | 'academy'

export type ReactionType = 'oss' | 'high_five' | 'fire'

export type PostType = 'training' | 'grading' | 'media' | 'text'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  belt_rank: BeltRank | null
  belt_degrees: number
  academy_name: string | null
  role: UserRole
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: string
  user_id: string
  date: string
  duration_min: number | null
  type: TrainingType
  notes: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface SessionTechnique {
  id: string
  session_id: string
  name: string
  category: TechniqueCategory | null
  notes: string | null
}

export interface Grading {
  id: string
  user_id: string
  belt_rank: BeltRank
  belt_degrees: number
  date: string
  instructor_name: string | null
  academy_name: string | null
  notes: string | null
  is_public: boolean
  created_at: string
}

export interface Media {
  id: string
  user_id: string
  storage_path: string
  thumbnail_path: string | null
  media_type: 'image' | 'video'
  caption: string | null
  session_id: string | null
  grading_id: string | null
  is_public: boolean
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string | null
  post_type: PostType
  session_id: string | null
  grading_id: string | null
  media_id: string | null
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Reaction {
  id: string
  post_id: string
  user_id: string
  type: ReactionType
  created_at: string
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}
