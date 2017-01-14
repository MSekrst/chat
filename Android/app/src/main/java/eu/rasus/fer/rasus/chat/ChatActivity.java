package eu.rasus.fer.rasus.chat;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.HttpsConstants;
import eu.rasus.fer.rasus.R;
import eu.rasus.fer.rasus.RestApi;
import eu.rasus.fer.rasus.chatsPreview.ChatPreview;
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
  private ChatPreview chatInfo;

  private Emitter.Listener handleIncomingMessage = new Emitter.Listener() {

    @Override
    public void call(final Object... args) {
      final ChatMessage chatMessage;

      chatMessage = gson.fromJson(args[0].toString(), ChatMessage.class);
      if (!chatMessage.chatId.equals(chatInfo.id)) {
        return;
      }

      chatMessage.isMine = false;

      new AsyncTask<Void, Void, Void>() {

        @Override
        protected Void doInBackground(final Void... voids) {
          return null;
        }

        @Override
        protected void onPostExecute(final Void v) {
          if (chatAdapter != null) {
            chatAdapter.add(chatMessage);
            chatAdapter.notifyDataSetChanged();
          }
        }
      }.execute();
    }
  };

  public Socket socket;

  protected static final int PICK_FILE = 1;

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_chat);
    ButterKnife.bind(this);

    setSupportActionBar(toolbar);
    getSupportActionBar().setTitle(null);

    Bundle bundle = getIntent().getExtras();
    chatInfo = bundle.getParcelable("CHAT_PREVIEW_ITEM");

    if (chatInfo != null) {
      receiver = chatInfo.receiver;
    }

    title.setText(receiver);

    if (chatInfo.image != null && !chatInfo.image.equals("")) {
      Picasso.with(this).load(chatInfo.image).fit().centerCrop().noFade().into(image);
    } else {
      image.setImageResource(R.drawable.placeholder);
    }

    socket = Application.SOCEKT;
    socket.on("message", handleIncomingMessage);

    gson = new Gson();

    msgListView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
    msgListView.setStackFromBottom(true);
    msgListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

      @Override
      public void onItemClick(final AdapterView<?> adapter, final View view, final int position, final long l) {
        final ChatMessage message = (ChatMessage) chatAdapter.getItem(position);

        if (message.fileId != null && !message.fileId.equals("")) {
          Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(
            GsonConverterFactory.create())
                                                    .build();
          RestApi api = retrofit.create(RestApi.class);

          Call<byte[]> call = api.downloadFile(Application.TOKEN, message.fileId);
//
          call.enqueue(new Callback<byte[]>() {

            @Override
            public void onResponse(final Call<byte[]> call, final Response<byte[]> response) {
              Bitmap bitmap = BitmapFactory.decodeByteArray(response.body(), 0, response.body().length);
              String filename = message.text;
              String path = getExternalFilesDir(null) + File.separator + "ChitChat";
              File dir = new File(path);

              dir.mkdirs();

              try {
                File file = new File(dir, filename);
                file.createNewFile();
                FileOutputStream out = new FileOutputStream(file);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
                out.flush();
                out.close();
                Toast.makeText(getBaseContext(), filename + " downloaded successfully!", Toast.LENGTH_LONG).show();
              } catch (Exception e) {
                e.printStackTrace();
              }
            }

            @Override
            public void onFailure(final Call<byte[]> call, final Throwable t) {

            }
          });
        }
      }
    });
  }

  @Override
  public void onResume() {
    super.onResume();

    if (!Application.SOCEKT.connected()) {
      Application.SOCEKT.connect();
      Application.SOCEKT.emit("userAndroid", Application.USERNAME);
    }

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                              .build();
    RestApi api = retrofit.create(RestApi.class);

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
      ChatMessage chatMessage = new ChatMessage(chatInfo.id, Application.USERNAME, message, true);

      msgEditText.setText("");

      addMessageToAdapter(chatMessage);

      ChatMessageWrapper wrapper = new ChatMessageWrapper();
      wrapper.message = chatMessage;

      Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                                .build();

      RestApi api = retrofit.create(RestApi.class);

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

  @OnClick(R.id.chat_send_file)
  public void sendFile() {
    Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.INTERNAL_CONTENT_URI);
    intent.setType("image/*");
    startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_FILE);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == PICK_FILE && resultCode == Activity.RESULT_OK) {
      if (data == null) {
        return;
      }

      try {
        Uri uri = data.getData();
        String realPathFromURI = getRealPathFromURI(uri);
        String filename = realPathFromURI.substring(realPathFromURI.lastIndexOf("/") + 1);

        Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), uri);

        Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                                  .build();

        RestApi api = retrofit.create(RestApi.class);

        ChatMessage chatMessage = new ChatMessage(chatInfo.id, Application.USERNAME, filename, true);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 50, stream);
        chatMessage.bin = stream.toByteArray();

        ChatMessageWrapper wrapper = new ChatMessageWrapper();
        wrapper.message = chatMessage;
        Call<ChatMessage> call = api.sendFile(Application.TOKEN, chatInfo.id, wrapper);

        call.enqueue(new Callback<ChatMessage>() {

          @Override
          public void onResponse(final Call<ChatMessage> call, final Response<ChatMessage> response) {
            ChatMessage message = response.body();
            message.isMine = true;
            chatAdapter.add(message);
            chatAdapter.notifyDataSetChanged();
          }

          @Override
          public void onFailure(final Call<ChatMessage> call, final Throwable t) {
          }
        });
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  public String getRealPathFromURI(Uri contentUri) {
// can post image
    String[] proj = {MediaStore.Images.Media.DATA};
    Cursor cursor = managedQuery(contentUri,
                                 proj, // Which columns to return
                                 null, // WHERE clause; which rows to return (all rows)
                                 null, // WHERE clause selection arguments (none)
                                 null); // Order-by clause (ascending by name)
    int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
    cursor.moveToFirst();
    return cursor.getString(column_index);
  }
}
