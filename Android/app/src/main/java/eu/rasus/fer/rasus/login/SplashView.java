package eu.rasus.fer.rasus.login;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Window;
import android.view.WindowManager;

import eu.rasus.fer.rasus.R;

public class SplashView extends AppCompatActivity {

  SplashPresenter mSplashPresenter;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.requestWindowFeature(Window.FEATURE_NO_TITLE);
    this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    setContentView(R.layout.activity_splash_view);

    mSplashPresenter = new SplashPresenter(this);

    mSplashPresenter.mockWait();
  }
}
