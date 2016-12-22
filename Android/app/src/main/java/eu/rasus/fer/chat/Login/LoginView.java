package eu.rasus.fer.chat.Login;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;

import org.json.JSONException;
import org.json.JSONObject;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.chat.HttpsConstants;
import eu.rasus.fer.chat.MainActivity;
import eu.rasus.fer.chat.R;
import eu.rasus.fer.chat.RestApi;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LoginView extends AppCompatActivity {

  @BindView(R.id.chitChatLogin)
  TextView mChitChat;

  @BindView(R.id.here_register)
  TextView mHere;

  CallbackManager mCallbackManager;

  @BindView(R.id.login_username)
  TextView usernameView;

  @BindView(R.id.login_password)
  TextView passwordView;


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
          final ProgressDialog progressDialog = new ProgressDialog(LoginView.this);
          progressDialog.setIndeterminate(true);
          progressDialog.setMessage("Authenticating...");
          progressDialog.show();

          GraphRequest request = GraphRequest.newMeRequest(loginResult.getAccessToken(), new GraphRequest.GraphJSONObjectCallback() {

            @Override
              public void onCompleted(JSONObject object, GraphResponse response) {

              try {
                String id = object.getString("id");
                final String username = object.getString("name");
                String image = ((JSONObject) ((JSONObject) object.get("picture")).get("data")).getString("url");

                Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(
                  GsonConverterFactory.create()).build();
                RestApi api = retrofit.create(RestApi.class);

                Call<User> call = api.facebookLogin(id, username, image);

                call.enqueue(new Callback<User>() {

                  @Override
                  public void onResponse(final Call<User> call, final Response<User> response) {
                    loginSuccessful(response);
                  }

                  @Override
                  public void onFailure(final Call<User> call, final Throwable t) {

                  }
                });
              } catch (JSONException e1) {
                e1.printStackTrace();
              }
            }
          });
          Bundle parameters = new Bundle();
          parameters.putString("fields", "id,name,picture");
          request.setParameters(parameters);
          request.executeAsync();
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

  @Override
  public void onBackPressed() {
    moveTaskToBack(true);
  }

  @OnClick(R.id.login_button)
  public void login(View v){
    if (!usernameView.getText().toString().isEmpty() && !passwordView.getText().toString().isEmpty()){

      Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(
        GsonConverterFactory.create()).build();
      RestApi api = retrofit.create(RestApi.class);

      Call<User> call = api.login(usernameView.getText().toString(), passwordView.getText().toString());

      call.enqueue(new Callback<User>() {

        @Override
        public void onResponse(final Call<User> call, final Response<User> response) {
          if (response.errorBody() != null)  Toast.makeText(getBaseContext(), "Login failed", Toast.LENGTH_LONG).show();
           else  loginSuccessful(response);
        }

        @Override
        public void onFailure(final Call<User> call, final Throwable t) {

        }
      });
    }
  }

  public void loginSuccessful(Response<User> response){
    SharedPreferences sharedPref = getSharedPreferences("data", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPref.edit();

    String token = "Bearer " + response.body().token;

    editor.putString("USERNAME", response.body().username);
    editor.putString("TOKEN", token);
    editor.apply();

    eu.rasus.fer.chat.Application.USERNAME =  response.body().username;
    eu.rasus.fer.chat.Application.TOKEN = token;

    Intent intent = new Intent(getApplication(), MainActivity.class);
    startActivity(intent);
  }
}

