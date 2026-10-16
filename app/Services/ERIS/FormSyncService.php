<?php

namespace App\Services\ERIS;

use App\Models\ERIS\Ekb\Ekb_Forms;
use App\Models\ERIS\Krg\Krg_Forms;
use App\Models\Form;
class FormSyncService
{
    private $latestRecordTime;
    private $oneYearAgo;

    public function __construct()
    {
        $this->findTimeBounds();
    }
    public function sync()
    {
        $remoteData = $this->erisOkudCounts();

        foreach ($remoteData as $okud => $data) {
            // Find existing record by okud, or instantiate a new one
            $form = Form::firstOrNew(['okud' => $okud]);

            $form->name = $data['name'];
            $form->reports_count = $data['reports_count'];

            $form->save();
        }

        return back()->with('success', 'Формы успешно синхронизированы.');
    }
    private function erisOkudCounts(): array
    {
        // 1. Fetch OKUD and [index] to build a fast lookup map (first found index per okud)
        $fetchLookupMap = function ($query) {
            return $query->select('okud', 'index')
                ->distinct()
                ->get()
                ->keyBy('okud')
                ->map(fn($item) => $item->index);
        };

        // Combine lookup maps across all 4 partitions and pick the first found index per okud
        $indexMap = collect()
            ->concat([
                $fetchLookupMap(Ekb_Forms::startFormTable()->whereRaw("CONVERT(varchar(10), [DateStampUpd], 120) >= ?", [$this->oneYearAgo])),
                $fetchLookupMap(Krg_Forms::startFormTable()->whereRaw("CONVERT(varchar(10), [DateStampUpd], 120) >= ?", [$this->oneYearAgo])),
                $fetchLookupMap(Ekb_Forms::endFormTable()),
                $fetchLookupMap(Krg_Forms::endFormTable())
            ])
            ->flatMap(fn($map) => $map)
            ->unique(fn($indexVal, $okud) => $okud);

        // 2. Fetch lightweight occurrence counts using okud
        $startEkCounts = Ekb_Forms::startFormTable()
            ->whereRaw("CONVERT(varchar(10), [DateStampUpd], 120) >= ?", [$this->oneYearAgo])
            ->pluck('okud')->countBy();

        $startKrgCounts = Krg_Forms::startFormTable()
            ->whereRaw("CONVERT(varchar(10), [DateStampUpd], 120) >= ?", [$this->oneYearAgo])
            ->pluck('okud')->countBy();

        $endEkCounts = Ekb_Forms::endFormTable()->pluck('okud')->countBy();
        $endKrgCounts = Krg_Forms::endFormTable()->pluck('okud')->countBy();

        // 3. Merge occurrence counts and sum matching keys
        $combinedCounts = collect()
            ->concat([$startEkCounts, $startKrgCounts, $endEkCounts, $endKrgCounts])
            ->flatMap(fn($values) => $values)
            ->groupBy(fn($item, $key) => $key)
            ->map(fn($group) => $group->sum())
            ->toArray();

        // 4. Build final structure combining count and the [index] field value
        $finalResult = [];
        foreach ($combinedCounts as $okud => $count) {
            $finalResult[$okud] = [
                'name' => $indexMap[$okud] ?? '', // mapping to the [index] column value
                'reports_count' => $count,
            ];
        }

        return $finalResult;
    }

    private function findTimeBounds()
    {
        $anchorEkb = Ekb_Forms::latest('DateStampUpd')->value('DateStampUpd');
        $anchorKrg = Krg_Forms::latest('DateStampUpd')->value('DateStampUpd');

        $this->latestRecordTime = collect([$anchorEkb, $anchorKrg])->filter()->max();
        $this->oneYearAgo = \Carbon\Carbon::parse($this->latestRecordTime)->subYear()->toDateString();
    }
}