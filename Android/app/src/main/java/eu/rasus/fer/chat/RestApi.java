package eu.rasus.fer.chat;

import com.google.gson.JsonElement;

import java.util.List;

import eu.rasus.fer.chat.Chat.ChatMessage;
import eu.rasus.fer.chat.ChatsPreview.ChatPreviewItem;
import eu.rasus.fer.chat.Login.User;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface RestApi {
  @GET("api/messages")
  Call<List<ChatPreviewItem>> getAllMessages(@Header("Authorization") String token);

  @GET("api/messages/{id}")
  Call<List<ChatMessage>> getConversationHistory(@Header("Authorization") String token, @Path("id") String conversationId);

  @FormUrlEncoded
  @POST("api/auth/facebook")
  Call<User> facebookLogin(@Field("id") String id, @Field("username") String username, @Field("image") String image);

  @FormUrlEncoded
  @POST("api/auth/register")
  Call<JsonElement> register(@Field("username") String username, @Field("password") String password);

  @FormUrlEncoded
  @POST("api/auth/login")
  Call<User> login(@Field("username") String username, @Field("password") String password);
}
