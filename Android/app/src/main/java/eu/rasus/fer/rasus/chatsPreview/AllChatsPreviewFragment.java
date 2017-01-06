package eu.rasus.fer.rasus.chatsPreview;

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
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnItemClick;
import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.HttpsConstants;
import eu.rasus.fer.rasus.R;
import eu.rasus.fer.rasus.RestApi;
import eu.rasus.fer.rasus.chat.ChatActivity;
import eu.rasus.fer.rasus.chat.ChatMessage;
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

  private Gson gson;

  private Retrofit retrofit;

  private RestApi api;

  private Call<List<ChatPreview>> call;

  private Emitter.Listener handleIncomingMessage = new Emitter.Listener() {

    @Override
    public void call(final Object... args) {

      call.clone().enqueue(new Callback<List<ChatPreview>>() {

        @Override
        public void onResponse(final Call<List<ChatPreview>> call, final Response<List<ChatPreview>> response) {
          List<ChatPreview> chats = new ArrayList<ChatPreview>();

          for (ChatPreview chat : response.body()) {
            if (chat.lastMessageText != null) {
              chats.add(chat);
            }
          }

          chatPreviewAdapter = new ChatPreviewAdapter(getActivity(), chats);

          itemContainer.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
          if (response.body().size() == 0) {
            noChats.setVisibility(View.VISIBLE);
          }
          itemContainer.setAdapter(chatPreviewAdapter);
        }

        @Override
        public void onFailure(final Call<List<ChatPreview>> call, final Throwable t) {

        }
      });
    }
  };

  public Socket socket;

  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_chats_preview, container, false);

    ButterKnife.bind(this, view);

    gson =
      new GsonBuilder()
        .registerTypeAdapter(ChatPreview.class, new ChatPreviewDeserializer())
        .create();

    retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create(gson))
                                              .build();
    api = retrofit.create(RestApi.class);

    call = api.getAllMessages(Application.TOKEN);

    call.enqueue(new Callback<List<ChatPreview>>() {

      @Override
      public void onResponse(final Call<List<ChatPreview>> call, final Response<List<ChatPreview>> response) {
        List<ChatPreview> chats = new ArrayList<ChatPreview>();

        for (ChatPreview chat : response.body()) {
          if (chat.lastMessageText != null) {
            chats.add(chat);
          }
        }

        chatPreviewAdapter = new ChatPreviewAdapter(getActivity(), chats);

        itemContainer.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
        if (response.body().size() == 0) {
          noChats.setVisibility(View.VISIBLE);
        }
        itemContainer.setAdapter(chatPreviewAdapter);
      }

      @Override
      public void onFailure(final Call<List<ChatPreview>> call, final Throwable t) {

      }
    });

    socket = Application.SOCEKT;
    socket.on("message", handleIncomingMessage);

    return view;
  }

  @OnItemClick(R.id.chat_item_container)
  public void openChat(final AdapterView<?> adapter, final View view, final int position, final long id) {
    Intent intent = new Intent(getActivity(), ChatActivity.class);
    intent.putExtra("CHAT_PREVIEW_ITEM", ((ChatPreview) adapter.getItemAtPosition(position)));
    startActivity(intent);
    FragmentTransaction ft = getFragmentManager().beginTransaction();
    ft.remove(this).commit();
  }
}
