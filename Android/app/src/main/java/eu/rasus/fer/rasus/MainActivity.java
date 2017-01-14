package eu.rasus.fer.rasus;

import android.app.FragmentTransaction;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import eu.rasus.fer.rasus.chatsPreview.AllChatsPreviewFragment;
import eu.rasus.fer.rasus.contactList.ContactListActivity;
import eu.rasus.fer.rasus.login.LoginView;
import eu.rasus.fer.rasus.profile.ProfileActivity;

public class MainActivity extends AppCompatActivity {

  @BindView(R.id.container)
  LinearLayout container;

  @BindView(R.id.toolbar)
  Toolbar toolbar;

  @BindView(R.id.toolbar_title)
  TextView title;

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    getMenuInflater().inflate(R.menu.menu_main, menu);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    int id = item.getItemId();

    if (id == R.id.action_profile) {
      Intent intent = new Intent(this, ProfileActivity.class);
      startActivity(intent);
      return true;
    }

    if (id == R.id.action_logOut) {
      Application.SOCEKT.disconnect();

      SharedPreferences sharedPref = getSharedPreferences("data", Context.MODE_PRIVATE);
      SharedPreferences.Editor editor = sharedPref.edit();

      editor.putString("USERNAME", "");
      editor.putString("TOKEN", "");
      editor.apply();

      Intent intent = new Intent(this, LoginView.class);
      startActivity(intent);
      return true;
    }

    return super.onOptionsItemSelected(item);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_main);
    ButterKnife.bind(this);

    Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/Pacifico.ttf");
    title.setTypeface(tf);

    setSupportActionBar(toolbar);
    getSupportActionBar().setTitle(null);

    Application.SOCEKT = HttpsConstants.getSocket();
  }

  @Override
  public void onBackPressed() {
    moveTaskToBack(true);
  }

  @Override
  public void onResume() {
    super.onResume();

    if (!Application.SOCEKT.connected()) {
      Application.SOCEKT.connect();
      Application.SOCEKT.emit("userAndroid", Application.USERNAME);
    }

    FragmentTransaction ft = getFragmentManager().beginTransaction();
    ft.replace(R.id.container, new AllChatsPreviewFragment()).commit();
  }

  @OnClick(R.id.new_chat)
  public void showAllUsers() {
    Intent intent = new Intent(this, ContactListActivity.class);
    startActivity(intent);
  }
}
