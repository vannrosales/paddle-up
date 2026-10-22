-- Seed data for PaddleUp (roles and baseline demo profiles)

insert into public.roles (id, key, label, category, description, icon_name) values
  ('role_dinker', 'dinker', 'Dinker / Soft-Game Specialist', 'playing_style', 'Masters the non-volley zone, patient reset dinks, and unforced error forcing.', 'Shield'),
  ('role_power_hitter', 'power_hitter', 'Power Hitter (Banger)', 'playing_style', 'Aggressive pace, driving third shots, quick hands at the kitchen line.', 'Zap'),
  ('role_all_court', 'all_court', 'All-Court Player', 'playing_style', 'Fluidly balances power drives, resets, drops, and speed-ups based on match flow.', 'Compass'),
  ('role_drop_specialist', 'drop_specialist', 'Third-Shot-Drop Specialist', 'playing_style', 'Consistently transitions from baseline to kitchen with textbook soft drops.', 'Target'),
  ('role_defensive', 'defensive', 'Lob & Defensive Specialist', 'playing_style', 'Exceptional court coverage, resets slams, neutralizes aggressive attacks.', 'Sparkles'),
  ('role_left_side', 'left_side', 'Left-Side Player', 'court_position', 'Covers the middle with forehand dominance in standard right-handed pairs.', 'ArrowLeftRight'),
  ('role_right_side', 'right_side', 'Right-Side Player', 'court_position', 'Steady setup, cross-court dinking, and rock-solid defense.', 'ArrowRight'),
  ('role_flexible_side', 'flexible_side', 'Flexible (Either Side)', 'court_position', 'Equally comfortable playing from deuce or ad side.', 'Repeat'),
  ('role_coach', 'coach', 'Coach / Instructor', 'off_court', 'Provides clinics, private lessons, and mechanical diagnostics.', 'Award'),
  ('role_referee', 'referee', 'Referee / Official', 'off_court', 'Certified rules official, scorekeeper, and line caller.', 'Volume2'),
  ('role_organizer', 'organizer', 'Tournament Organizer', 'off_court', 'Runs round robins, brackets, scrambles, and club leagues.', 'Calendar'),
  ('role_club_manager', 'club_manager', 'Club / Court Manager', 'off_court', 'Oversees court scheduling, open play queues, and memberships.', 'Home'),
  ('role_social', 'social', 'Casual / Social Player', 'off_court', 'Plays for fitness, camaraderie, and weekend community fun.', 'Smile')
on conflict (id) do update set
  label = excluded.label,
  category = excluded.category,
  description = excluded.description;

