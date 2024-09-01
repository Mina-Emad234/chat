<?php

namespace App\Http\Controllers;

use App\Events\MessagePrivate;
use App\Models\User;
use App\Models\Message;
use App\Events\MessageSend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::where('receiver_id', null)->with('user')->get();
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

    public function private($id)
    {
        $messages = Message::where(['user_id'=>auth()->user()->id,'receiver_id'=> $id])->orWhere(['receiver_id'=>auth()->user()->id,'user_id'=> $id])->with('user')->get();
        $user = User::find($id);
        return view('messages.private',compact('messages','user'));
    }

    public function privateStore(Request $request, $id)
    {
        $receiver = User::find($id);
        $message = Message::create([
            'user_id' => auth()->user()->id,
            'body' => $request->body,
            'receiver_id' => $receiver->id
        ]);
        broadcast(new MessagePrivate($message->load('user')))->toOthers();
        // event(new MessageSend($message->load('user')));

        // MessageSend::dispatch($message);
    }

}


