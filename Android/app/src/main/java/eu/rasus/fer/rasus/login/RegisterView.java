package eu.rasus.fer.rasus.login;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.JsonElement;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.rasus.HttpsConstants;
import eu.rasus.fer.rasus.R;
import eu.rasus.fer.rasus.RestApi;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RegisterView extends AppCompatActivity {

  @BindView(R.id.chitChatReg)
  TextView mChitChat;

  @BindView(R.id.register_button)
  Button registerBtn;

  @BindView(R.id.register_username)
  TextView usernameView;

  @BindView(R.id.register_password)
  TextView passwordView;

  @BindView(R.id.register_repeat_password)
  TextView repeatPasswordView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    setContentView(R.layout.activity_register_view);
    ButterKnife.bind(this);

    Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/Pacifico.ttf");
    mChitChat.setTypeface(tf);
  }

  @OnClick(R.id.register_button)
  public void register(View v) {
    if (usernameView.getText().toString().isEmpty() || usernameView.getText().toString().length() < 3) {
      usernameView.setError("Please enter username!!");
      return;
    }
    if (passwordView.getText().toString().isEmpty() || passwordView.getText().toString().length() < 3) {
      passwordView.setError("Please enter password!!");
      return;
    }
    if (!passwordView.getText().toString().equals(repeatPasswordView.getText().toString())) {
      repeatPasswordView.setError("Passwords do not match!!");
      return;
    }

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                              .build();
    RestApi api = retrofit.create(RestApi.class);

    Call<JsonElement> call = api.register(usernameView.getText().toString(), passwordView.getText().toString());

    call.enqueue(new Callback<JsonElement>() {

      @Override
      public void onResponse(final Call<JsonElement> call, final Response<JsonElement> response) {
        if (response.errorBody() != null) {
          usernameView.setError("Username already taken!!");
        } else {
          Toast.makeText(getBaseContext(), "Registration successful!", Toast.LENGTH_LONG).show();
          Intent intent = new Intent(getApplication(), LoginView.class);
          startActivity(intent);
        }
      }

      @Override
      public void onFailure(final Call<JsonElement> call, final Throwable t) {

      }
    });
  }
}
