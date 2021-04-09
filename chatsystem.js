const url = "http://chillyskye.dk/api/";

$(document).ready(function(){ 
    var chat = new ChatSystem();
    chat.start();
});

class ChatSystem{
    constructor(){
        this.messages = [];
    }
    // Used to start the chat
    start(){
        // Starts an inteval function that runs every 1 second 
        var self = this;
        setInterval(function(){ 
            // Gets lasted messages from api
            self.getMessages();
        }, 1000);


        // * Send message event handling
        // Event handling for button
        $("#sendMessageButtonId").click(self.sendMessage);

        // Event handling for enter keypress
        $("#messageFieldId").keypress(function(event) {
            if (event.which == 13) /* 13 = keycode for enter*/{
                self.sendMessage();
            }
        })
    }

    // Used to get all new messages and put them into messages array
    getMessages() {
        var self = this;

        // Makes api get call to web server
        $.ajax({
            url: url,
            data: {},
            success: function(result){
                // Adds incomming messages to main messages array
                self.addMessages(JSON.parse(result));

                // Updates chat with new messages
                self.updateChat();
            }
        });
    }

    // Used to send a message
    sendMessage(){
        var name = document.getElementById("nameFieldId").value;
        var message = document.getElementById("messageFieldId").value;

        // Error checks if the text fields is empty
        if (name == "" || (message == "")){
            alert("Tekst felterne må ikke være tomme!");
            return;
        }
        // Error checks if message is to long
        if (message.length > 300){
            alert("Beskeden er for lang, den er over 300 tegn!");
            return;
        }
        // Makes api post call to web server
        $.ajax({
            url: url,
            cache: false,
            type: "post",
            data: {
                'name': name,
                'message': message
            }
        })
    }

    // Used to take an array of new messages and put the new ones into the main message array
    addMessages(newMessages){

        // Loops through each new message
        newMessages.forEach(newMessage => {
            var isAlreadyInTheChat = false;

            // Loops through each existing message
            this.messages.forEach(message => {
                if (newMessage.id == message.id){
                    isAlreadyInTheChat = true;
                    return;
                }
            });
            if (!isAlreadyInTheChat){
                this.messages.push(newMessage);
            }
        });
    }

    // Used to update chat
    updateChat(){
        // Gets chat element
        var chatElement = document.getElementById("chatAreaId");
        chatElement.textContent = ""; // Clears chat element

        // Function that for leading zeros
        const zeroPad = (num, places) => String(num).padStart(places, '0');
        
        // Loop throug each message and adds them to chat element
        this.messages.forEach(message => {
            var date = new Date(message.timestamp * 1000);

            chatElement.textContent += "<" + zeroPad(date.getHours(), 2) + ":" + zeroPad(date.getMinutes(), 2) + "> " + message.name + ": " + message.message + "\n";
        });
    }
}
