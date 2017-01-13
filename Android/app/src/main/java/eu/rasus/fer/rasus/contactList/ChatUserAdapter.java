package eu.rasus.fer.rasus.contactList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.util.Collections;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import eu.rasus.fer.rasus.R;

public class ChatUserAdapter extends BaseAdapter {

  private final Context context;
  private final List<ChatUser> users;

  public ChatUserAdapter(final Context context, final List<ChatUser> users) {
    this.context = context;
    this.users = users;
    Collections.sort(users);
  }

  @Override
  public View getView(final int position, View view, final ViewGroup parent) {
    ChatUser user = users.get(position);
    ViewHolder viewHolder;

    if (view == null) {
      LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
      view = inflater.inflate(R.layout.user_preview_item, parent, false);
      viewHolder = new ViewHolder(view, context);
      view.setTag(viewHolder);
    } else {
      viewHolder = (ViewHolder) view.getTag();
    }
    viewHolder.fillView(user);
    return view;
  }

  @Override
  public int getCount() {
    return users.size();
  }

  @Override
  public Object getItem(final int position) {
    return users.get(position);
  }

  @Override
  public long getItemId(final int position) {
    return position;
  }

  public void add(ChatUser object) {
    users.add(object);
  }

  @Override
  public void notifyDataSetChanged() {
    Collections.sort(users);
    super.notifyDataSetChanged();
  }

  static class ViewHolder {

    @BindView(R.id.user_image)
    ImageView image;
    @BindView(R.id.user_username)
    TextView username;

    Context context;

    public ViewHolder(View view, Context context) {
      ButterKnife.bind(this, view);
      this.context = context;
    }

    public void fillView(ChatUser user) {
      username.setText(user.username);
      Picasso.with(context).cancelRequest(image);
      if (user.image != null && !user.image.equals("")) {
        Picasso.with(context).load(user.image).placeholder(R.drawable.placeholder).error(R.drawable.placeholder).fit().centerCrop().noFade().into(image);
      }
      else image.setImageResource(R.drawable.placeholder);
      }
  }
}
