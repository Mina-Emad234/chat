import './bootstrap';

import Echo from 'laravel-echo';
// import io from 'socket.io-client';
// window.io = io;
import Pusher from 'pusher-js';
window.Pusher = Pusher;
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
Pusher.logToConsole = true;
window.onload = () => {
    if (window.location.pathname == '/messages') {
        scrollDown();
    }else{
        scrollDownPrivate();
    }
}
// window.pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     authEndpoint: "/broadcasting/auth",
//     auth: {
//         headers: {
//             "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
//             "Content-Type": "application/json"
//         }
//     }
// });
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
    forceTLS: true,
    csrfToken:token.content,
    // wsHost: window.location.hostname,
    // wsPort: 6001,
    // disableStats: true,
    // disableStats: true,
    forceTLS: false,
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        }
    },
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                },{
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                })
                .then(response => {
                    if (typeof response.data === 'object') {
                            callback(false, response.data);
                        } else {
                            // If it's a string, try to parse it
                            try {
                                // const parsed = response.data;
                                callback(false, response.data);
                            } catch (e) {
                                console.error('Failed to parse auth response:', e);
                                callback(true, 'Invalid auth response');
                            }
                        }
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    }
});

let onlineUsersLength = 0;
window.Echo.join('online')
    .here((users) => {
        // $("#chat").scrollTop($(document).height());
        onlineUsersLength = users.length;
        if (users.length > 1) {
            $("#no-online-users").css('display','none');
        }
        let userId = $('meta[name=user-id]').attr('content')

        users.forEach(function(user) {
         if (userId==user.id) {
            return;
        }
            $("#online-users").append(`<a class="btn btn-white" href="/private/${user.id}"><li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span> ${user.name}</li></a>`);
        if(window.location.pathname=="/private/"+user.id){

            $("#private-users li").prepend(`<span class="icon icon-circle text-success"></span> `);
        }
        });

    })
    .joining((user) => {
        onlineUsersLength++;
        $("#no-online-users").css('display','none');
        $("#online-users").append(`<li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span> ${user.name}</li>`);
    })
    .leaving((user) => {
        onlineUsersLength--;
        if (onlineUsersLength == 1) {
            $("#no-online-users").css('display','block');
        }
        $("#user-"+user.id).remove()
    })
    .error((error) => {
        console.error('Channel error:', error);
    });

window.Echo.channel('chat-group')
.listen(".msg.sent", (e) => {

        // console.log(e);

        $("#chat").append(`
            <div class="mt-4 w-50 text-white p-3 rounded float-end bg-warning">
                    <b class="text-dark">${e.message.user.name}</b>
                    <p>${e.message.body}</p>
                </div>
            <div class="clearfix"></div>
        `);
        scrollDown();

    })

// if (window.location.pathname.split('/')[1] == 'private') {
//     var reciverId = window.location.pathname.split('/')[2];
// }
var reciverId = $("meta[name=user-id]").attr("content");
window.Echo.private(`chat-private.${reciverId}`)
.listen(".msg.private", (e) => {

        // console.log(e);

        $("#chat-private").append(`
            <div class="mt-4 w-50 text-white p-3 rounded float-end bg-warning">
                    <b class="text-dark">${e.message.user.name}</b>
                    <p>${e.message.body}</p>
                </div>
            <div class="clearfix"></div>
        `);
        scrollDownPrivate();

    })

    $("#chat-text").on("keypress", function(e) {

        if (e.which == 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent the default action (new line in the textarea)
           sendMsg("#chat-text");
        }
    });
    $("#chat-private").on("keypress", function(e) {

        if (e.which == 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent the default action (new line in the textarea)
           sendPrivateMsg("#chat-private-box");
        }
    });

        $("#send").on("click", function(e) {
            e.preventDefault(); // Prevent the default action (new line in the textarea)
            sendMsg("#chat-text");
        });
        $("#send-private").on("click", function(e) {
            e.preventDefault(); // Prevent the default action (new line in the textarea)
            sendPrivateMsg("#chat-private-box");
        });
    function sendMsg(element) {
            let body = $(element).val();
            let url = $(element).data('url');
            let userName = $("meta[name=user-name]").attr("content");
            $(element).val('');

            $("#chat").append(`
                <div class="mt-4 w-50 text-white p-3 rounded float-start bg-primary">
                    <b class="text-dark">${userName}</b>
                    <p>${body}</p>
                </div>
                <div class="clearfix"></div>

            `);
            scrollDown();
            let data = {
                "_token":token.content,
                body
            }
            $.ajax({
                url:url,
                method:"post",
                data:data,

            });
    }
     function sendPrivateMsg(element) {
            let body = $(element).val();
            let url = $(element).data('url');
            let userName = $("meta[name=user-name]").attr("content");
            $(element).val('');

            $("#chat-private").append(`
                <div class="mt-4 w-50 text-white p-3 rounded float-start bg-primary">
                    <b class="text-dark">${userName}</b>
                    <p>${body}</p>
                </div>
                <div class="clearfix"></div>

            `);
            scrollDownPrivate();
            let data = {
                "_token":token.content,
                body
            }
            $.ajax({
                url:url,
                method:"post",
                data:data,

            });
    }


    function scrollDown() {
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    }
    function scrollDownPrivate() {
        document.getElementById('chat-private').scrollTop = document.getElementById('chat-private').scrollHeight;
    }

