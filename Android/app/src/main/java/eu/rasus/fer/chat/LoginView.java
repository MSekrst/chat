package eu.rasus.fer.chat;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LoginView extends AppCompatActivity {

  @BindView(R.id.chitChatLogin)
  TextView mChitChat;

  @BindView(R.id.here_register)
  TextView mHere;

  CallbackManager mCallbackManager;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(R.layout.activity_login_view);
    ButterKnife.bind(this);

    Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/Pacifico.ttf");
    mChitChat.setTypeface(tf);

    mHere.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        Intent i = new Intent(view.getContext(), RegisterView.class);
        startActivity(i);
      }
    });


    FacebookSdk.sdkInitialize(this.getApplicationContext());
    mCallbackManager = CallbackManager.Factory.create();

    LoginManager.getInstance().registerCallback(mCallbackManager,
      new FacebookCallback<LoginResult>() {
        @Override
        public void onSuccess(LoginResult loginResult) {
          // App code
        }

        @Override
        public void onCancel() {
          // App code
        }

        @Override
        public void onError(FacebookException exception) {
          // App code
        }
      });
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    mCallbackManager.onActivityResult(requestCode, resultCode, data);
  }
}
