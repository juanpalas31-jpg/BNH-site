"""Run the Salle du Temps checks together from the repository root."""
import runpy
from pathlib import Path

folder = Path(__file__).resolve().parent
for name in ("validate_registry.py", "check_links.py"):
    print("Running:", name)
    runpy.run_path(str(folder / name), run_name="__main__")
print("Salle du Temps: static checks complete")
