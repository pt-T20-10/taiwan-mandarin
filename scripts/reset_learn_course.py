"""Authorized one-shot PC reset. Default is read-only; use --apply after checks."""
import json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.learn_course import reset
if __name__=='__main__':print(json.dumps(reset('--apply' in sys.argv),ensure_ascii=False,indent=2))
