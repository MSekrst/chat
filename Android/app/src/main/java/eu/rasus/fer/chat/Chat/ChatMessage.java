package eu.rasus.fer.chat.Chat;

import com.google.gson.annotations.Expose;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ChatMessage{

  public String text;
  public String sender;
  public String receiver;
  public String date;
  public String time;
  public boolean isMine;

  public ChatMessage(String sender, String receiver, String text, boolean isMINE) {
    SimpleDateFormat time_formatter = new SimpleDateFormat("HH:mm:ss");
    SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy.");

    this.sender = sender;
    this.receiver = receiver;
    this.text = text;
    isMine = isMINE;
    date = date_formatter.format(new Date());
    time = time_formatter.format(new Date());
  }

}
