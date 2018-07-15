$(function () {
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    var socket = io();
    var $window = $(window);
    $('.form1 input').focus();

    //Add user
    const fnAddUser = () => {
        socket.sNickName = $('#NickName').val();
        socket.emit('nickname', socket.sNickName);
    };

    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }


    //show the chatting page and remove the login page
    const fnChangePage = () => {
        $('.loginPage').fadeOut();
        $('.chatPage').fadeIn();
        $('.form2 input').focus();
    }

    //return the message you wrire
    const fnGetMessage = () => {
        return $('#m').val();
    }

    //clean the message
    const fnCleanMessage = () => {
        $('#m').val('');
    }



    //sending message to the server.
    const fnSendMessage = (msg) => {
        socket.emit('chat message', msg);
    }

    //add the log, show the situation about how many people and say hello to people.
    const log = (data) => {
        $('#messages').append($('<li class="log">').text(data));
        $('html')[0].scrollTop = $('html')[0].scrollHeight;
    }

    //add message from the server to the client.
    const fnAddMessageElement = (data) => {
        var $li = $('<li>');
        var $span1 = $('<span class="nickname">').text(data.nickname);
        $span1.css('color', getUsernameColor(data.nickname));
        var $span2 = $('<span class="msg">').text(data.msg);
        $li.append($span1);
        $li.append($span2);
        $('#messages').append($li);
        $('html')[0].scrollTop = $('html')[0].scrollHeight;
    }

    //remove typing 
    const fnRemoveTyping = () => {
        $($('#messages').children()[$('#messages').children().length - 1]).fadeOut();
        $($('#messages').children()[$('#messages').children().length - 1]).remove();
    }

    //return the string about the situation of how many people there.
    const fnHowMany = (num) => {
        if (num == 1) {
            return `There is only ${num} participant. That's you!`;
        } else {
            return `There are ${num} participants`;
        }
    }

    // when the nickname is submit
    $('.form1').submit(() => {
        fnAddUser();
        fnChangePage();
        return false;
    });

    //sending message to the server
    $('.form2').submit(() => {
        var sMessage = fnGetMessage();
        if (Boolean(sMessage)) {
            var data = {
                nickname: socket.sNickName,
                msg: sMessage
            };
            fnSendMessage(data);
            fnCleanMessage();
        }
        return false;
    });

    socket.on('a user join', function (msg) {
        log(msg);
    });

    socket.on('a user go', function (msg) {
        log(msg);
    });

    socket.on('how many people', function (num) {
        var str = fnHowMany(num);
        log(str);
    });

    socket.on('chat message', function (data) {
        fnAddMessageElement(data);
    });

});