package eu.rasus.fer.chat;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ChatMessage {

    public String body;
    public String sender;
    public String receiver;
    public String msgId;
    public String date;
    public String time;
    public boolean isMine;

    public ChatMessage(String sender, String receiver, String body, boolean isMINE) {
        SimpleDateFormat time_formatter = new SimpleDateFormat("HH:mm:ss");
        SimpleDateFormat date_formatter = new SimpleDateFormat("dd/MM/yy");

        this.sender = sender;
        this.receiver = receiver;
        this.body = body;
        isMine = isMINE;
        date = date_formatter.format(new Date());
        time = time_formatter.format(new Date());
    }

}
