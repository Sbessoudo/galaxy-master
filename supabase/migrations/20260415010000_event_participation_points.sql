-- Add optional points to event participation
ALTER TABLE event_participants
  ADD COLUMN points_awarded int NOT NULL DEFAULT 0;

-- ── Update recalculate_astronaut_points to include event participation ────────
-- The function previously only summed contributions.points_awarded.
-- Now it also sums event_participants.points_awarded for that astronaut.

CREATE OR REPLACE FUNCTION recalculate_astronaut_points(p_astronaut uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_contrib      int;
  v_participation int;
  v_total        int;
  v_grade        uuid;
BEGIN
  SELECT COALESCE(SUM(points_awarded), 0) INTO v_contrib
  FROM contributions WHERE astronaut_id = p_astronaut;

  SELECT COALESCE(SUM(points_awarded), 0) INTO v_participation
  FROM event_participants WHERE astronaut_id = p_astronaut;

  v_total := v_contrib + v_participation;

  SELECT id INTO v_grade FROM grades
  WHERE min_points <= v_total ORDER BY min_points DESC LIMIT 1;

  UPDATE astronauts
  SET total_points = v_total, grade_id = v_grade, updated_at = now()
  WHERE id = p_astronaut;
END;
$$;

-- ── Update sync_planet_season_points to include event participation ───────────
-- When syncing a (planet, season) total, add event participation points
-- for astronauts of that planet who attended events in that season.

CREATE OR REPLACE FUNCTION sync_planet_season_points()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_planet uuid;
  v_season uuid;
  v_contrib      int;
  v_participation int;
  v_bonus         int;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_planet := (SELECT planet_id FROM astronauts WHERE id = OLD.astronaut_id);
    v_season := OLD.season_id;
  ELSE
    v_planet := (SELECT planet_id FROM astronauts WHERE id = NEW.astronaut_id);
    v_season := NEW.season_id;
  END IF;

  IF v_planet IS NULL OR v_season IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Contributions points
  SELECT COALESCE(SUM(c.points_awarded), 0) INTO v_contrib
  FROM contributions c
  JOIN astronauts a ON a.id = c.astronaut_id
  WHERE a.planet_id = v_planet AND c.season_id = v_season;

  -- Event participation points (events in same season)
  SELECT COALESCE(SUM(ep.points_awarded), 0) INTO v_participation
  FROM event_participants ep
  JOIN events ev ON ev.id = ep.event_id
  JOIN astronauts a ON a.id = ep.astronaut_id
  WHERE a.planet_id = v_planet AND ev.season_id = v_season;

  -- Bonus points
  SELECT COALESCE(SUM(b.points), 0) INTO v_bonus
  FROM bonus_points b
  WHERE b.planet_id = v_planet AND b.season_id = v_season;

  INSERT INTO planet_season_points (planet_id, season_id, total_points)
  VALUES (v_planet, v_season, v_contrib + v_participation + v_bonus)
  ON CONFLICT (planet_id, season_id) DO UPDATE
    SET total_points = EXCLUDED.total_points;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ── Trigger on event_participants to sync astronaut points + planet totals ────
CREATE OR REPLACE FUNCTION trigger_event_participation_points()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_astronaut_id uuid;
  v_planet       uuid;
  v_season       uuid;
  v_contrib      int;
  v_participation int;
  v_bonus         int;
BEGIN
  v_astronaut_id := COALESCE(NEW.astronaut_id, OLD.astronaut_id);

  -- Recalculate astronaut lifetime points
  PERFORM recalculate_astronaut_points(v_astronaut_id);

  -- Sync planet_season_points
  SELECT a.planet_id INTO v_planet
  FROM astronauts a WHERE a.id = v_astronaut_id;

  SELECT ev.season_id INTO v_season
  FROM events ev WHERE ev.id = COALESCE(NEW.event_id, OLD.event_id);

  IF v_planet IS NOT NULL AND v_season IS NOT NULL THEN
    SELECT COALESCE(SUM(c.points_awarded), 0) INTO v_contrib
    FROM contributions c
    JOIN astronauts a ON a.id = c.astronaut_id
    WHERE a.planet_id = v_planet AND c.season_id = v_season;

    SELECT COALESCE(SUM(ep.points_awarded), 0) INTO v_participation
    FROM event_participants ep
    JOIN events ev ON ev.id = ep.event_id
    JOIN astronauts a ON a.id = ep.astronaut_id
    WHERE a.planet_id = v_planet AND ev.season_id = v_season;

    SELECT COALESCE(SUM(b.points), 0) INTO v_bonus
    FROM bonus_points b
    WHERE b.planet_id = v_planet AND b.season_id = v_season;

    INSERT INTO planet_season_points (planet_id, season_id, total_points)
    VALUES (v_planet, v_season, v_contrib + v_participation + v_bonus)
    ON CONFLICT (planet_id, season_id) DO UPDATE
      SET total_points = EXCLUDED.total_points;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS event_participants_sync_points ON event_participants;

CREATE TRIGGER event_participants_sync_points
  AFTER INSERT OR UPDATE OR DELETE ON event_participants
  FOR EACH ROW EXECUTE FUNCTION trigger_event_participation_points();
