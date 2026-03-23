import pandas as pd
from utils import clean_float

ALLOWED_SHEETS = {
    "forms": ["Справочник"],
    "matrix": {
        "ekb": ["СО"],
        "krg": ["КО"]
    }
}

class DepartmentProcessor:
    def __init__(self, forms_df, matrix_xls):
        self.forms_df = forms_df
        self.matrix_xls = matrix_xls
        self.forms = []
        self.departments = []

    def parse_forms(self):
        df = self.forms_df
        mask = df.iloc[:, 0].astype(str).str.match(r"^\d{7}")
        start_row = mask.index[mask].min() if mask.any() else 0
        df = df.iloc[int(start_row):]

        for _, row in df.iterrows():
            okud = str(row[0]).strip()
            if not okud or "итог" in okud.lower():
                continue
            
            self.forms.append({
                "id": f"f_{okud}",
                "okud": okud,
                "name": str(row[1])[:60] if row[1] else f"Форма {okud}",
                "показатели": clean_float(row[7]),
                "k1": clean_float(row[9]), "k2": clean_float(row[10]),
                "k3": clean_float(row[11]), "k4": clean_float(row[12]),
                "k5": clean_float(row[13]), "k6": clean_float(row[14]),
            })

    def process_matrix(self):
        for territory, sheets in ALLOWED_SHEETS["matrix"].items():
            for sheet_name in sheets:
                if sheet_name not in self.matrix_xls.sheet_names:
                    continue
                df = pd.read_excel(self.matrix_xls, sheet_name=sheet_name, header=None)
                dept_map = {}

                for _, row in df.iterrows():
                    if len(row) < 6: continue
                    dept_name = row[5]
                    if not dept_name or "итог" in str(dept_name).lower(): continue
                    
                    staff = int(clean_float(row[38])) if len(row) > 38 else 0

                    if dept_name not in dept_map or dept_map[dept_name]["staff"] < staff:
                        dept_map[dept_name] = {
                            "id": f"dept_{dept_name}_{territory}",
                            "name": dept_name,
                            "territory": "Екатеринбург" if territory == "ekb" else "Курган",
                            "staff": staff,
                            "forms": []
                        }

                    okud = str(row[2]).strip() if len(row) > 2 else None
                    form = next((f for f in self.forms if f["okud"] == okud), None)
                    if not form: continue
                        
                    reports = self.period_to_reports(str(row[3]) if len(row) > 3 else None)
                    calc = round(form["показатели"] * reports * form["k1"] * form["k2"] *
                                 form["k3"] * form["k4"] * form["k5"] * form["k6"], 1)
                                 
                    dept_map[dept_name]["forms"].append({"form_id": form["id"], "calc": calc})

                self.departments.extend(list(dept_map.values()))

    @staticmethod
    def period_to_reports(period):
        if not period: return 1
        p = str(period).lower()
        if "месяч" in p: return 12
        if "квартал" in p: return 4
        if "полугод" in p: return 2
        return 1