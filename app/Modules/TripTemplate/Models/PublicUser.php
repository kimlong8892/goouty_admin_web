<?php

namespace App\Modules\TripTemplate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PublicUser extends Model
{
    use HasUuids;

    protected $table = 'public.User';

    public $incrementing = false;

    protected $keyType = 'string';
}
