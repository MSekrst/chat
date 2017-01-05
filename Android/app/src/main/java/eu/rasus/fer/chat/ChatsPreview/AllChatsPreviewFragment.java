package eu.rasus.fer.chat.ChatsPreview;

import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnItemClick;
import eu.rasus.fer.chat.Application;
import eu.rasus.fer.chat.Chat.ChatActivity;
import eu.rasus.fer.chat.Chat.ChatMessage;
import eu.rasus.fer.chat.HttpsConstants;
import eu.rasus.fer.chat.R;
import eu.rasus.fer.chat.RestApi;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AllChatsPreviewFragment extends Fragment {

  @BindView(R.id.chat_item_container)
  ListView itemContainer;

  @BindView(R.id.no_chats_text)
  TextView noChats;

  private ChatPreviewAdapter chatPreviewAdapter;

  private Call<List<ChatPreviewItem>> call;

  private Emitter.Listener handleIncomingMessage = new Emitter.Listener() {

    @Override
    public void call(final Object... args) {
      final ChatMessage chatMessage;

      Gson gson = new Gson();
      chatMessage = gson.fromJson(args[0].toString(), ChatMessage.class);
      chatMessage.isMine = false;

      new AsyncTask<Void, Void, Void>() {

        @Override
        protected Void doInBackground(final Void... voids) {
          return null;
        }

        @Override
        protected void onPostExecute(final Void v) {
          ChatPreviewItem chatPreviewItem= chatPreviewAdapter.find(chatMessage.chatId);
          chatPreviewItem.lastMessageText=chatMessage.text;
          try {
            SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy. HH:mm:ss");
            chatPreviewItem.lastMessageTime = date_formatter.parse(chatMessage.date + " " + chatMessage.time);
          } catch (ParseException e) {
            e.printStackTrace();
          }
          chatPreviewAdapter.notifyDataSetChanged();
        }
      }.execute();


    }
  };

  public Socket socket;

  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.chats_preview, container, false);

    ButterKnife.bind(this, view);

    Gson gson =
      new GsonBuilder()
        .registerTypeAdapter(ChatPreviewItem.class, new ChatPreviewItemDeserializer())
        .create();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create(gson))
                                              .build();
    RestApi api = retrofit.create(RestApi.class);

    call = api.getAllMessages(Application.TOKEN);

    call.enqueue(new Callback<List<ChatPreviewItem>>() {

      @Override
      public void onResponse(final Call<List<ChatPreviewItem>> call, final Response<List<ChatPreviewItem>> response) {
        chatPreviewAdapter = new ChatPreviewAdapter(getActivity(), response.body());

        itemContainer.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
        if (response.body().size() == 0) {
          noChats.setVisibility(View.VISIBLE);
        }
        itemContainer.setAdapter(chatPreviewAdapter);
      }

      @Override
      public void onFailure(final Call<List<ChatPreviewItem>> call, final Throwable t) {

      }
    });

    socket = Application.SOCEKT;
    socket.on("message", handleIncomingMessage);


    return view;
  }

  @OnItemClick(R.id.chat_item_container)
  public void openChat(final AdapterView<?> adapter, final View view, final int position, final long id) {
    Intent intent = new Intent(getActivity(), ChatActivity.class);
    intent.putExtra("CHAT_PREVIEW_ITEM", ((ChatPreviewItem) adapter.getItemAtPosition(position)));
    startActivity(intent);
    FragmentTransaction ft = getFragmentManager().beginTransaction();
    ft.remove(this).commit();
  }
}
