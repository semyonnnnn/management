import pandas as pd
import re


class FormsDistribution:
    def __init__(self, matrix_xls):
        self.matrix_xls = matrix_xls

    def process_data(self):
        distribution = {
            "ekb": {},
            "krg": {},
        }

        okud_col = 2       # C
        name_col = 1       # B
        dept_name_col = 5  # F

        for sheet_name in self.matrix_xls.sheet_names:
            sheet_lower = str(sheet_name).strip().lower()

            if "итог" in sheet_lower or "справка" in sheet_lower:
                continue

            if "со" in sheet_lower or "екат" in sheet_lower or "ekb" in sheet_lower:
                territory = "ekb"
            elif "ко" in sheet_lower or "курган" in sheet_lower or "krg" in sheet_lower:
                territory = "krg"
            else:
                territory = "ekb"

            df = pd.read_excel(
                self.matrix_xls,
                sheet_name=sheet_name,
                header=None,
                dtype=str
            )

            for _, row in df.iterrows():
                if len(row) <= okud_col:
                    continue

                raw_okud = str(row[okud_col]).strip()
                raw_okud = raw_okud.split('.')[0]

                if len(raw_okud) == 6 and raw_okud.isdigit():
                    raw_okud = "0" + raw_okud

                if not re.fullmatch(r"\d{7}", raw_okud):
                    continue

                form_name = (
                    str(row[name_col]).strip()[:60]
                    if len(row) > name_col and row[name_col]
                    else f"Форма {raw_okud}"
                )

                department_name = (
                    str(row[dept_name_col]).strip()
                    if len(row) > dept_name_col and row[dept_name_col]
                    else None
                )

                if not department_name:
                    continue

                if department_name not in distribution[territory]:
                    distribution[territory][department_name] = []

                if form_name not in distribution[territory][department_name]:
                    distribution[territory][department_name].append(form_name)

        return distribution