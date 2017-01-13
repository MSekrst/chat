package eu.rasus.fer.rasus.chat;

import android.util.Base64OutputStream;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ChatMessage {

  public String chatId;
  public String text;
  public String  title;
  public String sender;
  public String date;
  public String time;
  public String fileId;
  public short[] bin;

  public transient boolean  isMine;

  public ChatMessage(String chatId, String sender, String text, boolean isMINE) {
    SimpleDateFormat time_formatter = new SimpleDateFormat("HH:mm:ss");
    SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy");

    this.chatId = chatId;
    this.sender = sender;
    this.text = text;
    title = "";
    isMine = isMINE;
    date = date_formatter.format(new Date());
    time = time_formatter.format(new Date());
  }
}
