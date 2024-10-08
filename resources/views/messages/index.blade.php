@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <h3>Online Users</h3>
                <hr>
                <h5 id="no-online-users">{{ __('No Online Users') }}</h5>
                <ul class="list-group" id="online-users">

                </ul>
            </div>
            <div class="col-md-9 d-flex flex-column" style="height: 80vh">
                <div class="h-100 bg-white mb-4 p-5" id="chat" style="overflow-y: scroll">
                    @foreach ($messages as $message)
                        <div class="mt-4 w-50 text-white p-3 rounded {{ auth()->user()->id == $message->user_id? 'float-start bg-primary': 'float-end bg-warning' }}">
                            <b class="text-dark">{{ $message->user->name }}</b>
                            <p>{{ $message->body }}</p>
                        </div>
                        <div class="clearfix"></div>

                    @endforeach
                </div>
                <form action="" class="d-flex">
                    <input type="text" data-url="{{ route('messages.store') }}" style="margin-right: 10px" class="form-control" id="chat-text">
                    <button id="send" class="btn btn-primary">{{ __("Send") }}</button>
                </form>
            </div>
        </div>
    </div>
@endsection
