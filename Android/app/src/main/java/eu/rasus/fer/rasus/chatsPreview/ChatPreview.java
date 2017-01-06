package eu.rasus.fer.rasus.chatsPreview;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.Date;

public class ChatPreview implements Comparable, Parcelable {

  public String id;
  public String receiver;
  public String image;
  public String lastMessageText;
  public Date lastMessageTime;

  @Override
  public int compareTo(final Object o) {
    ChatPreview message = (ChatPreview) o;
    return -lastMessageTime.compareTo(message.lastMessageTime);
  }

  public ChatPreview() {}

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

  protected ChatPreview(Parcel in) {
    this.id = in.readString();
    this.receiver = in.readString();
    this.image = in.readString();
    this.lastMessageText = in.readString();
    long tmpLastMessageTime = in.readLong();
    this.lastMessageTime = tmpLastMessageTime == -1 ? null : new Date(tmpLastMessageTime);
  }

  public static final Creator<ChatPreview> CREATOR = new Creator<ChatPreview>() {

    @Override
    public ChatPreview createFromParcel(Parcel source) {return new ChatPreview(source);}

    @Override
    public ChatPreview[] newArray(int size) {return new ChatPreview[size];}
  };
}
