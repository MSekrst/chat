package eu.rasus.fer.rasus.chatsPreview;

import com.google.gson.Gson;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.chat.ChatMessage;

public class ChatPreviewDeserializer implements JsonDeserializer<ChatPreview> {

  @Override
  public ChatPreview deserialize(final JsonElement json, final Type typeOfT, final JsonDeserializationContext context) throws JsonParseException {

    JsonObject conversation = json.getAsJsonObject();
    ChatPreview chatPreview = new ChatPreview();

    chatPreview.id = conversation.get("_id").toString().substring(1, conversation.get("_id").toString().length() - 1);

    Gson gson = new Gson();
    User[] users = gson.fromJson(conversation.getAsJsonArray("users"), User[].class);

    if (users.length == 2) {
      chatPreview.receiver = users[0].username.equals(Application.USERNAME) ? users[1].username : users[0].username;
      chatPreview.image = users[0].username.equals(Application.USERNAME) ? users[1].image : users[0].image;
    } else {
      chatPreview.receiver = conversation.get("title").toString();
    }

    ChatMessage[] messages = gson.fromJson(conversation.getAsJsonArray("messages"), ChatMessage[].class);

    if (messages.length > 0) {
      ChatMessage lastMessage = messages[messages.length - 1];
      chatPreview.lastMessageText = lastMessage.text;

      try {
        SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
        chatPreview.lastMessageTime = date_formatter.parse(lastMessage.date + " " + lastMessage.time);
      } catch (ParseException e) {
        e.printStackTrace();
      }
    }

    return chatPreview;
  }

  private class User {

    String username;
    String image;
  }
}
