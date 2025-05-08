<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'score',
        'created_by',
        'organization_name',
        'website_url',
        'industry_sector',
        'annual_revenue',
        'country',
        'market_position',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getIndustrySectorOptions()
    {
        return [
            'Sporting Goods',
            'Fishing equipments',
            'Medical supplements'
        ];
    }

    public function getAnnualRevenueOptions()
    {
        return [
            '5 million',
            '5-10 million',
            'Above 10 million'
        ];
    }

    public function getMarketPositionOptions()
    {
        return [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
        ];
    }
}
