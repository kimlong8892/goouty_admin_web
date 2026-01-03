<?php

namespace App\Modules\TripTemplate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Province extends Model
{
    use HasUuids;

    protected $table = 'public.Province';

    public $incrementing = false;

    protected $keyType = 'string';
}
