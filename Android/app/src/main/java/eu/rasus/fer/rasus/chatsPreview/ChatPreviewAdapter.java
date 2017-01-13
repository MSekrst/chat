package eu.rasus.fer.rasus.chatsPreview;

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
import eu.rasus.fer.rasus.R;

public class ChatPreviewAdapter extends BaseAdapter {

  private Context context;
  private List<ChatPreview> chatList;

  public ChatPreviewAdapter(final Context context, final List<ChatPreview> chatList) {
    this.context = context;
    this.chatList = chatList;
    Collections.sort(chatList);
  }

  @Override
  public View getView(final int position, View view, final ViewGroup parent) {
    ChatPreview chat = chatList.get(position);
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

  public ChatPreview find(final String id) {
    for (ChatPreview chat : chatList) {
      if (id.equals(chat.id)) {
        return chat;
      }
    }
    return null;
  }

  @Override
  public long getItemId(final int position) {
    return position;
  }

  public void add(ChatPreview object) {
    chatList.add(object);
  }

  @Override
  public void notifyDataSetChanged() {
    Collections.sort(chatList);
    super.notifyDataSetChanged();
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

    public void fillView(ChatPreview chat) {
      title.setText(chat.receiver);
      lastMessage.setText(chat.lastMessageText);

      if (chat.image != null && !chat.image.equals("")) {
        Picasso.with(context).load(chat.image).fit().centerCrop().noFade().into(image);
      } else {
        image.setImageResource(R.drawable.placeholder);
      }

      SimpleDateFormat time_formatter = new SimpleDateFormat("HH:mm");
      SimpleDateFormat date_formatter = new SimpleDateFormat("dd.MM.yyyy");

      lastMessageTime.setText(date_formatter.format(chat.lastMessageTime).equals(date_formatter.format(new Date())) ? time_formatter.format(chat.lastMessageTime)
                                                                                                                    : date_formatter.format(chat.lastMessageTime));
    }
  }
}
