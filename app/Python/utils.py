import pandas as pd
import numpy as np

def clean_float(value):
    """Converts '1,22' strings or NaN to valid Python floats."""
    if pd.isna(value):
        return 0.0
    if isinstance(value, str):
        value = value.replace(',', '.')
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0

def json_ready(obj):
    """Recursively converts NumPy types and NaNs to JSON-compliant Python types."""
    if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return 0.0
    if isinstance(obj, (np.integer, int)):
        return int(obj)
    if isinstance(obj, (np.floating, float)):
        return 0.0 if np.isnan(obj) else float(obj)
    if isinstance(obj, dict):
        return {k: json_ready(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [json_ready(i) for i in obj]
    return obj