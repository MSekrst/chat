package eu.rasus.fer.rasus.contactList;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.OnItemClick;
import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.HttpsConstants;
import eu.rasus.fer.rasus.R;
import eu.rasus.fer.rasus.RestApi;
import eu.rasus.fer.rasus.chat.ChatActivity;
import eu.rasus.fer.rasus.chatsPreview.ChatPreview;
import eu.rasus.fer.rasus.chatsPreview.ChatPreviewDeserializer;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ContactListActivity extends AppCompatActivity {

  public ChatUserAdapter chatUserAdapter;

  @BindView(R.id.users_container)
  ListView container;

  @BindView(R.id.toolbar_all_users)
  Toolbar toolbar;

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_contact_list);
    ButterKnife.bind(this);

    setSupportActionBar(toolbar);
    getSupportActionBar().setTitle(null);
  }

  @Override
  public void onResume() {
    super.onResume();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                              .build();
    RestApi api = retrofit.create(RestApi.class);

    Call<List<ChatUser>> call = api.getAllUsers(Application.TOKEN);

    final Activity activity = this;
    call.enqueue(new Callback<List<ChatUser>>() {

      @Override
      public void onResponse(final Call<List<ChatUser>> call, final Response<List<ChatUser>> response) {
        chatUserAdapter = new ChatUserAdapter(activity, response.body());
        container.setAdapter(chatUserAdapter);
      }

      @Override
      public void onFailure(final Call<List<ChatUser>> call, final Throwable t) {

      }
    });
  }

  @OnClick(R.id.all_users_back)
  public void back() {
    onBackPressed();
  }

  @OnItemClick(R.id.users_container)
  public void newChat(final AdapterView<?> adapter, final View view, final int position, final long id) {

    Gson gson =
      new GsonBuilder()
        .registerTypeAdapter(ChatPreview.class, new ChatPreviewDeserializer())
        .create();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create(gson))
                                              .build();

    RestApi api = retrofit.create(RestApi.class);

    List<ChatUser> users = new ArrayList<>();
    users.add((ChatUser) adapter.getItemAtPosition(position));

    ChatUserWrapper chatUserWrapper = new ChatUserWrapper();
    chatUserWrapper.users = users;
    Call<ChatPreview> call = api.init(Application.TOKEN, chatUserWrapper);

    final Activity activity = this;
    call.enqueue(new Callback<ChatPreview>() {

      @Override
      public void onResponse(final Call<ChatPreview> call, final Response<ChatPreview> response) {
        Intent intent = new Intent(activity, ChatActivity.class);
        intent.putExtra("CHAT_PREVIEW_ITEM", response.body());
        startActivity(intent);
      }

      @Override
      public void onFailure(final Call<ChatPreview> call, final Throwable t) {
        int s = 1 + 2;
      }
    });
  }
}
