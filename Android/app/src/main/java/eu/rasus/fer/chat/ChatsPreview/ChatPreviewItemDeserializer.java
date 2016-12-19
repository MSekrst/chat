package eu.rasus.fer.chat.ChatsPreview;

import com.google.gson.Gson;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import eu.rasus.fer.chat.Chat.ChatMessage;
import eu.rasus.fer.chat.HttpsConstants;

public class ChatPreviewItemDeserializer implements JsonDeserializer<ChatPreviewItem> {

  @Override
  public ChatPreviewItem deserialize(final JsonElement json, final Type typeOfT, final JsonDeserializationContext context) throws JsonParseException {

    JsonObject conversation = json.getAsJsonObject();
    ChatPreviewItem chatPreviewItem = new ChatPreviewItem();

    chatPreviewItem.id = conversation.get("_id").toString().substring(1,conversation.get("_id").toString().length()-1);

    Gson gson = new Gson();
    User[] users = gson.fromJson(conversation.getAsJsonArray("users"), User[].class);

    if (users.length ==2) {
      chatPreviewItem.receiver = users[0].username.equals(HttpsConstants.ME) ? users[1].username : users[0].username;
      chatPreviewItem.image = users[0].username.equals(HttpsConstants.ME)? users[1].image : users[0].image;
    }
    else chatPreviewItem.receiver = conversation.get("title").toString();

    ChatMessage[] messages = gson.fromJson(conversation.getAsJsonArray("messages"), ChatMessage[].class);

    ChatMessage lastMessage = messages[messages.length -1];

    chatPreviewItem.lastMessageText = lastMessage.text;

    try {
      SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy. HH:mm:ss");
      chatPreviewItem.lastMessageTime = date_formatter.parse(lastMessage.date + " " + lastMessage.time);
    } catch (ParseException e) {
      e.printStackTrace();
    }

    return chatPreviewItem;
  }

  private class User{
    String username;
    String image;
  }
}
