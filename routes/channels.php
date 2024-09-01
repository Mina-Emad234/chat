<?php

use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Broadcast::channel('App.Models.User.{id}', function ($user) {
//     return $user;
// });

Broadcast::channel('online', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
    // return Auth::check();
});
Broadcast::channel('chat-private.{reciverId}', function ($user,$reciverId) {
    return (int) $reciverId === (int) $user->id;
});
