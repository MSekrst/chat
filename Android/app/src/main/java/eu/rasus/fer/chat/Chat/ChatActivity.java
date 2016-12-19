package eu.rasus.fer.chat.Chat;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.chat.HttpsConstants;
import eu.rasus.fer.chat.R;

public class ChatActivity extends AppCompatActivity {

  @BindView(R.id.messageEditText)
  EditText msgEditText;

  @BindView(R.id.msgListView)
  ListView msgListView;

  @BindView(R.id.sendMessageButton)
  ImageButton sendButton;

  public ArrayList<ChatMessage> chatlist;
  public ChatAdapter chatAdapter;

  private Gson gson;

  private String sender;

  private String receiver;

  private Emitter.Listener handleIncomingMessage = new Emitter.Listener() {

    @Override
    public void call(final Object... args) {

      final ChatMessage chatMessage;
      try {
        chatMessage = gson.fromJson(((JSONObject) args[0]).get("data").toString(), ChatMessage.class);
        chatMessage.isMine = false;
        runOnUiThread(new Runnable() {

          @Override
          public void run() {
            addMessageToAdapter(chatMessage);
          }
        });
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
  };

  public Socket socket;

  {
    socket = HttpsConstants.getUnsafeOkSocket();
  }

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    socket.connect();
    socket.emit("user", sender);
    socket.on("message", handleIncomingMessage);

    setContentView(R.layout.chat_layout);
    ButterKnife.bind(this);

    Intent intent = getIntent();
    sender = intent.getStringExtra("SENDER");
    receiver = intent.getStringExtra("RECEIVER");


    gson = new Gson();

    msgListView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
    msgListView.setStackFromBottom(true);

    chatlist = new ArrayList<>();
    chatAdapter = new ChatAdapter(this, chatlist);
    msgListView.setAdapter(chatAdapter);
  }

  @OnClick(R.id.sendMessageButton)
  public void sendMessage(View v) {
    String message = msgEditText.getEditableText().toString().trim();
    if (!message.equalsIgnoreCase("")) {
      ChatMessage chatMessage = new ChatMessage(sender, receiver, message, true);

      msgEditText.setText("");

      addMessageToAdapter(chatMessage);

      socket.emit("message", gson.toJson(chatMessage));
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    socket.disconnect();
  }

  public void addMessageToAdapter(ChatMessage chatMessage) {
    chatAdapter.add(chatMessage);
    chatAdapter.notifyDataSetChanged();
  }
}
