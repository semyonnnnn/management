from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

@app.route('/process-matrix', methods=['POST'])
def process_matrix():
    data = request.get_json()
    file_path = data.get('file_path')

    # Debugging check: Does the file actually exist where Python is looking?
    if not os.path.exists(file_path):
        return jsonify({
            "status": "error", 
            "message": f"File not found at: {file_path}. Is the volume mapped correctly?"
        }), 400

    try:
        # Determine file type and read
        if file_path.endswith('.xlsx') or file_path.endswith('.xls'):
            df = pd.read_excel(file_path)
        else:
            df = pd.read_csv(file_path)
        
        # Example logic: Sum the first column
        # Convert to float to ensure JSON serializability
        result_value = float(df.iloc[:, 0].sum()) 

        return jsonify({
            "status": "success",
            "result": result_value,
            "rows_processed": len(df),
            "file_used": file_path
        })
        
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": f"Pandas Error: {str(e)}"
        }), 400

if __name__ == '__main__':
    # MUST use 0.0.0.0 to listen for requests from the Laravel container
    app.run(host='0.0.0.0', port=5000)