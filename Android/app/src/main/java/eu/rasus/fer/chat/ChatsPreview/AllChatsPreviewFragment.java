package eu.rasus.fer.chat.ChatsPreview;

import android.content.Intent;
import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnItemClick;
import eu.rasus.fer.chat.Application;
import eu.rasus.fer.chat.Chat.ChatActivity;
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

//  public Socket socket;
//  {
//    socket = HttpsConstants.getUnsafeOkSocket();
//  }

  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.chats_preview, container, false);

    ButterKnife.bind(this, view);

    Gson gson =
      new GsonBuilder()
        .registerTypeAdapter(ChatPreviewItem.class, new ChatPreviewItemDeserializer())
        .create();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create(gson)).build();
    RestApi api = retrofit.create(RestApi.class);

    Call<List<ChatPreviewItem>> call = api.getAllMessages(Application.TOKEN);

    call.enqueue(new Callback<List<ChatPreviewItem>>() {

      @Override
      public void onResponse(final Call<List<ChatPreviewItem>> call, final Response<List<ChatPreviewItem>> response) {
        chatPreviewAdapter = new ChatPreviewAdapter(getActivity(), response.body());

        itemContainer.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
        if (response.body().size()==0) noChats.setVisibility(View.VISIBLE);
        itemContainer.setAdapter(chatPreviewAdapter);
      }

      @Override
      public void onFailure(final Call<List<ChatPreviewItem>> call, final Throwable t) {

      }
    });

    return view;
  }

  @OnItemClick(R.id.chat_item_container)
  public void openChat(final AdapterView<?> adapter, final View view, final int position, final long id) {
    Intent intent = new Intent(getActivity(), ChatActivity.class);
    intent.putExtra("SENDER", Application.USERNAME);
    intent.putExtra("CHAT_PREVIEW_ITEM", ((ChatPreviewItem)adapter.getItemAtPosition(position)));
    startActivity(intent);
  }
}
