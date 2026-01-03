<?php

namespace App\Modules\TripTemplate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TripTemplate extends Model
{
    use HasUuids;

    protected $table = 'public.TripTemplate';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'provinceId',
        'isPublic',
        'userId',
        'avatar',
    ];
    
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public function days()
    {
        return $this->hasMany(TripTemplateDay::class, 'tripTemplateId')->orderBy('dayOrder');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinceId');
    }

    public function user()
    {
        return $this->belongsTo(PublicUser::class, 'userId');
    }
}
