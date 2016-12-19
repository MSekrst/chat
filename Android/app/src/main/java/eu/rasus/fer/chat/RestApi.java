package eu.rasus.fer.chat;

import java.util.List;

import eu.rasus.fer.chat.ChatsPreview.ChatPreviewItem;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Headers;

public interface RestApi {

  @Headers("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJfaWQiOiI1ODU2ZmE2OWQ5MzJmODIyZTRiY2RmZmUiLCJ1c2VybmFtZSI6InRlYSIsInBhc3N3b3JkIjoic2hhMSRlZjkxMDNlNiQxJGFkYjk1YWRiNWYyZTMxZjZmYTE2ZjhhMTkzOGQzNTc3ZTAwNWVmYzEiLCJpYXQiOjE0ODIwOTUyMTN9.4q8NyLWPZaHCDTEV-F6nOIBcYvw08gKZlSq100isR8g")

  @GET("api/messages")
  Call<List<ChatPreviewItem>> getAllMessages();
}
