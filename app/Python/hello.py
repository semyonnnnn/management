import sys
import json
import pandas as pd

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No path received"}))
        return

    try:
        input_data = json.loads(sys.argv[1])
        file_path = input_data.get('file_path')

        # 1. Read the file. 
        # If your data doesn't start on row 1, add: header=None or skiprows=X
        df = pd.read_excel(file_path, engine='openpyxl')

        # 2. CLEANUP: Drop completely empty rows and columns
        df = df.dropna(how='all').dropna(axis=1, how='all')

        # 3. STATS: Simple calculations for your test
        results = {
            "status": "success",
            "total_rows": len(df),
            "columns": list(df.columns),
            # Convert NaN to None so JSON doesn't break
            "data_sample": df.head(3).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
        }
        
        print(json.dumps(results))

    except Exception as e:
        # Crucial: Return the error as JSON so Laravel can parse it
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    main()