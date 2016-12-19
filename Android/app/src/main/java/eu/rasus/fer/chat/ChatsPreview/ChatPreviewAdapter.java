package eu.rasus.fer.chat.ChatsPreview;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import eu.rasus.fer.chat.R;

public class ChatPreviewAdapter extends BaseAdapter {

  private Context context;
  private List<ChatPreviewItem> chatList;

  public ChatPreviewAdapter(final Context context, final List<ChatPreviewItem> chatList) {
    this.context = context;
    this.chatList = chatList;
    Collections.sort(chatList);
  }

  @Override
  public View getView(final int position, View view, final ViewGroup parent) {
    ChatPreviewItem chat = chatList.get(position);
    ViewHolder viewHolder;

    if (view == null) {
      LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
      view = inflater.inflate(R.layout.chat_preview_item, parent, false);
      viewHolder = new ViewHolder(view, context);
      view.setTag(viewHolder);
    } else {
      viewHolder = (ViewHolder) view.getTag();
    }
    viewHolder.fillView(chat);
    return view;
  }

  @Override
  public int getCount() {
    return chatList.size();
  }

  @Override
  public Object getItem(final int position) {
    return chatList.get(position);
  }

  @Override
  public long getItemId(final int position) {
    return position;
  }

  public void add(ChatPreviewItem object) {
    chatList.add(object);
  }

  static class ViewHolder {

    @BindView(R.id.chat_item_image)
    ImageView image;
    @BindView(R.id.chat_item_title)
    TextView title;
    @BindView(R.id.last_message)
    TextView lastMessage;
    @BindView(R.id.last_message_time)
    TextView lastMessageTime;

    Context context;

    public ViewHolder(View view, Context context) {
      ButterKnife.bind(this, view);
      this.context = context;
    }

    public void fillView(ChatPreviewItem chat) {
      title.setText(chat.title);
      lastMessage.setText(chat.lastMessageText);

      Picasso.with(context).load(chat.image).placeholder(R.drawable.placeholder).error(R.drawable.placeholder).fit().centerCrop().noFade().into(image);

      SimpleDateFormat time_formatter = new SimpleDateFormat("HH:mm");
      SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy.");

      lastMessageTime.setText(date_formatter.format(chat.lastMessageTime).equals(date_formatter.format(new Date())) ? time_formatter.format(chat.lastMessageTime)
                                                                                                                    : date_formatter.format(chat.lastMessageTime));
    }
  }
}
