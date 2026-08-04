<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NormalizeAuthorizationHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->headers->has('Authorization')) {
            $authorization = $request->headers->get('X-Authorization')
                ?? $request->server->get('HTTP_X_AUTHORIZATION')
                ?? $request->server->get('REDIRECT_HTTP_AUTHORIZATION');

            if (! $authorization) {
                return $next($request);
            }

            $request->headers->set('Authorization', $authorization);
            $request->server->set('HTTP_AUTHORIZATION', $authorization);
        }

        return $next($request);
    }
}
