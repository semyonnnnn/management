<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SyncLogs extends Model
{
    protected $table = 'sync_logs';

    protected $fillable = [
        'synced_when',
        'start_table_timestamp',
        'end_table_timestamp'
    ];
}