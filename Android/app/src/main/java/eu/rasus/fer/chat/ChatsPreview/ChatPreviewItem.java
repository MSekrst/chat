package eu.rasus.fer.chat.ChatsPreview;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.Date;

public class ChatPreviewItem implements Comparable, Parcelable {

  public String id;
  public String receiver;
  public String image;
  public String lastMessageText;
  public Date lastMessageTime;

  @Override
  public int compareTo(final Object o) {
    ChatPreviewItem message = (ChatPreviewItem) o;
    return -lastMessageTime.compareTo(message.lastMessageTime);
  }

  public ChatPreviewItem() {}

  @Override
  public int describeContents() { return 0; }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(this.id);
    dest.writeString(this.receiver);
    dest.writeString(this.image);
    dest.writeString(this.lastMessageText);
    dest.writeLong(this.lastMessageTime != null ? this.lastMessageTime.getTime() : -1);
  }

  protected ChatPreviewItem(Parcel in) {
    this.id = in.readString();
    this.receiver = in.readString();
    this.image = in.readString();
    this.lastMessageText = in.readString();
    long tmpLastMessageTime = in.readLong();
    this.lastMessageTime = tmpLastMessageTime == -1 ? null : new Date(tmpLastMessageTime);
  }

  public static final Creator<ChatPreviewItem> CREATOR = new Creator<ChatPreviewItem>() {

    @Override
    public ChatPreviewItem createFromParcel(Parcel source) {return new ChatPreviewItem(source);}

    @Override
    public ChatPreviewItem[] newArray(int size) {return new ChatPreviewItem[size];}
  };
}
