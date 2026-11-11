import json
from pathlib import Path
from app.core.supabase import get_supabase

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
TABLES = ("places", "washrooms", "schemes")


def seed_all() -> None:
    supabase = get_supabase()
    for table in TABLES:
        file_path = DATA_DIR / f"{table}.json"
        if not file_path.is_file():
            print(f"Skipping {table}: {file_path} not found")
            continue
        rows = json.loads(file_path.read_text(encoding="utf-8"))
        if not rows:
            print(f"Skipping {table}: empty file")
            continue
        supabase.table(table).insert(rows).execute()
        print(f"Inserted {len(rows)} rows into {table}")


if __name__ == "__main__":
    seed_all()
