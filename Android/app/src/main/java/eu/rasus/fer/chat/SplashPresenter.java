package eu.rasus.fer.chat;

import android.content.Intent;
import android.os.Handler;

public class SplashPresenter {
  SplashView mSplashView;

  public SplashPresenter(SplashView splashView) {
    mSplashView = splashView;
  }

  public void startLogIn() {

    Intent intent = new Intent(mSplashView, LoginView.class);
    mSplashView.startActivity(intent);
    mSplashView.finish();
  }

  public void mockWait(){
    Handler handler = new Handler();
    handler.postDelayed(new Runnable() {
      @Override
      public void run() {
        startLogIn();
      }
    }, 2000);
  }
}
