import math

SCORE_WEIGHTS = (
    ("has_ramp", 30, "Ramp (+30)"),
    ("has_elevator", 25, "Elevator (+25)"),
    ("accessible_parking", 20, "Accessible parking (+20)"),
    ("wheelchair_friendly", 25, "Wheelchair friendly (+25)"),
)


def compute_accessibility_score(place: dict) -> tuple[int, list[str]]:
    score = 0
    breakdown: list[str] = []
    for field, weight, label in SCORE_WEIGHTS:
        if place.get(field):
            score += weight
            breakdown.append(label)
    return score, breakdown


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def filter_by_radius(
    rows: list[dict],
    lat: float | None,
    lng: float | None,
    radius_km: float | None,
) -> list[dict]:
    if lat is None or lng is None:
        return rows
    result: list[dict] = []
    for row in rows:
        dist = round(haversine_km(lat, lng, row["lat"], row["lng"]), 2)
        if radius_km is None or dist <= radius_km:
            result.append({**row, "distance_km": dist})
    result.sort(key=lambda item: item["distance_km"])
    return result

