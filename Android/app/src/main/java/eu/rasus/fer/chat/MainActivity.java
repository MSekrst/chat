package eu.rasus.fer.chat;

import android.app.FragmentTransaction;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import eu.rasus.fer.chat.ChatsPreview.AllChatsPreviewFragment;

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

    if (id == R.id.action_settings) {
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
    Application.SOCEKT.connect();
    Application.SOCEKT.emit("user", Application.USERNAME);
  }

  @Override
  public void onBackPressed() {
    moveTaskToBack(true);
  }

  @Override
  public void onResume(){
    super.onResume();
    FragmentTransaction ft = getFragmentManager().beginTransaction();
    ft.replace(R.id.container,new AllChatsPreviewFragment()).commit();
  }

}
