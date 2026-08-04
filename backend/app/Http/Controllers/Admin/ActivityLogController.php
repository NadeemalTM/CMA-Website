<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'module' => 'nullable|string|max:80',
            'action' => 'nullable|string|max:50',
            'actor_type' => 'nullable|in:admin,citizen,guest,system',
            'user_id' => 'nullable|integer',
            'result' => 'nullable|in:success,failed',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'per_page' => 'nullable|integer|min:10|max:100',
        ]);

        $query = ActivityLog::query()->latest('id');

        $query->when($validated['search'] ?? null, function ($query, string $search) {
            $query->where(function ($query) use ($search) {
                $like = '%' . $search . '%';
                $query->where('description', 'like', $like)
                    ->orWhere('actor_name', 'like', $like)
                    ->orWhere('actor_email', 'like', $like)
                    ->orWhere('module', 'like', $like)
                    ->orWhere('action', 'like', $like)
                    ->orWhere('path', 'like', $like)
                    ->orWhere('subject_id', 'like', $like)
                    ->orWhere('ip_address', 'like', $like);
            });
        });

        foreach (['module', 'action', 'actor_type', 'user_id'] as $field) {
            $query->when($validated[$field] ?? null, fn ($query, $value) => $query->where($field, $value));
        }

        $query->when(($validated['result'] ?? null) === 'success', fn ($query) => $query->where('status_code', '<', 400));
        $query->when(($validated['result'] ?? null) === 'failed', fn ($query) => $query->where('status_code', '>=', 400));
        $query->when($validated['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date));
        $query->when($validated['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date));

        $logs = $query->paginate($validated['per_page'] ?? 25);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ],
            'filters' => [
                'modules' => ActivityLog::query()->distinct()->orderBy('module')->pluck('module')->values(),
                'actions' => ActivityLog::query()->distinct()->orderBy('action')->pluck('action')->values(),
                'actor_types' => ActivityLog::query()->distinct()->orderBy('actor_type')->pluck('actor_type')->values(),
                'actors' => ActivityLog::query()
                    ->whereNotNull('user_id')
                    ->select('user_id', 'actor_name', 'actor_email')
                    ->distinct()
                    ->orderBy('actor_name')
                    ->get(),
            ],
        ]);
    }
}
