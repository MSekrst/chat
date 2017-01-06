package eu.rasus.fer.rasus.contactList;

public class ChatUser implements Comparable {

  public String _id;
  public String username;
  public String image;

  @Override
  public int compareTo(final Object o) {
    ChatUser u = (ChatUser) o;
    return this.username.toLowerCase().compareTo(((ChatUser) o).username.toLowerCase());
  }
}
