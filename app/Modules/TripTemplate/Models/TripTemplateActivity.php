<?php

namespace App\Modules\TripTemplate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TripTemplateActivity extends Model
{
    use HasUuids;

    protected $table = 'public.TripTemplateActivity';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'startTime',
        'durationMin',
        'location',
        'notes',
        'important',
        'activityOrder',
        'dayId'
    ];

    protected $casts = [
        'important' => 'boolean',
    ];

    const CREATED_AT = null;
    const UPDATED_AT = null;

    public function day()
    {
        return $this->belongsTo(TripTemplateDay::class, 'dayId');
    }
}
