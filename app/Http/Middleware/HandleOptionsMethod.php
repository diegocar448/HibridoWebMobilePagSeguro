<?php

namespace App\Http\Middleware;

use Closure;

class HandleOptionsMethod
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->getMethod() == "OPTIONS") {
            return response("", 200);
        }
        return $next($request);

    }
}
