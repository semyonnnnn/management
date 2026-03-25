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
        self.assignments = []

    def process_data(self):
        # -----------------------------
        # Parse forms (Справочник)
        # -----------------------------
        df_forms = self.forms_df
        mask = df_forms.iloc[:, 0].astype(str).str.match(r"^\d{7}")
        start_row = mask.index[mask].min() if mask.any() else 0
        df_forms = df_forms.iloc[int(start_row):]

        for _, row in df_forms.iterrows():
            okud = str(row[0]).strip()
            if not okud or "итог" in okud.lower():
                continue

            self.forms.append({
                "okud": okud,
                "name": str(row[1])[:60] if len(row) > 1 and row[1] else f"Форма {okud}",
                "indicators": clean_float(row[7]) if len(row) > 7 else 0,
                "k1": clean_float(row[9]) if len(row) > 9 else 1,
                "k2": clean_float(row[10]) if len(row) > 10 else 1,
                "k3": clean_float(row[11]) if len(row) > 11 else 1,
                "k4": clean_float(row[12]) if len(row) > 12 else 1,
                "k5": clean_float(row[13]) if len(row) > 13 else 1,
                "k6": clean_float(row[14]) if len(row) > 14 else 1,
            })

        forms_map = {f["okud"]: f for f in self.forms}

        # -----------------------------
        # Process matrix sheets
        # -----------------------------
        for territory, sheets in ALLOWED_SHEETS["matrix"].items():
            for sheet_name in sheets:
                if sheet_name not in self.matrix_xls.sheet_names:
                    continue

                df_matrix = pd.read_excel(self.matrix_xls, sheet_name=sheet_name, header=None)

                dept_col = 5
                okud_col = 2
                period_col = 3
                staff_col = 38
                indicators_col = 32  # Column AG (0-indexed)

                col_values = df_matrix.iloc[:, dept_col].fillna("").astype(str).str.strip()

                # -----------------------------
                # Find valid departments
                # -----------------------------
                valid_depts = set()
                for val in col_values.unique():
                    if not val or val.lower() == "общий итог":
                        continue
                    if any(str(r).strip().lower() == f"{val.lower()} итог" for r in col_values):
                        valid_depts.add(val)

                dept_map = {}

                # -----------------------------
                # Parse departments and assignments
                # -----------------------------
                for _, row in df_matrix.iterrows():
                    if len(row) <= dept_col:
                        continue

                    dept_name = str(row[dept_col]).strip()
                    if dept_name not in valid_depts:
                        continue

                    staff = int(clean_float(row[staff_col])) if len(row) > staff_col else 0
                    if dept_name not in dept_map or dept_map[dept_name]["staff"] < staff:
                        dept_map[dept_name] = {
                            "id": f"{dept_name}_{territory}",
                            "name": dept_name,
                            "territory": "Екатеринбург" if territory == "ekb" else "Курган",
                            "staff": staff
                        }

                    okud = str(row[okud_col]).strip() if len(row) > okud_col else None
                    if not okud or okud not in forms_map:
                        continue

                    reports = self.period_to_reports(str(row[period_col]).strip() if len(row) > period_col else None)

                    indicators = 0
                    if len(row) > indicators_col:
                        raw_val = row[indicators_col]
                        if pd.notna(raw_val):
                            indicators = clean_float(raw_val)

                    self.assignments.append({
                        "okud": okud,
                        "reports": reports,
                        "indicators": indicators
                    })

                self.departments.extend(dept_map.values())

        return {
            "departments": self.departments,
            "forms": self.forms,
            "assignments": self.assignments
        }

    @staticmethod
    def period_to_reports(period):
        if not period:
            return 1
        p = str(period).lower()
        if "месяч" in p:
            return 12
        if "квартал" in p:
            return 4
        if "полугод" in p:
            return 2
        return 1