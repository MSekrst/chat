package eu.rasus.fer.rasus.profile;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.HttpsConstants;
import eu.rasus.fer.rasus.R;
import eu.rasus.fer.rasus.RestApi;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ProfileActivity extends AppCompatActivity {

  @BindView(R.id.profile_username)
  TextView username;

  @BindView(R.id.profile_no_open_chats)
  TextView openChats;

  @BindView(R.id.profile_sent)
  TextView sentMessages;

  @BindView(R.id.profile_recv)
  TextView receivedMessages;

  @BindView(R.id.profile_favourites_image1)
  ImageView favoritesImage1;

  @BindView(R.id.profile_favourites_username1)
  TextView favoritesUsername1;

  @BindView(R.id.profile_favourites_sent1)
  TextView favoritesSent1;

  @BindView(R.id.profile_favourites_recv1)
  TextView favoritesRecv1;

  @BindView(R.id.profile_favourites_image2)
  ImageView favoritesImage2;

  @BindView(R.id.profile_favourites_username2)
  TextView favoritesUsername2;

  @BindView(R.id.profile_favourites_sent2)
  TextView favoritesSent2;

  @BindView(R.id.profile_favourites_recv2)
  TextView favoritesRecv2;

  @BindView(R.id.profile_favourites_label_sent1)
  TextView favoritesLabelSent1;

  @BindView(R.id.profile_favourites_label_sent2)
  TextView favoritesLabelSent2;

  @BindView(R.id.profile_favourites_label_recv1)
  TextView favoritesLabelRecv1;

  @BindView(R.id.profile_favourites_label_recv2)
  TextView favoritesLabelRecv2;

  @BindView(R.id.profile_toolbar)
  Toolbar toolbar;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_profile);
    ButterKnife.bind(this);

    setSupportActionBar(toolbar);
    getSupportActionBar().setTitle(null);
  }

  @Override
  public void onResume() {
    super.onResume();

    Retrofit retrofit = new Retrofit.Builder().baseUrl(HttpsConstants.ADDRES).client(HttpsConstants.getUnsafeOkHttpClient()).addConverterFactory(GsonConverterFactory.create())
                                              .build();
    RestApi api = retrofit.create(RestApi.class);

    Call<Profile> call = api.getProfile(Application.TOKEN);

    final Activity activity = this;

    call.enqueue(new Callback<Profile>() {

      @Override
      public void onResponse(final Call<Profile> call, final Response<Profile> response) {
        Profile profile = response.body();
        username.setText(profile.username);
        openChats.setText(String.valueOf(profile.numberOfConversations));
        sentMessages.setText(String.valueOf(profile.totalSendMessages));
        receivedMessages.setText(String.valueOf(profile.totalReceivedMessages));

        if (profile.favourites.length >= 1) {
          favoritesUsername1.setText(profile.favourites[0].username);

          if (profile.favourites[0].img != null && !profile.favourites[0].img.equals("")) {
            Picasso.with(activity).load(profile.favourites[0].img).fit().centerCrop().noFade().into(favoritesImage1);
          } else {
            favoritesImage1.setImageResource(R.drawable.placeholder);
          }

          favoritesLabelSent1.setText("sent:");
          favoritesSent1.setText(String.valueOf(profile.favourites[0].sendMessages));
          favoritesLabelRecv1.setText("received:");
          favoritesRecv1.setText(String.valueOf(profile.favourites[0].receivedMessages));
        }

        if (profile.favourites.length == 2) {
          favoritesUsername2.setText(profile.favourites[1].username);

          if (profile.favourites[1].img != null && !profile.favourites[1].img.equals("")) {
            Picasso.with(activity).load(profile.favourites[1].img).fit().centerCrop().noFade().into(favoritesImage2);
          } else {
            favoritesImage2.setImageResource(R.drawable.placeholder);
          }

          favoritesLabelSent2.setText("sent:");
          favoritesSent2.setText(String.valueOf(profile.favourites[1].sendMessages));
          favoritesLabelRecv2.setText("received:");
          favoritesRecv2.setText(String.valueOf(profile.favourites[1].receivedMessages));
        }
      }

      @Override
      public void onFailure(final Call<Profile> call, final Throwable t) {
      }
    });
  }

  @OnClick(R.id.profile_back)
  public void back(View v) {
    onBackPressed();
  }
}
