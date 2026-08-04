<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LawSeeder extends Seeder
{
    public function run(): void
    {
        $laws = [
            [
                'title' => 'Common Amenities Board Law, No. 10 of 1973',
                'description' => 'Establishes the Common Amenities Board (CAB) as a public authority responsible for controlling, managing, maintaining, and administering the common elements and shared amenities of multi-unit residential or commercial buildings.',
            ],
            [
                'title' => 'Apartment Ownership Law, No. 11 of 1973',
                'description' => 'The principal enactment that governs the condominium concept in Sri Lanka. It provides the legal framework for subdividing multi-storey buildings into independent units (apartments) with separate legal ownership titles, while keeping shared zones (like hallways, roofs, and land) as common elements.',
            ],
            [
                'title' => 'Apartment Ownership (Amendment) Act, No. 45 of 1982',
                'description' => 'Amends the principal 1973 law to systematically regulate the Management Corporations (bodies formed by individual unit owners). It outlines statutory rules for things like council sizes, voting majorities, financial auditing, and meeting quorums.',
            ],
            [
                'title' => 'Apartment Ownership (Amendment) Act, No. 39 of 2003',
                'description' => 'Significantly updated the law to handle changing real estate trends by introducing and regulating Provisional Condominium Plans (for properties under planning or construction) and Semi-Condominium Plans (for partially completed buildings). It made the registration of these completed plans legally mandatory before individual units could be sold or occupied.',
            ],
            [
                'title' => 'Common Amenities Board (Amendment) Act, No. 24 of 2003',
                'description' => 'Amended the 1973 Common Amenities Board Law to re-establish and re-brand the entity as the Condominium Management Authority (CMA). It granted the authority expanded powers to regulate developers, register management corporations, and resolve maintenance disputes.',
            ],
            [
                'title' => 'Apartment Ownership (Special Provisions) Act, No. 23 of 2018',
                'description' => 'A temporary, specialized piece of legislation enacted to expedite and facilitate the legal registration and title disposition of older or complex housing/condominium properties owned directly by the State or state agencies (such as public housing schemes).',
            ],
            [
                'title' => 'Extraordinary Gazette No. 2026/25 of 05.07.2017',
                'description' => 'A specific regulatory directive issued by the relevant Ministry under the Condominium Management Authority framework. It officially outlines the updated administrative procedures, basic conformity requirements, guidelines, and structural fee schedules necessary for obtaining condominium certificates and approvals.',
            ]
        ];

        $order = 1;
        foreach ($laws as $law) {
            DB::table('laws')->insert([
                'title' => $law['title'],
                'description' => $law['description'],
                'order' => $order++,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
