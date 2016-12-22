package eu.rasus.fer.chat.Chat;

import android.content.Context;
import android.graphics.Color;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import eu.rasus.fer.chat.Application;
import eu.rasus.fer.chat.HttpsConstants;
import eu.rasus.fer.chat.R;

public class ChatAdapter extends BaseAdapter {

  List<ChatMessage> chatMessageList;
  Context context;

  public ChatAdapter(Context context, List<ChatMessage> list) {
    chatMessageList = list;
    this.context = context;

    for (ChatMessage m: chatMessageList)
      m.isMine = m.sender.equals(Application.USERNAME) ? true : false;
  }

  @Override
  public View getView(final int position, View view, final ViewGroup parent) {
    ChatMessage message = chatMessageList.get(position);
    ViewHolder viewHolder;

    if (view == null) {
      LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
      view = inflater.inflate(R.layout.chatbubble, parent, false);
      viewHolder = new ViewHolder(view, context);
      view.setTag(viewHolder);
    } else {
      viewHolder = (ViewHolder) view.getTag();
    }
    viewHolder.fillView(message);
    return view;
  }

  @Override
  public int getCount() {
    return chatMessageList.size();
  }

  @Override
  public Object getItem(final int position) {
    return position;
  }

  @Override
  public long getItemId(final int position) {
    return position;
  }

  public void add(ChatMessage object) {
    chatMessageList.add(object);
  }

  static class ViewHolder {

    @BindView(R.id.bubble_layout)
    LinearLayout bubble_layout;
    @BindView(R.id.bubble_layout_parent)
    LinearLayout parent;
    @BindView(R.id.message_text)
    TextView message_text;

    Context context;

    public ViewHolder(View view, Context context) {
      ButterKnife.bind(this, view);
      this.context = context;
    }

    public void fillView(ChatMessage message) {
      message_text.setText(message.text);

      if (message.isMine) {
        bubble_layout.setBackgroundResource(R.drawable.bubble2);
        parent.setGravity(Gravity.RIGHT);
      } else {
        bubble_layout.setBackgroundResource(R.drawable.bubble1);
        parent.setGravity(Gravity.LEFT);
      }

      message_text.setTextColor(Color.BLACK);
    }
  }
}
