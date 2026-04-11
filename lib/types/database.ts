export type BeltRank =
  | 'white'
  | 'grey_white' | 'grey' | 'grey_black'
  | 'yellow_white' | 'yellow' | 'yellow_black'
  | 'orange_white' | 'orange' | 'orange_black'
  | 'green_white' | 'green' | 'green_black'
  | 'blue' | 'purple' | 'brown' | 'black'

export type TrainingType = 'gi' | 'nogi' | 'open_mat' | 'private' | 'competition' | 'seminar' | 'competition_prep'

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'bad'

export type TechniqueCategory =
  | 'guard'
  | 'pass'
  | 'sweep'
  | 'submission'
  | 'takedown'
  | 'escape'
  | 'other'

export type UserRole = 'athlete' | 'competitor' | 'instructor' | 'academy' | 'admin'

export type ReactionType = 'oss' | 'high_five' | 'fire'

export type PostType = 'training' | 'grading' | 'media' | 'text'

export type CompetitionResult = 'gold' | 'silver' | 'bronze' | 'participant'

export type CompetitionSource = 'manual' | 'smoothcomp' | 'ibjjf' | 'adcc' | 'other'

export type InjuryType = 'sprain' | 'tear' | 'fracture' | 'bruise' | 'dislocation' | 'other'

export type Severity = 'mild' | 'moderate' | 'severe'

export type TrainingImpact = 'none' | 'modified' | 'rest'

export type GradingType = 'belt' | 'stripe'

export type ProfileVisibility = 'private' | 'public' | 'followers' | 'academy' | 'custom'

export interface AvatarConfigData {
  skinTone: string
  hairStyle: string
  hairColor: string
  outfit: string
  beltRank?: string | null
  academyColor?: string | null
  showInjuries?: string[]
  gender: string
}

export interface DashboardConfig {
  showTrainingStats: boolean
  showCompetitionStats: boolean
  showActiveInjuries: boolean
  showRecentTraining: boolean
  showQuickActions: boolean
  showFavoriteSub: boolean
  showFavoriteGuard: boolean
  showBelt: boolean
  showAvatar: boolean
}

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  belt_rank: BeltRank | null
  belt_degrees: number
  academy_name: string | null
  academy_id: string | null
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
  show_kids_belts: boolean
  avatar_config: AvatarConfigData | null
  dashboard_config: DashboardConfig
  profile_visibility: ProfileVisibility
  public_display_name: string | null
  weight_class: string | null
  training_preference: 'gi' | 'nogi' | 'both' | null
  passion_level: number | null
  currently_training: boolean
  heard_about_from: string | null
  is_banned: boolean
  banned_at: string | null
  ban_reason: string | null
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
  effort_rpe: number | null
  mood_before: MoodType | null
  mood_after: MoodType | null
  body_weight_kg: number | null
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

export interface UserTechnique {
  id: string
  user_id: string
  name: string
  category: TechniqueCategory | null
  created_at: string
}

export interface Grading {
  id: string
  user_id: string
  belt_rank: BeltRank
  belt_degrees: number
  grading_type: GradingType
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

export interface TrainingChecklistItem {
  id: string
  user_id: string
  label: string
  sort_order: number
  created_at: string
}

export type AchievementCategory = 'training' | 'streak' | 'belt' | 'social' | 'competition'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  threshold: number
  sort_order: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
}

export interface SparringRound {
  id: string
  session_id: string
  user_id: string
  partner_name: string
  partner_user_id: string | null
  intensity: number | null
  technique_rating: number | null
  flow_rating: number | null
  learning_rating: number | null
  mood_rating: number | null
  notes: string | null
  is_shared: boolean
  created_at: string
}

export type SessionFeedbackType = 'tip' | 'encouragement' | 'observation' | 'question'

export interface SessionFeedback {
  id: string
  session_id: string
  sender_id: string
  recipient_id: string
  message: string
  feedback_type: SessionFeedbackType
  is_read: boolean
  created_at: string
}

export type FeedbackType = 'suggestion' | 'wish' | 'bug' | 'other'

export interface Feedback {
  id: string
  user_id: string
  type: FeedbackType
  message: string
  contact_email: string | null
  status: 'new' | 'read' | 'resolved'
  admin_note: string | null
  admin_reply: string | null
  replied_at: string | null
  created_at: string
}

export interface Academy {
  id: string
  name: string
  city: string | null
  region: string | null
  country: string
  country_code: string
  website_url: string | null
  address: string | null
  affiliation: string | null
  is_active: boolean
  lat: number | null
  lng: number | null
  logo_url: string | null
  description: string | null
  head_instructor: string | null
  submitted_by: string | null
  created_at: string
  updated_at: string
}
