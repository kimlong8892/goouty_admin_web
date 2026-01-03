<?php

namespace App\Modules\TripTemplate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TripTemplateDay extends Model
{
    use HasUuids;

    protected $table = 'public.TripTemplateDay';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'dayOrder',
        'tripTemplateId'
    ];

    const CREATED_AT = null; // Looking at Prisma schema, it doesn't have createdAt/updatedAt
    const UPDATED_AT = null;

    public function activities()
    {
        return $this->hasMany(TripTemplateActivity::class, 'dayId')->orderBy('activityOrder');
    }

    public function tripTemplate()
    {
        return $this->belongsTo(TripTemplate::class, 'tripTemplateId');
    }
}
