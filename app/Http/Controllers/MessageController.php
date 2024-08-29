<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with('user')->get();
        return view('messages.index',compact('messages'));
    }

    public function store(Request $request)
    {
        $message = Message::create([
            'user_id' => auth()->user()->id,
            'body' => $request->body,
        ]);
        broadcast(new MessageSend($message->load('user')))->toOthers();
        // event(new MessageSend($message->load('user')));

        // MessageSend::dispatch($message);
    }
}


