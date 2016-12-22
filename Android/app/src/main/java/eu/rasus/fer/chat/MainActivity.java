package eu.rasus.fer.chat;

import android.app.FragmentTransaction;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;

import butterknife.BindView;
import butterknife.ButterKnife;
import eu.rasus.fer.chat.ChatsPreview.AllChatsPreviewFragment;

public class MainActivity extends AppCompatActivity {

  @BindView(R.id.container)
  LinearLayout container;

  @BindView(R.id.toolbar)
  Toolbar toolbar;

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

    setSupportActionBar(toolbar);

    if (savedInstanceState == null) {
      FragmentTransaction ft = getFragmentManager().beginTransaction();
      ft.add(R.id.container,new AllChatsPreviewFragment()).commit();
    }

  }

  @Override
  public void onBackPressed() {
    moveTaskToBack(true);
  }

}
