package eu.rasus.fer.chat;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;

public class RegisterView extends AppCompatActivity {

  @BindView(R.id.chitChatReg)
  TextView mChitChat;

  @BindView(R.id.register_button)
  Button registerBtn;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(R.layout.activity_register_view);
    ButterKnife.bind(this);

    Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/Pacifico.ttf");
    mChitChat.setTypeface(tf);

    registerBtn.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        Intent i = new Intent(view.getContext(), MainActivity.class);
        startActivity(i);
      }
    });
  }
}
