package eu.rasus.fer.chat;

import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Window;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;

public class RegisterView extends AppCompatActivity {

  @BindView(R.id.chitChatReg)
  TextView mChitChat;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(R.layout.activity_register_view);
    ButterKnife.bind(this);

    Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/Pacifico.ttf");
    mChitChat.setTypeface(tf);
  }
}
