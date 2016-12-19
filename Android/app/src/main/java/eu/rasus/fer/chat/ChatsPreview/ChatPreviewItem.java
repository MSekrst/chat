package eu.rasus.fer.chat.ChatsPreview;

import java.util.Date;

public class ChatPreviewItem implements Comparable {

  public String id;
  public String title;
  public String image;
  public String lastMessageText;
  public Date lastMessageTime;

  @Override
  public int compareTo(final Object o) {
    ChatPreviewItem message = (ChatPreviewItem) o;
    return -lastMessageTime.compareTo(message.lastMessageTime);
  }
}
