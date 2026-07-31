import pandas as pd
import re
from utils import clean_float

class DepartmentProcessor:
    def __init__(self, *args):
        """
        Supports either:
            DepartmentProcessor(matrix_xls)
        or
            DepartmentProcessor(forms_df, matrix_xls)
        """
        if len(args) == 1:
            self.forms_df = None
            self.matrix_xls = args[0]
        elif len(args) == 2:
            self.forms_df = args[0]
            self.matrix_xls = args[1]
        else:
            raise TypeError(f"DepartmentProcessor.__init__() takes 1 or 2 positional arguments but {len(args)} were given")

        self.departments = []
        self.forms = []

    def process_data(self):
        dept_temp = {}

        for sheet_name in self.matrix_xls.sheet_names:
            sheet_lower = str(sheet_name).strip().lower()
            
            # Skip summary sheets or instructions entirely
            if "итог" in sheet_lower or "справка" in sheet_lower:
                continue

            df = pd.read_excel(
                self.matrix_xls,
                sheet_name=sheet_name,
                header=None,
                dtype=str
            )

            # -----------------------------
            # Departments
            # -----------------------------
            name_col = 5   # F
            staff_col = 39 # AN
            workload_col = 40 # AO

            col_values = df.iloc[:, name_col].fillna("").astype(str).str.strip()
            
            # 1. Determine if this sheet uses the "Name итог" subtotal row structure
            has_inline_totals = any("итог" in str(r).lower() for r in col_values)
            
            valid_depts = set()
            for val in col_values.unique():
                val_lower = val.lower()
                
                # Skip empty rows or "итог" (total) rows
                if not val or "итог" in val_lower:
                    continue
                
                # ALLOW "отдел", "сектор", OR "управление"
                if not any(keyword in val_lower for keyword in ["отдел", "сектор", "управление"]):
                    continue
                
                if has_inline_totals:
                    # Strict validation for spreadsheets structured like tipa_tatari
                    if any(str(r).strip().lower() == f"{val_lower} итог" for r in col_values):
                        valid_depts.add(val)
                else:
                    # Flat data structure collection for formats like real_tatari
                    valid_depts.add(val)

            for _, row in df.iterrows():
                if len(row) <= name_col:
                    continue
                dept_name = str(row[name_col]).strip()
                if dept_name not in valid_depts:
                    continue

                staff = int(clean_float(row[staff_col])) if len(row) > staff_col and row[staff_col] else 0
                workload = int(clean_float(row[workload_col])) if len(row) > workload_col and row[workload_col] else 0
                
                # 2. Assign Territory based on the Sheet Name
                if "со" in sheet_lower or "екат" in sheet_lower or "ekb" in sheet_lower:
                    territory = "ekb"
                elif "ко" in sheet_lower or "курган" in sheet_lower or "krg" in sheet_lower:
                    territory = "krg"
                else:
                    # Fallback
                    territory = "ekb" 

                if dept_name not in dept_temp:
                    dept_temp[dept_name] = {
                        "name": dept_name,
                        "territory": territory,
                        "staff": staff,
                        "workload": workload
                    }
                else:
                    dept_temp[dept_name]["staff"] = max(dept_temp[dept_name]["staff"], staff)
                    dept_temp[dept_name]["workload"] += workload

            # -----------------------------
            # Forms (strict 7-digit OKUD from column C)
            # -----------------------------
            okud_col = 2       # C
            name_col_form = 1  # B
            indicators_col = 32 # AG
            period_col = 3     # D
            coeff_cols = list(range(33, 39))  # AH–AM
            final_col = 40     # AO
            dept_name_col = 5   # F

            for _, row in df.iterrows():
                if len(row) <= okud_col:
                    continue

                raw_okud = str(row[okud_col]).strip()
                
                # 3. Clean float conversion string bugs (e.g., '616009.0' -> '616009')
                raw_okud = raw_okud.split('.')[0]
                
                # 4. Fill in leading zeros lost during Excel number parsing
                if len(raw_okud) == 6 and raw_okud.isdigit():
                    raw_okud = "0" + raw_okud

                # Include only exactly 7 consecutive digits
                if not re.fullmatch(r"\d{7}", raw_okud):
                    continue

                okud = raw_okud
                name = str(row[name_col_form]).strip()[:60] if len(row) > name_col_form and row[name_col_form] else f"Форма {okud}"
                indicators = int(clean_float(row[indicators_col])) if len(row) > indicators_col and row[indicators_col] else 0
                period_val = str(row[period_col]).strip() if len(row) > period_col and row[period_col] else None
                reports = self.period_to_reports(period_val)

                coeff = 1
                for col in coeff_cols:
                    if len(row) > col and row[col]:
                        coeff *= float(clean_float(row[col]))

                final = int(clean_float(row[final_col])) if len(row) > final_col and row[final_col] else 0

                department_name = str(row[dept_name_col]).strip() if len(row) > dept_name_col and row[dept_name_col] else None

                self.forms.append({
                    "department": department_name,
                    "name": name,
                    "indicators": indicators,
                    "reports": reports,
                    "coeff": coeff,
                    "final": final
                })

        self.departments = list(dept_temp.values())

        return {
            "departments": self.departments,
            "forms": self.forms
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
        if "год" in p:
            return 1
        return 1