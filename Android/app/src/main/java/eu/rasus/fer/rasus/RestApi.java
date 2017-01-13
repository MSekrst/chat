package eu.rasus.fer.rasus;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.InputStream;
import java.util.List;

import eu.rasus.fer.rasus.contactList.ChatUser;
import eu.rasus.fer.rasus.contactList.ChatUserWrapper;
import eu.rasus.fer.rasus.chat.ChatMessage;
import eu.rasus.fer.rasus.chat.ChatMessageWrapper;
import eu.rasus.fer.rasus.chatsPreview.ChatPreview;
import eu.rasus.fer.rasus.login.User;
import eu.rasus.fer.rasus.profile.Profile;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface RestApi {

  @GET("api/messages")
  Call<List<ChatPreview>> getAllMessages(@Header("Authorization") String token);

  @GET("api/messages/{chatId}")
  Call<List<ChatMessage>> getConversationHistory(@Header("Authorization") String token, @Path("chatId") String conversationId);

  @FormUrlEncoded
  @POST("api/auth/facebook")
  Call<User> facebookLogin(@Field("chatId") String id, @Field("username") String username, @Field("image") String image);

  @FormUrlEncoded
  @POST("api/auth/register")
  Call<JsonElement> register(@Field("username") String username, @Field("password") String password);

  @FormUrlEncoded
  @POST("api/auth/login")
  Call<User> login(@Field("username") String username, @Field("password") String password);

  @Headers("Content-Type: application/json")
  @POST("api/messages/{chatId}")
  Call<Void> sendMesssage(@Header("Authorization") String token, @Path("chatId") String conversationId, @Body ChatMessageWrapper message);

  @GET("api/messages/users")
  Call<List<ChatUser>> getAllUsers(@Header("Authorization") String token);

  @Headers("Content-Type: application/json")
  @POST("api/messages/init")
  Call<ChatPreview> init(@Header("Authorization") String token, @Body ChatUserWrapper users);

  @Headers("Content-Type: application/json")
  @POST("api/messages/uploadFile/{chatId}")
  Call<ChatMessage> sendFile(@Header("Authorization") String token, @Path("chatId") String conversationId, @Body ChatMessageWrapper message);

  @GET("api/messages/getFile/{fileId}")
  Call< byte[] > downloadFile(@Header("Authorization") String token, @Path("fileId") String fileId);

  @GET("api/users/profile")
  Call<Profile> getProfile(@Header("Authorization") String token);
}
