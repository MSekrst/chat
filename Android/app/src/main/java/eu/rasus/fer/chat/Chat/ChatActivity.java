package eu.rasus.fer.chat.Chat;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.chat.Application;
import eu.rasus.fer.chat.ChatsPreview.ChatPreviewItem;
import eu.rasus.fer.chat.HttpsConstants;
import eu.rasus.fer.chat.R;
import eu.rasus.fer.chat.RestApi;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ChatActivity extends AppCompatActivity {

  @BindView(R.id.chat_toolbar)
  Toolbar toolbar;

  @BindView(R.id.messageEditText)
  EditText msgEditText;

  @BindView(R.id.msgListView)
  ListView msgListView;

  @BindView(R.id.sendMessageButton)
  ImageButton sendButton;

  @BindView(R.id.chat_toolbar_image)
  ImageView image;

  @BindView(R.id.chat_toolbar_title)
  TextView title;

  public ChatAdapter chatAdapter;
  private Gson gson;
  private String receiver;
  private ChatPreviewItem chatInfo;
  private RestApi api;

  private Emitter.Listener handleIncomingMessage = new Emitter.Listener() {

    @Override
    public void call(final Object... args) {
      final ChatMessage chatMessage;

      chatMessage = gson.fromJson(args[0].toString(), ChatMessage.class);
      if (!chatMessage.chatId.equals(chatInfo.id)) return;

      chatMessage.isMine = false;

      new AsyncTask<Void, Void, Void>() {

        @Override
        protected Void doInBackground(final Void... voids) {
          return null;
        }

        @Override
        protected void onPostExecute(final Void v) {
          if (chatAdapter!=null){
            chatAdapter.add(chatMessage);
            chatAdapter.notifyDataSetChanged();
          }

        }
      }.execute();
    }
  };

  public Socket socket;

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.chat_layout);
    ButterKnife.bind(this);

    setSupportActionBar(toolbar);
    getSupportActionBar().setTitle(null);

    Bundle bundle = getIntent().getExtras();
    chatInfo = bundle.getParcelable("CHAT_PREVIEW_ITEM");

    if (chatInfo != null) {
      receiver = chatInfo.receiver;
    }

    title.setText(receiver);
    Picasso.with(this).load(chatInfo.image).placeholder(R.drawable.placeholder).error(R.drawable.placeholder).fit().centerCrop().noFade().into(image);

    socket = Application.SOCEKT;
    socket.on("message", handleIncomingMessage);

    gson = new Gson();

    msgListView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
    msgListView.setStackFromBottom(true);
  }

  @Override
  public void onResume(){
    super.onResume();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                              .build();
    api = retrofit.create(RestApi.class);

    Call<List<ChatMessage>> call = api.getConversationHistory(Application.TOKEN, chatInfo.id);

    final Activity activity = this;
    call.enqueue(new Callback<List<ChatMessage>>() {

      @Override
      public void onResponse(final Call<List<ChatMessage>> call, final Response<List<ChatMessage>> response) {
        chatAdapter = new ChatAdapter(activity, response.body());
        msgListView.setAdapter(chatAdapter);
      }

      @Override
      public void onFailure(final Call<List<ChatMessage>> call, final Throwable t) {

      }
    });

  }

  @OnClick(R.id.sendMessageButton)
  public void sendMessage(View v) {
    String message = msgEditText.getEditableText().toString().trim();
    if (!message.equalsIgnoreCase("")) {
      ChatMessage chatMessage = new ChatMessage(chatInfo.id, Application.USERNAME, receiver, message, true);

      msgEditText.setText("");

      addMessageToAdapter(chatMessage);

      ChatMessageWrapper wrapper = new ChatMessageWrapper();
      wrapper.message = chatMessage;
      Call<Void> call = api.sendMesssage(Application.TOKEN, chatInfo.id, wrapper);

      call.enqueue(new Callback<Void>() {

        @Override
        public void onResponse(final Call<Void> call, final Response<Void> response) {

        }

        @Override
        public void onFailure(final Call<Void> call, final Throwable t) {

        }
      });

    }
  }

  @OnClick(R.id.chat_back)
  public void back(View v) {
    onBackPressed();
  }

  public void addMessageToAdapter(ChatMessage chatMessage) {
    chatAdapter.add(chatMessage);
    chatAdapter.notifyDataSetChanged();
  }
}
