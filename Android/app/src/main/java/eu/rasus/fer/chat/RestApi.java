package eu.rasus.fer.chat;

import java.util.List;

import eu.rasus.fer.chat.Chat.ChatMessage;
import eu.rasus.fer.chat.ChatsPreview.ChatPreviewItem;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.Path;

public interface RestApi {
//  // Bruna
//  @Headers("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODU3ZDMyNWU0NWI0MDIzNjAwYWU2NjkiLCJ1c2VybmFtZSI6ImJydW5hIiwicGFzc3dvcmQiOiJzaGExJDM5NGIyN2MzJDEkMTk0OWMwYjczZDRkMzQzYWFiNjgwMzZhYWI5MWZmNDJmMWQwMDkyNSIsImltYWdlIjoiaHR0cHM6Ly9zY29udGVudC5memFnMS0xLmZuYS5mYmNkbi5uZXQvdi90MS4wLTkvMTUxOTI1MjJfMTQ4Mzg0MzYyMTYzMjYxM180NTE1MDI5Nzg1NTk0MTA4MTI5X24uanBnP29oPWYyYTM1ZGNhZWNhYjkzMGQzYmQ1NDdjYTI3Y2JmYTRmJm9lPTU4QjRGNUFGIiwiaWF0IjoxNDgyMTY1MDcyfQ.5sjL8EKh8WHpQHbW5Ib1c9mUQFUmlI2cWFy_gS2RAxs")

  //  TEA
@Headers("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJfaWQiOiI1ODU2ZmE2OWQ5MzJmODIyZTRiY2RmZmUiLCJ1c2VybmFtZSI6InRlYSIsInBhc3N3b3JkIjoic2hhMSRlZjkxMDNlNiQxJGFkYjk1YWRiNWYyZTMxZjZmYTE2ZjhhMTkzOGQzNTc3ZTAwNWVmYzEiLCJpYXQiOjE0ODIwOTUyMTN9.4q8NyLWPZaHCDTEV-F6nOIBcYvw08gKZlSq100isR8g")

  @GET("api/messages")
  Call<List<ChatPreviewItem>> getAllMessages();

  @Headers("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJfaWQiOiI1ODU2ZmE2OWQ5MzJmODIyZTRiY2RmZmUiLCJ1c2VybmFtZSI6InRlYSIsInBhc3N3b3JkIjoic2hhMSRlZjkxMDNlNiQxJGFkYjk1YWRiNWYyZTMxZjZmYTE2ZjhhMTkzOGQzNTc3ZTAwNWVmYzEiLCJpYXQiOjE0ODIwOTUyMTN9.4q8NyLWPZaHCDTEV-F6nOIBcYvw08gKZlSq100isR8g")
  @GET("api/messages/{id}")
  Call<List<ChatMessage>> getConversationHistory(@Path("id") String conversationId);
}
