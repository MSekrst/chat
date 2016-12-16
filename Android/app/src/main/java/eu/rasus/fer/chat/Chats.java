package eu.rasus.fer.chat;

import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class Chats extends Fragment {

    @BindView(R.id.messageEditText)
    EditText msgEditText;

    @BindView(R.id.msgListView)
    ListView msgListView;

    @BindView(R.id.sendMessageButton)
    ImageButton sendButton;

    public  ArrayList<ChatMessage> chatlist;
    public  ChatAdapter chatAdapter;

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.chat_layout, container, false);
        ButterKnife.bind(this, view);

        msgListView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
        msgListView.setStackFromBottom(true);

        chatlist = new ArrayList<ChatMessage>();
        chatAdapter = new ChatAdapter(getContext(), chatlist);
        msgListView.setAdapter(chatAdapter);
        return view;
    }

    @OnClick(R.id.sendMessageButton)
    public void sendMessage(View v) {
        String message = msgEditText.getEditableText().toString();
        if (!message.equalsIgnoreCase("")) {
            chatAdapter.add(new ChatMessage("user1", "user2", message, true));
            msgEditText.setText("");
            chatAdapter.notifyDataSetChanged();
        }
    }
}
