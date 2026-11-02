import datetime

def calculate_sm2(
    current_ef: float,
    current_reps: int,
    current_interval: int,
    current_lapses: int,
    grade: int, # 1: Again (Quên), 2: Hard (Khó), 3: Good (Nhớ), 4: Easy (Dễ)
    used_hint: bool = False,
    now: datetime.datetime = None
):
    """
    Standard SuperMemo-2 (SM-2) Spaced Repetition Engine.
    Strictly follows memory science principles with hint-penalty handling.
    """
    if now is None:
        now = datetime.datetime.utcnow()

    # Rule: If hint was used, grade cannot exceed 2 (Hard)
    # Ensuring hints are never registered as independent retrieval
    effective_grade = grade
    if used_hint and effective_grade > 2:
        effective_grade = 2

    # Map grade 1..4 to SM-2 quality q (1 -> 1, 2 -> 3, 3 -> 4, 4 -> 5)
    q_map = {1: 1, 2: 3, 3: 4, 4: 5}
    q = q_map.get(effective_grade, 3)

    new_ef = current_ef
    new_reps = current_reps
    new_interval = current_interval
    new_lapses = current_lapses
    new_state = "review"

    if q < 3: # Forgotten (Lapse / Again)
        new_reps = 0
        new_interval = 1 # Reappear in 1 day (or same session)
        new_lapses += 1
        new_state = "relearning"
        # EF penalty
        new_ef = max(1.3, current_ef - 0.2)
    else: # Successful recall (Good / Easy / Hard)
        if new_reps == 0:
            new_interval = 1
        elif new_reps == 1:
            new_interval = 4 if q >= 4 else 2
        else:
            new_interval = max(1, round(current_interval * current_ef))
            if q == 5: # Easy bonus
                new_interval = round(new_interval * 1.3)
        
        new_reps += 1
        new_state = "review"
        
        # SM-2 EF formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        delta_ef = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        new_ef = max(1.3, min(2.5, current_ef + delta_ef))

    new_due_date = now + datetime.timedelta(days=new_interval)

    return {
        "ease_factor": round(new_ef, 2),
        "repetitions": new_reps,
        "interval_days": new_interval,
        "lapses": new_lapses,
        "due_date": new_due_date,
        "last_reviewed": now,
        "state": new_state,
        "effective_grade": effective_grade
    }
