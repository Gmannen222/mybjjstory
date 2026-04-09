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

export type CompetitionResult = 'gold' | 'silver' | 'bronze' | 'participant'

export type CompetitionSource = 'manual' | 'smoothcomp' | 'ibjjf' | 'adcc' | 'other'

export type InjuryType = 'sprain' | 'tear' | 'fracture' | 'bruise' | 'dislocation' | 'other'

export type Severity = 'mild' | 'moderate' | 'severe'

export type TrainingImpact = 'none' | 'modified' | 'rest'

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
  favorite_guard: string | null
  favorite_submission: string | null
  training_since_year: number | null
  show_belt: boolean
  show_academy: boolean
  show_training_since: boolean
  show_favorite_guard: boolean
  show_favorite_submission: boolean
  show_injuries: boolean
  show_competitions: boolean
  show_stats: boolean
  show_feed: boolean
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

export interface Competition {
  id: string
  user_id: string
  event_name: string
  event_date: string | null
  organization: string | null
  weight_class: string | null
  belt_division: string | null
  gi_nogi: 'gi' | 'nogi' | null
  result: CompetitionResult | null
  wins: number
  losses: number
  source: CompetitionSource
  source_url: string | null
  source_id: string | null
  verified: boolean
  notes: string | null
  is_public: boolean
  created_at: string
}

export interface Injury {
  id: string
  user_id: string
  body_part: string
  injury_type: InjuryType | null
  description: string | null
  date_occurred: string
  date_recovered: string | null
  severity: Severity
  training_impact: TrainingImpact
  notes: string | null
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
