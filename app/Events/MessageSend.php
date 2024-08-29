<?php

namespace App\Events;

use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageSend implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;



    /**
     * Message details
     *
     * @var Message
     */
    public $message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn():array|channel
    {
        return new Channel("chat-group");
    }

    public function broadcastWith()
    {
        $message = ['message' => $this->message];
        Log::info("msg",$message);
        return $message;
    }
    public function broadcastAs()
    {
        return "msg.sent";
    }





}
