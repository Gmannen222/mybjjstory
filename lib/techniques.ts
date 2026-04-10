import type { TechniqueCategory } from '@/lib/types/database'

export interface TechniqueOption {
  name: string
  category: TechniqueCategory
}

export const TECHNIQUE_LIBRARY: TechniqueOption[] = [
  // Guards
  { name: 'Closed Guard', category: 'guard' },
  { name: 'Half Guard', category: 'guard' },
  { name: 'Butterfly Guard', category: 'guard' },
  { name: 'De La Riva', category: 'guard' },
  { name: 'Spider Guard', category: 'guard' },
  { name: 'Lasso Guard', category: 'guard' },
  { name: 'X-Guard', category: 'guard' },
  { name: 'Single Leg X', category: 'guard' },
  { name: 'Reverse De La Riva', category: 'guard' },
  { name: 'Worm Guard', category: 'guard' },
  { name: '50/50', category: 'guard' },
  { name: 'Rubber Guard', category: 'guard' },
  { name: 'Z-Guard', category: 'guard' },
  { name: 'Deep Half Guard', category: 'guard' },
  { name: 'Open Guard', category: 'guard' },

  // Passes
  { name: 'Toreando Pass', category: 'pass' },
  { name: 'Knee Slice', category: 'pass' },
  { name: 'Over-Under Pass', category: 'pass' },
  { name: 'Stack Pass', category: 'pass' },
  { name: 'Leg Drag', category: 'pass' },
  { name: 'Long Step Pass', category: 'pass' },
  { name: 'Smash Pass', category: 'pass' },
  { name: 'Body Lock Pass', category: 'pass' },
  { name: 'X-Pass', category: 'pass' },
  { name: 'Double Under Pass', category: 'pass' },

  // Sweeps
  { name: 'Scissor Sweep', category: 'sweep' },
  { name: 'Hip Bump Sweep', category: 'sweep' },
  { name: 'Flower Sweep', category: 'sweep' },
  { name: 'Butterfly Sweep', category: 'sweep' },
  { name: 'Pendulum Sweep', category: 'sweep' },
  { name: 'Berimbolo', category: 'sweep' },
  { name: 'Elevator Sweep', category: 'sweep' },
  { name: 'Waiter Sweep', category: 'sweep' },
  { name: 'Sickle Sweep', category: 'sweep' },
  { name: 'John Wayne Sweep', category: 'sweep' },

  // Submissions
  { name: 'Armbar', category: 'submission' },
  { name: 'Triangle Choke', category: 'submission' },
  { name: 'Rear Naked Choke', category: 'submission' },
  { name: 'Guillotine', category: 'submission' },
  { name: 'Kimura', category: 'submission' },
  { name: 'Americana', category: 'submission' },
  { name: 'Omoplata', category: 'submission' },
  { name: 'Cross Collar Choke', category: 'submission' },
  { name: 'Bow & Arrow Choke', category: 'submission' },
  { name: 'Ezekiel Choke', category: 'submission' },
  { name: 'D\'Arce Choke', category: 'submission' },
  { name: 'Anaconda Choke', category: 'submission' },
  { name: 'Loop Choke', category: 'submission' },
  { name: 'North-South Choke', category: 'submission' },
  { name: 'Heel Hook', category: 'submission' },
  { name: 'Knee Bar', category: 'submission' },
  { name: 'Toe Hold', category: 'submission' },
  { name: 'Straight Ankle Lock', category: 'submission' },
  { name: 'Calf Slicer', category: 'submission' },
  { name: 'Wristlock', category: 'submission' },
  { name: 'Baseball Bat Choke', category: 'submission' },
  { name: 'Paper Cutter Choke', category: 'submission' },
  { name: 'Von Flue Choke', category: 'submission' },

  // Takedowns
  { name: 'Single Leg', category: 'takedown' },
  { name: 'Double Leg', category: 'takedown' },
  { name: 'Osoto Gari', category: 'takedown' },
  { name: 'Seoi Nage', category: 'takedown' },
  { name: 'Uchi Mata', category: 'takedown' },
  { name: 'Harai Goshi', category: 'takedown' },
  { name: 'Ouchi Gari', category: 'takedown' },
  { name: 'Ko Uchi Gari', category: 'takedown' },
  { name: 'Tomoe Nage', category: 'takedown' },
  { name: 'Ankle Pick', category: 'takedown' },
  { name: 'Arm Drag', category: 'takedown' },
  { name: 'Guard Pull', category: 'takedown' },
  { name: 'Body Lock Takedown', category: 'takedown' },
  { name: 'Snap Down', category: 'takedown' },

  // Escapes
  { name: 'Bridge & Roll (Mount)', category: 'escape' },
  { name: 'Elbow Escape (Mount)', category: 'escape' },
  { name: 'Hip Escape (Side Control)', category: 'escape' },
  { name: 'Frame Escape', category: 'escape' },
  { name: 'Back Escape', category: 'escape' },
  { name: 'Turtle Recovery', category: 'escape' },
  { name: 'Guard Recovery', category: 'escape' },
  { name: 'Knee Shield Escape', category: 'escape' },
]

export const CATEGORY_LABELS: Record<TechniqueCategory, string> = {
  guard: 'Guard',
  pass: 'Pass',
  sweep: 'Sweep',
  submission: 'Submission',
  takedown: 'Takedown',
  escape: 'Escape',
  other: 'Annet',
}

export const CATEGORY_COLORS: Record<TechniqueCategory, string> = {
  guard: 'bg-blue-500/20 text-blue-400',
  pass: 'bg-green-500/20 text-green-400',
  sweep: 'bg-yellow-500/20 text-yellow-400',
  submission: 'bg-red-500/20 text-red-400',
  takedown: 'bg-purple-500/20 text-purple-400',
  escape: 'bg-cyan-500/20 text-cyan-400',
  other: 'bg-surface-hover text-muted',
}
