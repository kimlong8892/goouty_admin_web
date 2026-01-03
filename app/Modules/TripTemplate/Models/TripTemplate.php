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
        'updatedAt'
    ];
    
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
}
